/**
 * Gemini Service
 * Integration with Google Gemini API for AI image generation
 */

// Gemini API Configuration
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

/**
 * Generate exercise description using Gemini
 * @param {string} exerciseName - Exercise name
 * @param {Array} instructions - Exercise instructions
 * @returns {Promise<string>} Generated description
 */
export const generateExerciseDescription = async (exerciseName, instructions = []) => {
    try {
        const prompt = `Describe the exercise "${exerciseName}" in 2-3 sentences, focusing on proper form and key benefits. Be concise and instructional.`;

        const response = await fetch(
            `${GEMINI_API_BASE_URL}/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            }
        );

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status}`);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        return text;
    } catch (error) {
        console.error('Gemini description generation error:', error);
        return `${exerciseName} is a fundamental exercise. Follow the instructions carefully for proper form and maximum benefit.`;
    }
};

/**
 * Generate a placeholder image URL for exercise
 * Since Gemini doesn't support direct image generation in the free API,
 * we'll use a combination of Unsplash and generated descriptions
 * @param {string} exerciseName - Exercise name
 * @returns {Promise<string>} Image URL
 */
export const generateExerciseImage = async (exerciseName) => {
    try {
        // Use Unsplash for high-quality exercise images
        const searchTerm = exerciseName.toLowerCase().replace(/\s+/g, '-');
        const unsplashUrl = `https://source.unsplash.com/800x600/?fitness,${searchTerm},exercise`;

        return unsplashUrl;
    } catch (error) {
        console.error('Error generating exercise image:', error);
        // Fallback to a generic fitness image
        return 'https://source.unsplash.com/800x600/?fitness,workout';
    }
};

/**
 * Get exercise form tips using Gemini AI
 * @param {string} exerciseName - Exercise name
 * @returns {Promise<Array>} Array of form tips
 */
export const getAIFormTips = async (exerciseName) => {
    try {
        const prompt = `List 3 crucial form tips for the exercise "${exerciseName}". Be concise, each tip should be one sentence. Format as a simple list.`;

        const response = await fetch(
            `${GEMINI_API_BASE_URL}/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            }
        );

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status}`);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        // Parse the response into an array
        const tips = text
            .split('\n')
            .filter(line => line.trim() && (line.includes('-') || line.includes('•') || /^\d/.test(line)))
            .map(line => line.replace(/^[-•\d.)\s]+/, '').trim())
            .filter(tip => tip.length > 0)
            .slice(0, 3);

        return tips.length > 0 ? tips : [
            "Maintain proper form throughout the movement",
            "Engage your core for stability",
            "Breathe consistently - exhale on exertion"
        ];
    } catch (error) {
        console.error('Error getting AI form tips:', error);
        return [
            "Maintain proper form throughout the movement",
            "Engage your core for stability",
            "Breathe consistently - exhale on exertion"
        ];
    }
};

/**
 * Cache generated content
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 */
export const cacheGeminiContent = (key, data) => {
    try {
        const cacheKey = `gemini_${key.replace(/\s+/g, '_')}`;
        const cacheData = {
            data,
            timestamp: Date.now(),
            expiresIn: 30 * 24 * 60 * 60 * 1000 // 30 days
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
        console.error('Error caching Gemini content:', error);
    }
};

/**
 * Get cached Gemini content
 * @param {string} key - Cache key
 * @returns {any|null} Cached data or null
 */
export const getCachedGeminiContent = (key) => {
    try {
        const cacheKey = `gemini_${key.replace(/\s+/g, '_')}`;
        const cached = localStorage.getItem(cacheKey);

        if (!cached) return null;

        const cacheData = JSON.parse(cached);
        const now = Date.now();

        if (now - cacheData.timestamp > cacheData.expiresIn) {
            localStorage.removeItem(cacheKey);
            return null;
        }

        return cacheData.data;
    } catch (error) {
        console.error('Error getting cached Gemini content:', error);
        return null;
    }
};

/**
 * Generate comprehensive exercise data with caching
 * @param {string} exerciseName - Exercise name
 * @returns {Promise<Object>} Generated exercise data
 */
export const generateExerciseData = async (exerciseName) => {
    const cacheKey = `exercise_data_${exerciseName}`;

    // Try cache first
    const cached = getCachedGeminiContent(cacheKey);
    if (cached) {
        console.log('Using cached Gemini data for:', exerciseName);
        return cached;
    }

    // Generate new data
    const [description, formTips, imageUrl] = await Promise.all([
        generateExerciseDescription(exerciseName),
        getAIFormTips(exerciseName),
        generateExerciseImage(exerciseName)
    ]);

    const data = {
        description,
        formTips,
        imageUrl
    };

    // Cache the result
    cacheGeminiContent(cacheKey, data);

    return data;
};

