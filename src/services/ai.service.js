/**
 * AI Service
 * Provides AI-powered features using OpenRouter API
 */

import { saveAIRecommendation, getAIRecommendation, saveUser, getUserById, saveUserPlan } from './firestore.service';
import { getWorkouts } from './workouts.service';
import { getGyms } from './gyms.service';
import { getCurrentUserId } from './auth.service';

// OpenRouter API Configuration
const OPENROUTER_API_KEY = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY;
const OPENROUTER_MODEL = 'xiaomi/mimo-v2-flash:free';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

/**
 * Call OpenRouter API
 * @param {string} prompt - The prompt to send
 * @param {Array} messages - Chat history (optional)
 * @returns {Promise<string>} AI response
 */
const callOpenRouterAPI = async (prompt, messages = []) => {
    try {
        const requestMessages = [
            ...messages,
            {
                role: 'user',
                content: prompt
            }
        ];

        const response = await fetch(OPENROUTER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'HTTP-Referer': window?.location?.origin || 'https://fitzone.app',
                'X-Title': 'FitZone Fitness App'
            },
            body: JSON.stringify({
                model: OPENROUTER_MODEL,
                messages: requestMessages,
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `API error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';
    } catch (error) {
        console.error('OpenRouter API Error:', error);
        throw error;
    }
};

/**
 * Generate workout recommendations based on user profile and goals
 * Uses OpenRouter AI for intelligent recommendations
 * @param {Object} userProfile - User's fitness profile { goal, level, preferences }
 * @returns {Promise<Object>} Recommended workout plan
 */
export const getAIWorkoutRecommendation = async (userProfile) => {
    try {
        const userId = getCurrentUserId();

        // Check for cached recommendation
        const cached = await getAIRecommendation(userId);
        if (cached && cached.goal === userProfile.goal) {
            return {
                recommendationId: cached.recommendationId || 'cached',
                reason: cached.reason || "Based on your preferences",
                suggestedWorkout: cached.suggestedWorkout,
                cached: true
            };
        }

        // Get all available workouts
        const allWorkouts = await getWorkouts();

        const { goal, level = 'Intermediate', preferences = [] } = userProfile;

        // Create workout list for AI context
        const workoutList = allWorkouts.map(w =>
            `${w.title} (${w.duration}min, ${w.difficulty}, ${w.category}, ${w.calories} cal)`
        ).join(', ');

        // Generate AI recommendation using OpenRouter
        const aiPrompt = `You are a fitness trainer AI. Based on the user's goal: "${goal}", fitness level: "${level}", and available workouts: ${workoutList}, recommend the best workout. 

Respond in this JSON format:
{
  "workoutTitle": "exact workout title from the list",
  "reason": "brief personalized reason (1-2 sentences)",
  "tips": "one helpful tip for this workout"
}`;

        let aiResponse;
        try {
            aiResponse = await callOpenRouterAPI(aiPrompt);

            // Try to parse JSON response
            let parsedResponse;
            try {
                // Extract JSON from response if it's wrapped in text
                const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    parsedResponse = JSON.parse(jsonMatch[0]);
                } else {
                    parsedResponse = JSON.parse(aiResponse);
                }
            } catch (parseError) {
                // If not JSON, use the response as reason
                parsedResponse = {
                    reason: aiResponse,
                    workoutTitle: allWorkouts[0]?.title || 'Full Body HIIT Blast'
                };
            }

            // Find the recommended workout
            const recommendedWorkout = allWorkouts.find(w =>
                w.title.toLowerCase().includes(parsedResponse.workoutTitle?.toLowerCase() || '')
            ) || allWorkouts[0];

            const recommendation = {
                recommendationId: 'rec_' + Date.now(),
                reason: parsedResponse.reason || `Based on your ${goal} goal and ${level} level, this workout is perfect for you!`,
                suggestedWorkout: {
                    id: recommendedWorkout.id,
                    title: recommendedWorkout.title,
                    duration: recommendedWorkout.duration,
                    calories: recommendedWorkout.calories,
                    difficulty: recommendedWorkout.difficulty,
                    focus: recommendedWorkout.category,
                    exercises: recommendedWorkout.exercises || []
                },
                tip: parsedResponse.tips
            };

            // Save to database
            await saveAIRecommendation(userId, {
                goal: goal,
                recommendedWorkouts: [recommendedWorkout.id],
                ...recommendation
            });

            return recommendation;
        } catch (aiError) {
            console.error('AI recommendation error, using fallback:', aiError);
            // Fallback to intelligent matching
            return getFallbackRecommendation(userProfile, allWorkouts, userId);
        }
    } catch (error) {
        console.error('Error generating AI recommendation:', error);
        // Fallback recommendation
        return {
            recommendationId: 'fallback_' + Date.now(),
            reason: "Here's a great workout to get you started!",
            suggestedWorkout: {
                title: "Full Body HIIT Blast",
                duration: 30,
                difficulty: "Intermediate",
                focus: ["Cardio", "Strength"],
                exercises: []
            }
        };
    }
};

/**
 * Fallback recommendation algorithm (used if AI fails)
 */
const getFallbackRecommendation = async (userProfile, allWorkouts, userId) => {
    const { goal, level = 'Intermediate' } = userProfile;
    let recommendedWorkouts = [];

    if (goal === 'fat_loss' || goal === 'weight_loss') {
        recommendedWorkouts = allWorkouts.filter(w =>
            w.category === 'HIIT' || w.category === 'Cardio' || w.calories > 250
        );
    } else if (goal === 'muscle_gain' || goal === 'build_muscle') {
        recommendedWorkouts = allWorkouts.filter(w =>
            w.category === 'Strength' || w.difficulty === 'Advanced' || w.difficulty === 'Intermediate'
        );
    } else if (goal === 'flexibility' || goal === 'mobility') {
        recommendedWorkouts = allWorkouts.filter(w =>
            w.category === 'Yoga' || w.title.toLowerCase().includes('stretch')
        );
    } else {
        recommendedWorkouts = allWorkouts;
    }

    recommendedWorkouts = recommendedWorkouts.filter(w => {
        if (level === 'Beginner') return w.difficulty === 'Beginner';
        if (level === 'Advanced') return w.difficulty === 'Advanced' || w.difficulty === 'Intermediate';
        return true;
    });

    const selectedWorkout = recommendedWorkouts.length > 0
        ? recommendedWorkouts[Math.floor(Math.random() * recommendedWorkouts.length)]
        : allWorkouts[0];

    const recommendation = {
        recommendationId: 'rec_' + Date.now(),
        reason: `Based on your goal to ${goal} and your ${level} level, this workout is perfect for you!`,
        suggestedWorkout: {
            id: selectedWorkout.id,
            title: selectedWorkout.title,
            duration: selectedWorkout.duration,
            calories: selectedWorkout.calories,
            difficulty: selectedWorkout.difficulty,
            focus: selectedWorkout.category,
            exercises: selectedWorkout.exercises || []
        }
    };

    await saveAIRecommendation(userId, {
        goal: goal,
        recommendedWorkouts: [selectedWorkout.id],
        ...recommendation
    });

    return recommendation;
};

/**
 * Chat with AI Fitness Assistant using OpenRouter
 * @param {string} message - User's question
 * @param {Array} history - Chat history
 * @returns {Promise<string>} AI Response
 */
export const chatWithAITrainer = async (message, history = []) => {
    try {
        // Build conversation history
        const conversationHistory = history.map(msg => ({
            role: msg.role || (msg.fromUser ? 'user' : 'assistant'),
            content: msg.content || msg.message
        }));

        // Create system prompt for fitness trainer
        const systemPrompt = `You are a friendly and knowledgeable AI fitness trainer assistant named FitBot. You help users with:
- Workout recommendations and exercise advice
- Nutrition and diet tips
- Fitness goals and motivation
- Exercise form and technique
- Recovery and rest advice
- General fitness questions

When users ask you to "make a plan", "create a workout plan", "diet plan", or similar, inform them to use the quick action buttons below the chat for a personalized structured plan.

Keep responses concise (2-4 sentences), encouraging, and practical. Use emojis sparingly.`;

        const fullPrompt = `${systemPrompt}\n\nUser question: ${message}`;

        // Call OpenRouter API
        const aiResponse = await callOpenRouterAPI(fullPrompt, conversationHistory);
        return aiResponse;
    } catch (error) {
        console.error('Error in chatWithAITrainer:', error);
        // Fallback responses
        const lowerMessage = message.toLowerCase();

        if (lowerMessage.includes('calorie') || lowerMessage.includes('burn')) {
            return "On average, a 30-minute HIIT session burns 300-450 calories, while strength training burns 200-300 calories. The exact amount depends on your weight, intensity, and fitness level.";
        }

        if (lowerMessage.includes('muscle') || lowerMessage.includes('strength')) {
            return "To build muscle effectively, focus on progressive overload - gradually increase weight or reps. Aim for 3-4 strength training sessions per week, targeting different muscle groups. Ensure adequate protein intake and rest days for recovery.";
        }

        if (lowerMessage.includes('weight') || lowerMessage.includes('lose')) {
            return "Weight loss requires a combination of regular exercise and a calorie deficit. HIIT and cardio workouts are excellent for burning calories. Aim for 150-300 minutes of moderate exercise per week. Remember, nutrition is 70% of the equation!";
        }

        return "I'm here to help with your fitness journey! Feel free to ask me about workouts, nutrition, or training tips. If you have a specific question, I'd be happy to help!";
    }
};

/**
 * Generate a complete personalized fitness plan
 * @param {Object} userPreferences - User's fitness preferences
 * @returns {Promise<Object>} Complete fitness plan
 */
export const generateCompleteFitnessPlan = async (userPreferences) => {
    try {
        const {
            goal = 'general_fitness',
            fitnessLevel = 'beginner',
            daysPerWeek = 4,
            duration = 30,
            equipment = 'gym',
            injuries = 'none',
            age = 25,
            weight = 70
        } = userPreferences;

        const prompt = `Create a personalized weekly fitness plan for someone with these details:
- Goal: ${goal}
- Fitness Level: ${fitnessLevel}
- Available Days: ${daysPerWeek} days per week
- Preferred Workout Duration: ${duration} minutes
- Equipment Access: ${equipment}
- Injuries/Limitations: ${injuries}
- Age: ${age}, Weight: ${weight}kg

Respond with a JSON object:
{
    "planName": "catchy plan name",
    "summary": "brief 2-sentence summary of the plan",
    "weeklySchedule": [
        {"day": "Monday", "workout": "workout name", "focus": "muscle groups", "duration": 30, "type": "Strength/Cardio/Rest"},
        ...for each day
    ],
    "tips": ["tip1", "tip2", "tip3"],
    "expectedResults": "what to expect in 4-8 weeks"
}`;

        const aiResponse = await callOpenRouterAPI(prompt);

        // Parse JSON response with better error handling
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                // Clean up the JSON string
                let jsonStr = jsonMatch[0];
                // Remove any trailing commas before closing brackets
                jsonStr = jsonStr.replace(/,(\s*[}\]])/g, '$1');
                const plan = JSON.parse(jsonStr);

                // Save to Firestore
                const userId = getCurrentUserId();
                if (userId) {
                    try {
                        await saveUserPlan(userId, {
                            type: 'workout',
                            planName: plan.planName,
                            plan: plan,
                            preferences: userPreferences,
                            status: 'active'
                        });
                        console.log('Workout plan saved successfully');
                    } catch (saveError) {
                        console.error('Error saving workout plan:', saveError);
                    }
                }

                return { success: true, plan };
            } catch (parseError) {
                console.error('JSON parse error:', parseError);
                throw new Error('Could not parse plan');
            }
        }

        throw new Error('Could not parse plan');
    } catch (error) {
        console.error('Error generating fitness plan:', error);
        // Return a fallback plan and save it
        const fallbackPlan = {
            planName: "Balanced Fitness Starter",
            summary: "A balanced 4-day program combining strength and cardio to build a solid fitness foundation.",
            weeklySchedule: [
                { day: "Monday", workout: "Upper Body Strength", focus: "Chest, Shoulders, Triceps", duration: 30, type: "Strength" },
                { day: "Tuesday", workout: "HIIT Cardio", focus: "Full Body", duration: 25, type: "Cardio" },
                { day: "Wednesday", workout: "Rest & Stretch", focus: "Recovery", duration: 15, type: "Rest" },
                { day: "Thursday", workout: "Lower Body Strength", focus: "Legs, Glutes", duration: 30, type: "Strength" },
                { day: "Friday", workout: "Core & Cardio", focus: "Abs, Cardio", duration: 25, type: "Cardio" },
                { day: "Saturday", workout: "Active Recovery", focus: "Light Movement", duration: 20, type: "Rest" },
                { day: "Sunday", workout: "Full Rest", focus: "Recovery", duration: 0, type: "Rest" }
            ],
            tips: [
                "Start each workout with 5-min warm-up",
                "Stay hydrated - drink 2-3L water daily",
                "Get 7-8 hours of sleep for recovery"
            ],
            expectedResults: "In 4-8 weeks, expect improved endurance, strength gains, and better energy levels."
        };

        // Try to save fallback plan
        const userId = getCurrentUserId();
        if (userId) {
            try {
                await saveUserPlan(userId, {
                    type: 'workout',
                    planName: fallbackPlan.planName,
                    plan: fallbackPlan,
                    preferences: userPreferences,
                    status: 'active'
                });
                console.log('Fallback workout plan saved successfully');
            } catch (saveError) {
                console.error('Error saving fallback plan:', saveError);
            }
        }

        return { success: true, plan: fallbackPlan };
    }
};

/**
 * Generate a personalized diet plan
 * @param {Object} userPreferences - User's diet preferences
 * @returns {Promise<Object>} Diet plan
 */
export const generateDietPlan = async (userPreferences) => {
    try {
        const {
            goal = 'maintain',
            dietType = 'balanced',
            allergies = 'none',
            mealsPerDay = 3,
            budget = 'moderate',
            cookingTime = 'moderate',
            weight = 70,
            targetWeight = 70
        } = userPreferences;

        const calorieEstimate = goal === 'lose_weight' ? Math.round(weight * 24) :
            goal === 'gain_muscle' ? Math.round(weight * 32) :
                Math.round(weight * 28);

        const prompt = `Create a personalized daily diet plan:
- Goal: ${goal}
- Diet Type: ${dietType}
- Allergies: ${allergies}
- Meals Per Day: ${mealsPerDay}
- Budget: ${budget}
- Cooking Time: ${cookingTime}
- Current Weight: ${weight}kg, Target: ${targetWeight}kg
- Estimated Daily Calories: ${calorieEstimate}

IMPORTANT: Respond STRICTLY with VALID JSON only. Do not wrap in markdown code blocks. Do not add comments. Do not include any text outside the JSON object.

Example JSON Structure:
{
    "planName": "diet plan name",
    "dailyCalories": ${calorieEstimate},
    "macros": {"protein": "Xg", "carbs": "Xg", "fat": "Xg"},
    "meals": [
        {"meal": "Breakfast", "time": "8:00 AM", "foods": ["food1", "food2"], "calories": 400, "prep": "5 min"},
        {"meal": "Lunch", "time": "12:00 PM", "foods": ["food3"], "calories": 500, "prep": "10 min"},
        {"meal": "Dinner", "time": "6:00 PM", "foods": ["food4"], "calories": 600, "prep": "20 min"}
    ],
    "groceryList": ["item1", "item2"],
    "tips": ["tip1", "tip2"],
    "weeklyBudget": "$X"
}`;

        const aiResponse = await callOpenRouterAPI(prompt);

        // More robust JSON extraction
        let jsonStr = aiResponse;

        // Find the first '{' and the last '}'
        const firstOpen = jsonStr.indexOf('{');
        const lastClose = jsonStr.lastIndexOf('}');

        if (firstOpen !== -1 && lastClose !== -1 && lastClose > firstOpen) {
            jsonStr = jsonStr.substring(firstOpen, lastClose + 1);
        }

        // Clean up common JSON errors
        jsonStr = jsonStr
            .replace(/```json/g, '') // Remove markdown start
            .replace(/```/g, '')     // Remove markdown end
            .replace(/\s+\/\/.*/g, '') // Remove single line comments
            .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas

        const plan = JSON.parse(jsonStr);

        const userId = getCurrentUserId();
        if (userId) {
            try {
                await saveUserPlan(userId, {
                    type: 'diet',
                    planName: plan.planName,
                    plan: plan,
                    preferences: userPreferences,
                    status: 'active'
                });
                console.log('Diet plan saved successfully');
            } catch (saveError) {
                console.error('Error saving diet plan:', saveError);
            }
        }

        return { success: true, plan };
        return { success: true, plan };
    } catch (error) {
        console.error('Error generating diet plan:', error);

        const isVeg = userPreferences.dietType === 'Vegetarian' || userPreferences.dietType === 'Vegan';

        const fallbackPlan = {
            planName: isVeg ? "Plant-Based Nutrition Plan" : "Balanced Nutrition Plan",
            dailyCalories: 2000,
            macros: isVeg
                ? { protein: "120g", carbs: "250g", fat: "60g" }
                : { protein: "150g", carbs: "200g", fat: "70g" },
            meals: [
                {
                    meal: "Breakfast",
                    time: "8:00 AM",
                    foods: ["Oatmeal with banana", "Almonds", "Coffee"],
                    calories: 450,
                    prep: "10 min"
                },
                {
                    meal: "Lunch",
                    time: "12:30 PM",
                    foods: isVeg ? ["Quinoa salad", "Chickpeas", "Avocado"] : ["Grilled chicken breast", "Brown rice", "Mixed vegetables"],
                    calories: 550,
                    prep: "15 min"
                },
                {
                    meal: "Dinner",
                    time: "7:00 PM",
                    foods: isVeg ? ["Tofu stir-fry", "Sweet potato", "Broccoli"] : ["Salmon fillet", "Sweet potato", "Broccoli"],
                    calories: 600,
                    prep: "25 min"
                },
                {
                    meal: "Snacks",
                    time: "Throughout day",
                    foods: ["Apple", "Protein shake", "Walnuts"],
                    calories: 400,
                    prep: "5 min"
                }
            ],
            groceryList: isVeg
                ? ["Oats", "Bananas", "Quinoa", "Chickpeas", "Avocado", "Tofu", "Sweet potatoes", "Broccoli", "Almonds", "Walnuts", "Plant protein powder"]
                : ["Chicken breast", "Salmon", "Oats", "Bananas", "Greek yogurt", "Brown rice", "Sweet potatoes", "Broccoli", "Almonds", "Apples", "Protein powder"],
            tips: ["Meal prep on Sundays to save time", "Drink water before each meal", isVeg ? "Ensure variety for complete proteins" : "Focus on lean protein sources"],
            weeklyBudget: "$80-100"
        };

        const userId = getCurrentUserId();
        if (userId) {
            try {
                await saveUserPlan(userId, {
                    type: 'diet',
                    planName: fallbackPlan.planName,
                    plan: fallbackPlan,
                    preferences: userPreferences,
                    status: 'active'
                });
                console.log('Fallback diet plan saved successfully');
            } catch (saveError) {
                console.error('Error saving fallback diet plan:', saveError);
            }
        }

        return {
            success: true,
            plan: fallbackPlan
        };
    }
};

/**
 * Get gym recommendations based on user preferences
 * @param {Object} preferences - User preferences for gym
 * @returns {Promise<Object>} Gym recommendations
 */
export const getGymRecommendations = async (preferences = {}) => {
    try {
        const {
            budget = 'moderate',
            location = 'any',
            amenities = [],
            schedule = 'flexible'
        } = preferences;

        // Get available gyms from database
        const gyms = await getGyms();

        if (gyms.length === 0) {
            return {
                success: true,
                recommendations: [],
                advice: "No gyms found in the database. Check back later or explore gyms in your area!"
            };
        }

        const gymList = gyms.map(g =>
            `${g.name} - Rating: ${g.rating}, Price: ${g.priceRange || 'N/A'}, Amenities: ${g.amenities?.join(', ') || 'Standard'}`
        ).join('\n');

        const prompt = `Based on these available gyms:
${gymList}

And user preferences:
- Budget: ${budget}
- Preferred Location: ${location}
- Desired Amenities: ${amenities.join(', ') || 'any'}
- Schedule Flexibility: ${schedule}

Recommend the best gym and explain why. Respond with JSON:
{
    "topPick": "gym name",
    "reason": "2-3 sentence explanation",
    "alternativePick": "second choice gym name",
    "alternativeReason": "why this is a good backup",
    "tips": ["tip for getting the most out of gym membership"]
}`;

        const aiResponse = await callOpenRouterAPI(prompt);

        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const recommendations = JSON.parse(jsonMatch[0]);

            // Find the actual gym objects
            const topGym = gyms.find(g => g.name.toLowerCase().includes(recommendations.topPick?.toLowerCase() || ''));
            const altGym = gyms.find(g => g.name.toLowerCase().includes(recommendations.alternativePick?.toLowerCase() || ''));

            return {
                success: true,
                recommendations: {
                    ...recommendations,
                    topGymDetails: topGym || gyms[0],
                    alternativeGymDetails: altGym || gyms[1]
                },
                allGyms: gyms
            };
        }

        // Fallback
        return {
            success: true,
            recommendations: {
                topPick: gyms[0]?.name || "Local Gym",
                reason: "This gym offers great facilities and flexible hours perfect for your schedule.",
                topGymDetails: gyms[0],
                tips: ["Visit during off-peak hours for less crowded workouts"]
            },
            allGyms: gyms
        };
    } catch (error) {
        console.error('Error getting gym recommendations:', error);
        return {
            success: false,
            error: "Could not generate gym recommendations. Please try again."
        };
    }
};

/**
 * Generate motivational content or workout description using AI
 * @param {string} type - 'motivation' | 'description' | 'tip'
 * @param {Object} context - Optional context (workout name, user stats, etc.)
 * @returns {Promise<string>} Generated text
 */
export const generateAIContent = async (type, context = {}) => {
    try {
        let prompt = '';

        if (type === 'motivation') {
            prompt = 'Generate a short, inspiring fitness motivation quote (1 sentence). Make it encouraging and energetic.';
        } else if (type === 'description') {
            const workoutName = context.workoutName || 'this workout';
            prompt = `Write a brief, engaging description (2-3 sentences) for a fitness workout called "${workoutName}". Make it exciting and informative.`;
        } else if (type === 'tip') {
            prompt = 'Give one practical fitness tip (1-2 sentences) that would help someone improve their workout routine.';
        } else {
            prompt = 'Generate an encouraging fitness message.';
        }

        const aiResponse = await callOpenRouterAPI(prompt);
        return aiResponse;
    } catch (error) {
        console.error('Error in generateAIContent:', error);
        // Fallback content
        const fallbacks = {
            motivation: "Sweat is just fat crying. Keep pushing! 💪",
            description: "This workout is designed to push your limits with high-intensity intervals followed by active recovery.",
            tip: "Stay hydrated! Drink water before, during, and after your workout."
        };
        return fallbacks[type] || "Keep pushing towards your goals! You've got this! 💪";
    }
};

/**
 * Analyze workout performance and provide insights using AI
 * @param {Object} workoutData - Completed workout data
 * @returns {Promise<Object>} Analysis and recommendations
 */
export const analyzeWorkoutPerformance = async (workoutData) => {
    try {
        const { duration, calories, difficulty, workoutName } = workoutData;

        const prompt = `Analyze this workout performance and provide feedback:
- Workout: ${workoutName || 'Completed workout'}
- Duration: ${duration} minutes
- Calories burned: ${calories}
- Difficulty: ${difficulty}

Provide:
1. A brief encouraging feedback (1-2 sentences)
2. One suggestion for improvement
3. Two next steps

Format as JSON: {"feedback": "...", "suggestions": ["..."], "nextSteps": ["...", "..."]}`;

        const aiResponse = await callOpenRouterAPI(prompt);

        // Try to parse JSON
        try {
            const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
            const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(aiResponse);
            return {
                feedback: parsed.feedback || "Great job completing your workout!",
                suggestions: parsed.suggestions || ["Keep up the consistency!"],
                nextSteps: parsed.nextSteps || ["Rest and recover", "Stay hydrated"]
            };
        } catch (parseError) {
            // If parsing fails, use structured response
            return {
                feedback: aiResponse.split('\n')[0] || "Great job completing your workout!",
                suggestions: [aiResponse.split('\n')[1] || "Keep up the consistency!"],
                nextSteps: ["Rest and recover properly", "Stay hydrated", "Plan your next workout"]
            };
        }
    } catch (error) {
        console.error('Error analyzing workout:', error);
        return {
            feedback: "Workout completed! Great job!",
            suggestions: ["Keep up the consistency!"],
            nextSteps: ["Rest and recover", "Stay hydrated"]
        };
    }
};
