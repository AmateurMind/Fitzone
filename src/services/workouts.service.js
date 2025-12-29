/**
 * Workouts Service
 * Handles all workout-related operations using Firestore
 */

import { getWorkouts as getWorkoutsFromDB, getWorkoutById as getWorkoutByIdFromDB } from './firestore.service';

/**
 * Get all workouts with optional filters
 * @param {Object} filters - Optional filters (difficulty, category, isPremium)
 * @returns {Promise<Array>} Array of workouts
 */
export const getWorkouts = async (filters = {}) => {
    try {
        const workouts = await getWorkoutsFromDB(filters);
        return workouts;
    } catch (error) {
        console.error('Error in getWorkouts service:', error);
        // Fallback to empty array on error
        return [];
    }
};

/**
 * Get workout by ID
 * @param {string} id - Workout ID
 * @returns {Promise<Object|null>} Workout object or null
 */
export const getWorkoutById = async (id) => {
    try {
        const workout = await getWorkoutByIdFromDB(id);
        return workout;
    } catch (error) {
        console.error('Error in getWorkoutById service:', error);
        return null;
    }
};

/**
 * Get featured workouts (first 3)
 * @returns {Promise<Array>} Array of featured workouts
 */
export const getFeaturedWorkouts = async () => {
    try {
        const allWorkouts = await getWorkouts();
        return allWorkouts.slice(0, 3);
    } catch (error) {
        console.error('Error in getFeaturedWorkouts service:', error);
        return [];
    }
};
