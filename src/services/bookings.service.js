/**
 * Bookings Service
 * Handles class booking operations
 */

import { 
    getUserBookings as getUserBookingsFromDB,
    createBooking as createBookingInDB,
    cancelBooking as cancelBookingInDB
} from './firestore.service';
import { getCurrentUserId } from './auth.service';

/**
 * Get user's bookings
 * @returns {Promise<Array>} Array of bookings
 */
export const getUserBookings = async () => {
    try {
        const userId = getCurrentUserId();
        const bookings = await getUserBookingsFromDB(userId);
        return bookings;
    } catch (error) {
        console.error('Error in getUserBookings service:', error);
        return [];
    }
};

/**
 * Get upcoming bookings
 * @returns {Promise<Array>} Array of upcoming bookings
 */
export const getUpcomingBookings = async () => {
    try {
        const bookings = await getUserBookings();
        const today = new Date().toISOString().split('T')[0];
        
        return bookings.filter(booking => {
            if (booking.status !== 'confirmed') return false;
            return booking.date >= today;
        }).sort((a, b) => {
            if (a.date !== b.date) return a.date.localeCompare(b.date);
            return a.time.localeCompare(b.time);
        });
    } catch (error) {
        console.error('Error in getUpcomingBookings service:', error);
        return [];
    }
};

/**
 * Create a new booking
 * @param {Object} bookingData - Booking data
 * @returns {Promise<Object>} Created booking
 */
export const createBooking = async (bookingData) => {
    try {
        const userId = getCurrentUserId();
        const booking = await createBookingInDB({
            ...bookingData,
            userId
        });
        return booking;
    } catch (error) {
        console.error('Error in createBooking service:', error);
        throw error;
    }
};

/**
 * Cancel a booking
 * @param {string} bookingId - Booking ID
 * @returns {Promise<void>}
 */
export const cancelBooking = async (bookingId) => {
    try {
        await cancelBookingInDB(bookingId);
    } catch (error) {
        console.error('Error in cancelBooking service:', error);
        throw error;
    }
};

