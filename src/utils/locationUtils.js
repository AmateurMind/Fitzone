/**
 * Location Utilities
 * Functions for geocoding, distance calculation, and location-based filtering
 */

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

/**
 * Format distance for display
 * @param {number} distanceKm - Distance in kilometers
 * @returns {string} Formatted distance string
 */
export const formatDistance = (distanceKm) => {
    if (distanceKm < 1) {
        return `${Math.round(distanceKm * 1000)} m`;
    }
    return `${distanceKm.toFixed(1)} km`;
};

/**
 * Geocode an address to coordinates using Google Geocoding API
 * @param {string} address - Address to geocode
 * @returns {Promise<{lat: number, lng: number, formatted: string}>} Coordinates and formatted address
 */
export const geocodeAddress = async (address) => {
    if (!address || address.trim() === '') {
        throw new Error('Address is required');
    }

    try {
        const encodedAddress = encodeURIComponent(address);
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${GOOGLE_MAPS_API_KEY}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'OK' && data.results.length > 0) {
            const result = data.results[0];
            const location = result.geometry.location;
            return {
                lat: location.lat,
                lng: location.lng,
                formatted: result.formatted_address
            };
        } else if (data.status === 'ZERO_RESULTS') {
            throw new Error('No results found for this address');
        } else {
            throw new Error(`Geocoding failed: ${data.status}`);
        }
    } catch (error) {
        console.error('Geocoding error:', error);
        throw error;
    }
};

/**
 * Find nearby gyms within a radius
 * @param {number} userLat - User's latitude
 * @param {number} userLng - User's longitude
 * @param {Array} gyms - Array of gym objects
 * @param {number} radiusKm - Radius in kilometers (default: 10km)
 * @returns {Array} Array of gyms with distance added, sorted by distance
 */
export const findNearbyGyms = (userLat, userLng, gyms, radiusKm = 10) => {
    if (!userLat || !userLng) {
        return gyms.map(gym => ({ ...gym, distance: gym.distance || 'N/A' }));
    }

    return gyms
        .filter(gym => gym.latitude && gym.longitude)
        .map(gym => {
            const distance = calculateDistance(
                userLat,
                userLng,
                gym.latitude,
                gym.longitude
            );
            return {
                ...gym,
                distance: formatDistance(distance),
                distanceKm: distance
            };
        })
        .filter(gym => gym.distanceKm <= radiusKm)
        .sort((a, b) => a.distanceKm - b.distanceKm);
};

