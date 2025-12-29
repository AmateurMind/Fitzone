/**
 * Authentication Service
 * Handles user authentication and session management
 * For demo purposes, uses a simple mock authentication
 * In production, integrate with Firebase Auth
 */

import { getUserById, saveUser } from './firestore.service';

// Demo user ID - in production, this would come from Firebase Auth
const DEMO_USER_ID = 'demo_user_123';

/**
 * Get current user
 * @returns {Promise<Object|null>} Current user object or null
 */
export const getCurrentUser = async () => {
    try {
        // In production: return Firebase Auth current user
        // For demo: fetch from Firestore
        const user = await getUserById(DEMO_USER_ID);
        
        if (!user) {
            // Create demo user if doesn't exist
            const newUser = {
                name: 'Rahul Sharma',
                email: 'rahul@example.com',
                avatar: 'RS',
                membership: 'pro',
                stats: {
                    workoutsCompleted: 145,
                    caloriesBurned: 4200,
                    streak: 7
                },
                subscription: {
                    plan: 'annual',
                    validTill: '2026-01-15',
                    active: true
                }
            };
            await saveUser(DEMO_USER_ID, newUser);
            return { id: DEMO_USER_ID, ...newUser };
        }
        
        return user;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
};

/**
 * Get current user ID
 * @returns {string} User ID
 */
export const getCurrentUserId = () => {
    // In production: return Firebase Auth UID
    return DEMO_USER_ID;
};

/**
 * Sign in (mock - for demo purposes)
 * @param {string} email - User email
 * @param {string} password - User password (not used in demo)
 * @returns {Promise<Object>} User object
 */
export const signIn = async (email, password) => {
    // In production: use Firebase Auth signInWithEmailAndPassword
    return await getCurrentUser();
};

/**
 * Sign out (mock - for demo purposes)
 * @returns {Promise<void>}
 */
export const signOut = async () => {
    // In production: use Firebase Auth signOut
    console.log('User signed out');
};

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>}
 */
export const isAuthenticated = async () => {
    const user = await getCurrentUser();
    return user !== null;
};

