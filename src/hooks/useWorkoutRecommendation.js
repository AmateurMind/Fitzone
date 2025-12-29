import { useState, useEffect } from 'react';
import { getAIWorkoutRecommendation } from '../services/ai.service';

/**
 * Hook for getting AI-powered workout recommendations
 * @param {Object} userProfile - User profile with goal, level, preferences
 * @returns {Object} { recommendedWorkout, loading, error }
 */
export const useWorkoutRecommendation = (userProfile = { goal: 'general', level: 'Intermediate' }) => {
    const [recommendedWorkout, setRecommendedWorkout] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecommendation = async () => {
            try {
                setLoading(true);
                setError(null);
                const recommendation = await getAIWorkoutRecommendation(userProfile);
                setRecommendedWorkout(recommendation);
            } catch (err) {
                console.error('Error fetching recommendation:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendation();
    }, [userProfile.goal, userProfile.level]);

    return { recommendedWorkout, loading, error };
};
