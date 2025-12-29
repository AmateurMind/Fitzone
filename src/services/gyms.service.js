/**
 * Gyms Service
 * Handles all gym-related operations using Firestore
 */

import { 
    getGyms as getGymsFromDB, 
    getGymById as getGymByIdFromDB,
    getGymClasses as getGymClassesFromDB 
} from './firestore.service';

/**
 * Get all gyms
 * @returns {Promise<Array>} Array of gyms
 */
export const getGyms = async () => {
    try {
        const gyms = await getGymsFromDB();
        return gyms;
    } catch (error) {
        console.error('Error in getGyms service:', error);
        // Fallback to empty array on error
        return [];
    }
};

/**
 * Get gym by ID
 * @param {string} id - Gym ID
 * @returns {Promise<Object|null>} Gym object or null
 */
export const getGymById = async (id) => {
    try {
        const gym = await getGymByIdFromDB(id);
        return gym;
    } catch (error) {
        console.error('Error in getGymById service:', error);
        return null;
    }
};

/**
 * Get classes for a specific gym
 * @param {string} gymId - Gym ID
 * @returns {Promise<Array>} Array of classes
 */
export const getGymClasses = async (gymId) => {
    try {
        const classes = await getGymClassesFromDB(gymId);
        return classes;
    } catch (error) {
        console.error('Error in getGymClasses service:', error);
        return [];
    }
};
