/**
 * Checkins Service
 * Handles gym check-in operations
 */

import { 
    getUserCheckins as getUserCheckinsFromDB,
    createCheckin as createCheckinInDB
} from './firestore.service';
import { getCurrentUserId } from './auth.service';
import { updateUserStats } from './firestore.service';

/**
 * Get user's checkins
 * @param {number} limit - Number of checkins to fetch
 * @returns {Promise<Array>} Array of checkins
 */
export const getUserCheckins = async (limit = 10) => {
    try {
        const userId = getCurrentUserId();
        const checkins = await getUserCheckinsFromDB(userId, limit);
        return checkins;
    } catch (error) {
        console.error('Error in getUserCheckins service:', error);
        return [];
    }
};

/**
 * Create a checkin
 * @param {Object} checkinData - Checkin data (gymId, gymName)
 * @returns {Promise<Object>} Created checkin
 */
export const createCheckin = async (checkinData) => {
    try {
        const userId = getCurrentUserId();
        
        // Get user to calculate visit number
        const { getUserById } = await import('./firestore.service');
        const user = await getUserById(userId);
        
        const visitNumber = user?.stats?.workoutsCompleted 
            ? user.stats.workoutsCompleted + 1 
            : 1;
        
        // Create checkin
        const checkin = await createCheckinInDB({
            ...checkinData,
            userId,
            visitNumber
        });
        
        // Update user stats
        if (user) {
            await updateUserStats(userId, {
                ...user.stats,
                workoutsCompleted: visitNumber
            });
        }
        
        return checkin;
    } catch (error) {
        console.error('Error in createCheckin service:', error);
        throw error;
    }
};

