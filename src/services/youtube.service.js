/**
 * YouTube Service
 * Integration with YouTube Data API v3 for exercise videos
 */

// YouTube API Configuration
const YOUTUBE_API_KEY = process.env.EXPO_PUBLIC_YOUTUBE_API_KEY;
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

/**
 * Search for exercise videos on YouTube
 * @param {string} query - Search query (e.g., "jumping jacks exercise tutorial")
 * @param {number} maxResults - Maximum number of results (default: 1)
 * @returns {Promise<Array>} Array of video results
 */
export const searchExerciseVideo = async (query, maxResults = 1) => {
    try {
        const params = new URLSearchParams({
            part: 'snippet',
            q: query,
            type: 'video',
            videoDuration: 'short', // Short videos (< 4 minutes)
            videoEmbeddable: 'true',
            maxResults: maxResults.toString(),
            order: 'relevance',
            key: YOUTUBE_API_KEY
        });

        const response = await fetch(`${YOUTUBE_API_BASE_URL}/search?${params}`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('YouTube API error response:', errorText);
            throw new Error(`YouTube API error: ${response.status}`);
        }

        const data = await response.json();

        return data.items?.map(item => ({
            videoId: item.id.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.high.url,
            channelTitle: item.snippet.channelTitle,
            description: item.snippet.description
        })) || [];
    } catch (error) {
        console.error('YouTube search error:', error);
        return [];
    }
};

/**
 * Get the best exercise video
 * @param {string} exerciseName - Exercise name
 * @param {string} searchQuery - Custom search query (optional)
 * @returns {Promise<Object|null>} Video data or null
 */
export const getBestExerciseVideo = async (exerciseName, searchQuery = null) => {
    try {
        // Use custom query or construct one
        const query = searchQuery || `${exerciseName} exercise proper form tutorial`;

        const videos = await searchExerciseVideo(query, 1);

        if (videos.length > 0) {
            return videos[0];
        }

        return null;
    } catch (error) {
        console.error('Error getting exercise video:', error);
        return null;
    }
};

/**
 * Get YouTube embed URL
 * @param {string} videoId - YouTube video ID
 * @returns {string} Embed URL
 */
export const getEmbedUrl = (videoId) => {
    return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`;
};

/**
 * Get YouTube watch URL
 * @param {string} videoId - YouTube video ID
 * @returns {string} Watch URL
 */
export const getWatchUrl = (videoId) => {
    return `https://www.youtube.com/watch?v=${videoId}`;
};

/**
 * Cache video data in localStorage
 * @param {string} exerciseName - Exercise name
 * @param {Object} videoData - Video data to cache
 */
export const cacheVideoData = (exerciseName, videoData) => {
    try {
        const cacheKey = `exercise_video_${exerciseName.replace(/\s+/g, '_')}`;
        const cacheData = {
            videoData,
            timestamp: Date.now(),
            expiresIn: 7 * 24 * 60 * 60 * 1000 // 7 days
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
        console.error('Error caching video data:', error);
    }
};

/**
 * Get cached video data
 * @param {string} exerciseName - Exercise name
 * @returns {Object|null} Cached video data or null
 */
export const getCachedVideoData = (exerciseName) => {
    try {
        const cacheKey = `exercise_video_${exerciseName.replace(/\s+/g, '_')}`;
        const cached = localStorage.getItem(cacheKey);

        if (!cached) return null;

        const cacheData = JSON.parse(cached);
        const now = Date.now();

        // Check if cache is expired
        if (now - cacheData.timestamp > cacheData.expiresIn) {
            localStorage.removeItem(cacheKey);
            return null;
        }

        return cacheData.videoData;
    } catch (error) {
        console.error('Error getting cached video:', error);
        return null;
    }
};

/**
 * Get exercise video with caching
 * @param {string} exerciseName - Exercise name
 * @param {string} searchQuery - Custom search query (optional)
 * @returns {Promise<Object|null>} Video data or null
 */
export const getExerciseVideoWithCache = async (exerciseName, searchQuery = null) => {
    // Try cache first
    const cached = getCachedVideoData(exerciseName);
    if (cached) {
        console.log('Using cached video for:', exerciseName);
        return cached;
    }

    // Fetch from YouTube
    const video = await getBestExerciseVideo(exerciseName, searchQuery);

    // Cache the result
    if (video) {
        cacheVideoData(exerciseName, video);
    }

    return video;
};

