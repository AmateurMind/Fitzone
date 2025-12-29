/**
 * Exercise Animations Mapping
 * Maps exercise names to their Lottie animation files
 * 
 * TODO: Add actual Lottie JSON imports once files are added to /assets/animations/
 */

// Placeholder - Replace with actual imports when you add Lottie files
// Example:
// import jumpingJacksAnimation from '../../assets/animations/jumping-jacks.json';
// import burpeesAnimation from '../../assets/animations/burpees.json';

/**
 * Exercise animation mapping
 * Key: Exercise name (must match exercise names in WorkoutDetailScreen)
 * Value: Lottie animation source or GIF URL (fallback)
 */
export const exerciseAnimations = {
    // CARDIO EXERCISES
    'Jumping Jacks': {
        type: 'lottie',
        source: 'https://lottie.host/9e2480c6-54db-43c7-91ea-f28dadd66d87/NenY5T2486.lottie',
    },
    'Burpees': {
        type: 'gif',
        source: 'https://media.giphy.com/media/26uf7p7U92B3O3lPa/giphy.gif',
    },
    'Mountain Climbers': {
        type: 'gif',
        source: 'https://media.giphy.com/media/l41lS27mD4lXNfL8s/giphy.gif',
    },
    'High Knees': {
        type: 'gif',
        source: 'https://media.giphy.com/media/3o7TKQqGkUPrP0VqJq/giphy.gif',
    },

    // STRENGTH EXERCISES
    'Squats': {
        type: 'gif',
        source: 'https://media.giphy.com/media/1qfDU4MJv9xoGtRKvh/giphy.gif',
    },
    'Push Ups': {
        type: 'gif',
        source: 'https://media.giphy.com/media/3o7TKPATxjC1zfATHG/giphy.gif',
    },
    'Lunges': {
        type: 'gif',
        source: 'https://media.giphy.com/media/3o7TKQqGkUPrP0VqJq/giphy.gif',
    },
    'Dumbbell Press': {
        type: 'gif',
        source: 'https://media.giphy.com/media/3o7TKPATxjC1zfATHG/giphy.gif',
    },
    'Tricep Dips': {
        type: 'gif',
        source: 'https://media.giphy.com/media/l41lS27mD4lXNfL8s/giphy.gif',
    },
    'Bicep Curls': {
        type: 'gif',
        source: 'https://media.giphy.com/media/3o7TKMGpxxcahtdc9W/giphy.gif',
    },
    'Shoulder Press': {
        type: 'gif',
        source: 'https://media.giphy.com/media/26uf7p7U92B3O3lPa/giphy.gif',
    },
    'Plank to Push Up': {
        type: 'gif',
        source: 'https://media.giphy.com/media/3o7TKPATxjC1zfATHG/giphy.gif',
    },

    // CORE EXERCISES
    'Plank Hold': {
        type: 'gif',
        source: 'https://lottie.host/a494c3fe-5aab-4b64-bbf2-6d803584c45b/RwzPtX0Z9e.lottie',
    },
    'Bicycle Crunches': {
        type: 'gif',
        source: 'https://lottie.host/1a63f847-7efc-4954-8521-f35c5aa1cb5b/lEMwiFmpxa.lottie',
    },
    'Russian Twists': {
        type: 'gif',
        source: 'https://media.giphy.com/media/l41lS27mD4lXNfL8s/giphy.gif',
    },
    'Leg Raises': {
        type: 'gif',
        source: 'https://media.giphy.com/media/3o7TKMGpxxcahtdc9W/giphy.gif',
    },
    'Side Plank': {
        type: 'gif',
        source: 'https://media.giphy.com/media/26uf7p7U92B3O3lPa/giphy.gif',
    },

    // YOGA EXERCISES
    'Sun Salutation': {
        type: 'gif',
        source: 'https://media.giphy.com/media/3o7TKPATxjC1zfATHG/giphy.gif',
    },
    'Warrior Poses': {
        type: 'gif',
        source: 'https://media.giphy.com/media/l41lS27mD4lXNfL8s/giphy.gif',
    },
    'Triangle Pose': {
        type: 'gif',
        source: 'https://media.giphy.com/media/3o7TKQqGkUPrP0VqJq/giphy.gif',
    },
    'Tree Pose': {
        type: 'gif',
        source: 'https://media.giphy.com/media/1qfDU4MJv9xoGtRKvh/giphy.gif',
    },
    'Downward Dog': {
        type: 'gif',
        source: 'https://media.giphy.com/media/3o7TKMGpxxcahtdc9W/giphy.gif',
    },
    "Child's Pose": {
        type: 'gif',
        source: 'https://media.giphy.com/media/26uf7p7U92B3O3lPa/giphy.gif',
    },
    'Savasana': {
        type: 'gif',
        source: 'https://media.giphy.com/media/3o7TKPATxjC1zfATHG/giphy.gif',
    },

    // DANCE EXERCISES
    'Basic Steps': {
        type: 'gif',
        source: 'https://media.giphy.com/media/l41lS27mD4lXNfL8s/giphy.gif',
    },
    'Hip Hop Moves': {
        type: 'gif',
        source: 'https://media.giphy.com/media/3o7TKQqGkUPrP0VqJq/giphy.gif',
    },
    'Cardio Dance': {
        type: 'gif',
        source: 'https://media.giphy.com/media/1qfDU4MJv9xoGtRKvh/giphy.gif',
    },
    'Freestyle': {
        type: 'gif',
        source: 'https://media.giphy.com/media/3o7TKMGpxxcahtdc9W/giphy.gif',
    },
    'Cool Down Dance': {
        type: 'gif',
        source: 'https://media.giphy.com/media/26uf7p7U92B3O3lPa/giphy.gif',
    },

    // STRETCH EXERCISES
    'Gentle Wake Up': {
        type: 'gif',
        source: 'https://media.giphy.com/media/3o7TKPATxjC1zfATHG/giphy.gif',
    },
    'Neck Rolls': {
        type: 'gif',
        source: 'https://media.giphy.com/media/l41lS27mD4lXNfL8s/giphy.gif',
    },
    'Shoulder Stretch': {
        type: 'gif',
        source: 'https://media.giphy.com/media/3o7TKQqGkUPrP0VqJq/giphy.gif',
    },
    'Hamstring Stretch': {
        type: 'gif',
        source: 'https://media.giphy.com/media/1qfDU4MJv9xoGtRKvh/giphy.gif',
    },
    'Hip Flexor Stretch': {
        type: 'gif',
        source: 'https://media.giphy.com/media/3o7TKMGpxxcahtdc9W/giphy.gif',
    },
    'Spinal Twist': {
        type: 'gif',
        source: 'https://media.giphy.com/media/26uf7p7U92B3O3lPa/giphy.gif',
    },
    'Full Body Stretch': {
        type: 'gif',
        source: 'https://media.giphy.com/media/3o7TKPATxjC1zfATHG/giphy.gif',
    },

    // WARMUP & COOLDOWN
    'Warm Up': {
        type: 'lottie',
        source: 'https://lottie.host/10f718ba-2983-4342-90dd-663bbb4bdc8b/Ag62GEuKQK.lottie',
    },
    'Cool Down': {
        type: 'gif',
        source: 'https://media.giphy.com/media/3o7TKQqGkUPrP0VqJq/giphy.gif',
    },
};

/**
 * Get animation for an exercise
 * @param {string} exerciseName - Name of the exercise
 * @returns {object} Animation object with type and source
 */
export const getExerciseAnimation = (exerciseName) => {
    return exerciseAnimations[exerciseName] || {
        type: 'gif',
        source: 'https://media.giphy.com/media/3o7TKMGpxxcahtdc9W/giphy.gif', // Default fallback
    };
};

/**
 * Check if exercise has Lottie animation
 * @param {string} exerciseName - Name of the exercise
 * @returns {boolean} True if Lottie animation exists
 */
export const hasLottieAnimation = (exerciseName) => {
    const animation = exerciseAnimations[exerciseName];
    return animation && animation.lottie !== undefined;
};
