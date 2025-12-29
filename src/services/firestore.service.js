/**
 * Firestore Service Layer
 * Centralized service for all Firestore database operations
 * Provides clean, reusable methods for CRUD operations
 */

import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { workouts as staticWorkouts } from '../data/workouts';
import { gyms as staticGyms } from '../data/gyms';

// ==================== USERS ====================

/**
 * Get user by ID
 */
export const getUserById = async (userId) => {
    try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return { id: userSnap.id, ...userSnap.data() };
        }
        return null;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};

/**
 * Create or update user
 */
export const saveUser = async (userId, userData) => {
    try {
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, {
            ...userData,
            updatedAt: serverTimestamp()
        }, { merge: true });
        return { id: userId, ...userData };
    } catch (error) {
        console.error('Error saving user:', error);
        throw error;
    }
};

/**
 * Update user stats
 */
export const updateUserStats = async (userId, stats) => {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            'stats': stats,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Error updating user stats:', error);
        throw error;
    }
};

// ==================== WORKOUTS ====================

/**
 * Get all workouts
 */
export const getWorkouts = async (filters = {}) => {
    try {
        const workoutsRef = collection(db, 'workouts');
        let q = query(workoutsRef);

        if (filters.difficulty) {
            q = query(q, where('difficulty', '==', filters.difficulty));
        }
        if (filters.category) {
            q = query(q, where('category', '==', filters.category));
        }
        if (filters.isPremium !== undefined) {
            q = query(q, where('isPremium', '==', filters.isPremium));
        }

        q = query(q, orderBy('title'));

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching workouts:', error);
        // Fallback to static data for offline/permission issues
        return staticWorkouts;
    }
};

/**
 * Get workout by ID
 */
export const getWorkoutById = async (workoutId) => {
    try {
        const workoutRef = doc(db, 'workouts', workoutId);
        const workoutSnap = await getDoc(workoutRef);

        if (workoutSnap.exists()) {
            return { id: workoutSnap.id, ...workoutSnap.data() };
        }
        return null;
    } catch (error) {
        console.error('Error fetching workout:', error);
        throw error;
    }
};

/**
 * Create workout
 */
export const createWorkout = async (workoutData) => {
    try {
        const workoutsRef = collection(db, 'workouts');
        const docRef = await addDoc(workoutsRef, {
            ...workoutData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return { id: docRef.id, ...workoutData };
    } catch (error) {
        console.error('Error creating workout:', error);
        throw error;
    }
};

// ==================== GYMS ====================

/**
 * Get all gyms
 */
const MOCK_GYMS = [
    {
        id: 'gym_01',
        name: 'FitZone HSR Layout',
        area: 'HSR Layout',
        tier: 'Elite',
        rating: 4.8,
        distance: '0.8 km',
        amenities: ['Pool', 'Sauna', 'CrossFit', 'Personal Training'],
        image: require('../assets/images/hsr_gym.png'), // AI Generated
        classes: ['Yoga', 'HIIT', 'Zumba'],
        gradient: 'purple'
    },
    {
        id: 'gym_02',
        name: 'FitZone Indiranagar',
        area: 'Indiranagar',
        tier: 'Pro',
        rating: 4.6,
        distance: '2.5 km',
        amenities: ['Cardio', 'Weights', 'Steam', 'Yoga Studio'],
        image: require('../assets/images/indiranagar_gym.png'), // AI Generated
        classes: ['Pilates', 'Boxing', 'Spin'],
        gradient: 'orange'
    },
    {
        id: 'gym_03',
        name: 'FitZone Koramangala',
        area: 'Koramangala',
        tier: 'Elite',
        rating: 4.9,
        distance: '3.2 km',
        amenities: ['Pool', 'Spa', 'Nutrition Bar', 'Parking'],
        image: require('../assets/images/hsr_gym.png'), // Reusing HSR style for now
        classes: ['Aquatic', 'Power Yoga', 'BodyPump'],
        gradient: 'blue'
    },
    {
        id: 'gym_04',
        name: 'FitZone Whitefield',
        area: 'Whitefield',
        tier: 'Pro',
        rating: 4.5,
        distance: '5.1 km',
        amenities: ['Large Floor', 'Lockers', 'Showers'],
        image: require('../assets/images/indiranagar_gym.png'), // Reusing Indiranagar style for now
        classes: ['Circuit', 'Abs', 'Stretching'],
        gradient: 'teal'
    }
];

export const getGyms = async () => {
    try {
        const gymsRef = collection(db, 'gyms');
        const q = query(gymsRef, orderBy('name'));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log("No gyms found in Firestore, using mock data");
            return MOCK_GYMS;
        }

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching gyms:', error);
        console.log("Firestore error, falling back to mock data");
        return MOCK_GYMS; // Fallback to mocks on error
    }
};


/**
 * Get gym by ID
 */
export const getGymById = async (gymId) => {
    try {
        const gymRef = doc(db, 'gyms', gymId);
        const gymSnap = await getDoc(gymRef);

        if (gymSnap.exists()) {
            return { id: gymSnap.id, ...gymSnap.data() };
        }
        return null;
    } catch (error) {
        console.error('Error fetching gym:', error);
        throw error;
    }
};

/**
 * Get classes for a gym
 */
export const getGymClasses = async (gymId) => {
    try {
        const classesRef = collection(db, 'gyms', gymId, 'classes');
        const q = query(classesRef, orderBy('date'), orderBy('time'));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching gym classes:', error);
        throw error;
    }
};

// ==================== BOOKINGS ====================

/**
 * Get user bookings
 * Simplified query to avoid needing composite index
 */
export const getUserBookings = async (userId) => {
    try {
        const bookingsRef = collection(db, 'bookings');
        // Simple query - just filter by userId, sort client-side
        const q = query(
            bookingsRef,
            where('userId', '==', userId)
        );
        const querySnapshot = await getDocs(q);

        const bookings = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Sort client-side to avoid needing composite index
        return bookings.sort((a, b) => {
            if (a.date !== b.date) return a.date?.localeCompare(b.date) || 0;
            return a.time?.localeCompare(b.time) || 0;
        });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        throw error;
    }
};

/**
 * Create booking
 */
export const createBooking = async (bookingData) => {
    try {
        const bookingsRef = collection(db, 'bookings');
        const docRef = await addDoc(bookingsRef, {
            ...bookingData,
            status: 'confirmed',
            createdAt: serverTimestamp()
        });
        return { id: docRef.id, ...bookingData, status: 'confirmed' };
    } catch (error) {
        console.error('Error creating booking:', error);
        throw error;
    }
};

/**
 * Cancel booking
 */
export const cancelBooking = async (bookingId) => {
    try {
        const bookingRef = doc(db, 'bookings', bookingId);
        await updateDoc(bookingRef, {
            status: 'cancelled',
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Error cancelling booking:', error);
        throw error;
    }
};

// ==================== CHECKINS ====================

/**
 * Get user checkins
 */
export const getUserCheckins = async (userId, limitCount = 10) => {
    try {
        const checkinsRef = collection(db, 'checkins');
        const q = query(
            checkinsRef,
            where('userId', '==', userId),
            orderBy('time', 'desc'),
            limit(limitCount)
        );
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching checkins:', error);
        throw error;
    }
};

/**
 * Create checkin
 */
export const createCheckin = async (checkinData) => {
    try {
        const checkinsRef = collection(db, 'checkins');
        const docRef = await addDoc(checkinsRef, {
            ...checkinData,
            time: serverTimestamp()
        });
        return { id: docRef.id, ...checkinData };
    } catch (error) {
        console.error('Error creating checkin:', error);
        throw error;
    }
};

// ==================== AI RECOMMENDATIONS ====================

/**
 * Save AI recommendation
 */
export const saveAIRecommendation = async (userId, recommendationData) => {
    try {
        const recRef = doc(db, 'ai_recommendations', userId);
        await setDoc(recRef, {
            ...recommendationData,
            generatedAt: serverTimestamp()
        }, { merge: true });
        return { userId, ...recommendationData };
    } catch (error) {
        console.error('Error saving AI recommendation:', error);
        throw error;
    }
};

/**
 * Get AI recommendation for user
 */
export const getAIRecommendation = async (userId) => {
    try {
        const recRef = doc(db, 'ai_recommendations', userId);
        const recSnap = await getDoc(recRef);

        if (recSnap.exists()) {
            return { userId, ...recSnap.data() };
        }
        return null;
    } catch (error) {
        console.error('Error fetching AI recommendation:', error);
        throw error;
    }
};

// ==================== AI CHAT HISTORY ====================

/**
 * Save AI chat message
 */
export const saveAIChatMessage = async (userId, message) => {
    try {
        const chatRef = collection(db, 'users', userId, 'ai_chat');
        await addDoc(chatRef, {
            ...message,
            timestamp: serverTimestamp()
        });
    } catch (error) {
        console.error('Error saving AI chat message:', error);
        throw error;
    }
};

/**
 * Get AI chat history for user
 */
export const getAIChatHistory = async (userId) => {
    try {
        const chatRef = collection(db, 'users', userId, 'ai_chat');
        const q = query(chatRef, orderBy('timestamp', 'desc'), limit(50));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })).reverse(); // Reverse to show oldest first
    } catch (error) {
        console.error('Error fetching AI chat history:', error);
        return [];
    }
};

/**
 * Clear AI chat history for user
 */
export const clearAIChatHistory = async (userId) => {
    try {
        const chatRef = collection(db, 'users', userId, 'ai_chat');
        const querySnapshot = await getDocs(chatRef);

        const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
    } catch (error) {
        console.error('Error clearing AI chat history:', error);
        throw error;
    }
};

// ==================== USER PLANS ====================

/**
 * Save user plan (workout, diet, etc.)
 */
export const saveUserPlan = async (userId, planData) => {
    try {
        console.log('Saving plan to Firestore:', { userId, planData });
        const plansRef = collection(db, 'user_plans');
        const docRef = await addDoc(plansRef, {
            userId,
            ...planData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            isActive: true
        });
        console.log('Plan saved successfully with ID:', docRef.id);
        return { id: docRef.id, userId, ...planData };
    } catch (error) {
        console.error('Error saving user plan:', error);
        throw error;
    }
};

/**
 * Get all plans for a user
 */
export const getUserPlans = async (userId) => {
    try {
        console.log('Fetching plans for userId:', userId);
        const plansRef = collection(db, 'user_plans');
        const q = query(
            plansRef,
            where('userId', '==', userId)
        );
        const querySnapshot = await getDocs(q);

        const plans = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Sort in memory to avoid missing index error
        plans.sort((a, b) => {
            const dateA = a.createdAt?.seconds || 0;
            const dateB = b.createdAt?.seconds || 0;
            return dateB - dateA; // Descending order
        });

        console.log('Fetched plans:', plans.length, plans);
        return plans;
    } catch (error) {
        console.error('Error fetching user plans:', error);
        return [];
    }
};

/**
 * Get active plan by type
 */
export const getActivePlan = async (userId, planType) => {
    try {
        const plansRef = collection(db, 'user_plans');
        const q = query(
            plansRef,
            where('userId', '==', userId),
            where('type', '==', planType),
            where('isActive', '==', true)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // Sort by createdAt desc to get the latest active plan
            const plans = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            plans.sort((a, b) => {
                const dateA = a.createdAt?.seconds || 0;
                const dateB = b.createdAt?.seconds || 0;
                return dateB - dateA;
            });

            return plans[0];
        }
        return null;
    } catch (error) {
        console.error('Error fetching active plan:', error);
        return null;
    }
};

/**
 * Update plan progress
 */
export const updatePlanProgress = async (planId, progressData) => {
    try {
        const planRef = doc(db, 'user_plans', planId);
        await updateDoc(planRef, {
            progress: progressData,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Error updating plan progress:', error);
        throw error;
    }
};

