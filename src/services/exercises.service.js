/**
 * Exercises Service
 * Comprehensive database of exercises with metadata, instructions, and media
 */

/**
 * Get exercise image URL from Unsplash
 * Maps exercise names to appropriate fitness images
 */
export const getExerciseImageUrl = (exerciseName) => {
    if (!exerciseName) return 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80';

    const name = exerciseName.toLowerCase();

    // Specific exercise image mappings
    const imageMap = {
        // Warmup/Cooldown
        'warm up': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
        'cool down': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
        'gentle wake up': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',

        // Cardio
        'jumping jacks': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
        'burpees': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
        'mountain climbers': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
        'high knees': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
        'cardio dance': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',

        // Strength
        'squats': 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800&q=80',
        'push ups': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
        'lunges': 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800&q=80',
        'dumbbell press': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
        'tricep dips': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
        'bicep curls': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
        'shoulder press': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
        'plank to push up': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',

        // Core
        'plank hold': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
        'bicycle crunches': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
        'russian twists': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
        'leg raises': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
        'side plank': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',

        // Yoga
        'sun salutation': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
        'warrior poses': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
        'triangle pose': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
        'tree pose': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
        'downward dog': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
        'child\'s pose': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
        'savasana': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',

        // Stretching
        'neck rolls': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
        'shoulder stretch': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
        'hamstring stretch': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
        'hip flexor stretch': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
        'spinal twist': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
        'full body stretch': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',

        // Dance
        'basic steps': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
        'hip hop moves': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
        'freestyle': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
        'cool down dance': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    };

    // Check exact match first
    if (imageMap[name]) {
        return imageMap[name];
    }

    // Check partial matches by type keywords
    if (name.includes('yoga') || name.includes('pose') || name.includes('stretch') || name.includes('savasana')) {
        return 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80';
    }
    if (name.includes('cardio') || name.includes('jump') || name.includes('burpee') || name.includes('mountain') || name.includes('knee')) {
        return 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80';
    }
    if (name.includes('strength') || name.includes('press') || name.includes('curl') || name.includes('dip') || name.includes('squat') || name.includes('lunge')) {
        return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80';
    }
    if (name.includes('core') || name.includes('plank') || name.includes('crunch') || name.includes('ab')) {
        return 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80';
    }
    if (name.includes('dance') || name.includes('hip hop') || name.includes('freestyle')) {
        return 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80';
    }

    // Fallback: generate Unsplash search URL
    const searchTerm = exerciseName.toLowerCase().replace(/\s+/g, '-');
    return `https://images.unsplash.com/800x600/?fitness,${searchTerm},exercise`;
};

export const exerciseDatabase = {
    "Warm Up": {
        type: "warmup",
        muscles: ["Full Body"],
        equipment: ["None"],
        difficulty: "Beginner",
        caloriesPerMinute: 3,
        youtubeQuery: "warm up exercises full body dynamic stretching",
        imageUrl: getExerciseImageUrl("Warm Up"),
        instructions: [
            "Start with light cardio for 1-2 minutes",
            "Perform arm circles - 10 forward, 10 backward",
            "Do leg swings - 10 each leg, front to back",
            "Hip circles - 10 each direction",
            "Torso twists - 15 total",
            "Finish with neck rolls - 5 each direction"
        ],
        tips: [
            "Start slowly and increase intensity gradually",
            "Focus on full range of motion",
            "Breathe deeply throughout",
            "Never bounce or force movements"
        ],
        commonMistakes: [
            "Skipping warm-up entirely",
            "Moving too fast too soon",
            "Not warming up specific muscles you'll use"
        ]
    },
    "Jumping Jacks": {
        type: "cardio",
        muscles: ["Full Body", "Cardiovascular"],
        equipment: ["None"],
        difficulty: "Beginner",
        caloriesPerMinute: 8,
        youtubeQuery: "jumping jacks exercise proper form tutorial",
        imageUrl: getExerciseImageUrl("Jumping Jacks"),
        instructions: [
            "Stand upright with feet together and arms at your sides",
            "Jump up and spread your legs beyond shoulder-width",
            "Simultaneously raise arms above your head",
            "Jump back to starting position with feet together",
            "Land softly on the balls of your feet",
            "Repeat at a steady pace for the designated time"
        ],
        tips: [
            "Keep your core engaged throughout",
            "Land softly to reduce impact on joints",
            "Maintain a steady breathing rhythm",
            "Keep shoulders relaxed, not hunched"
        ],
        commonMistakes: [
            "Landing too hard on heels",
            "Holding breath during exercise",
            "Not fully extending arms overhead",
            "Moving too fast without control"
        ]
    },
    "Squats": {
        type: "strength",
        muscles: ["Quadriceps", "Glutes", "Hamstrings", "Core"],
        equipment: ["None", "Dumbbells (optional)"],
        difficulty: "Beginner",
        caloriesPerMinute: 5,
        youtubeQuery: "squats proper form tutorial beginner",
        imageUrl: getExerciseImageUrl("Squats"),
        instructions: [
            "Stand with feet shoulder-width apart, toes slightly out",
            "Keep chest up and core engaged",
            "Push hips back and bend knees to lower down",
            "Lower until thighs are parallel to ground (or as low as comfortable)",
            "Keep knees aligned over toes, not caving inward",
            "Push through heels to return to standing",
            "Squeeze glutes at the top"
        ],
        tips: [
            "Imagine sitting back into a chair",
            "Keep weight in your heels",
            "Don't let knees pass toes",
            "Breathe in going down, out coming up"
        ],
        commonMistakes: [
            "Knees caving inward",
            "Leaning too far forward",
            "Not going low enough",
            "Lifting heels off the ground",
            "Rounding the back"
        ]
    },
    "Push Ups": {
        type: "strength",
        muscles: ["Chest", "Triceps", "Shoulders", "Core"],
        equipment: ["None", "Mat (optional)"],
        difficulty: "Intermediate",
        caloriesPerMinute: 7,
        youtubeQuery: "push ups proper form tutorial",
        imageUrl: getExerciseImageUrl("Push Ups"),
        instructions: [
            "Start in plank position with hands slightly wider than shoulders",
            "Keep body in a straight line from head to heels",
            "Engage core and glutes throughout",
            "Lower body by bending elbows until chest nearly touches ground",
            "Keep elbows at 45-degree angle from body",
            "Push back up to starting position",
            "Maintain straight body alignment throughout"
        ],
        tips: [
            "Don't let hips sag or pike up",
            "Keep head neutral, don't look up",
            "Full range of motion is important",
            "Modify on knees if needed"
        ],
        commonMistakes: [
            "Flaring elbows out too wide",
            "Sagging hips",
            "Not going low enough",
            "Holding breath",
            "Looking up instead of down"
        ]
    },
    "Burpees": {
        type: "cardio",
        muscles: ["Full Body", "Cardiovascular"],
        equipment: ["None"],
        difficulty: "Advanced",
        caloriesPerMinute: 10,
        youtubeQuery: "burpees exercise tutorial proper form",
        imageUrl: getExerciseImageUrl("Burpees"),
        instructions: [
            "Start standing with feet shoulder-width apart",
            "Drop into a squat position with hands on ground",
            "Kick feet back into plank position",
            "Perform a push-up (optional)",
            "Jump feet back to squat position",
            "Explosively jump up with arms overhead",
            "Land softly and immediately go into next rep"
        ],
        tips: [
            "Maintain core engagement throughout",
            "Land softly on each jump",
            "Keep a steady pace you can maintain",
            "Modify by stepping instead of jumping"
        ],
        commonMistakes: [
            "Not maintaining plank position",
            "Landing too hard",
            "Rushing through without control",
            "Skipping the push-up portion",
            "Arching back in plank"
        ]
    },
    "Plank Hold": {
        type: "core",
        muscles: ["Core", "Shoulders", "Back"],
        equipment: ["None", "Mat (optional)"],
        difficulty: "Intermediate",
        caloriesPerMinute: 4,
        youtubeQuery: "plank hold proper form tutorial",
        imageUrl: getExerciseImageUrl("Plank Hold"),
        instructions: [
            "Start in forearm plank position",
            "Place forearms on ground with elbows under shoulders",
            "Extend legs straight back, feet hip-width apart",
            "Keep body in straight line from head to heels",
            "Engage core by pulling belly button to spine",
            "Keep head neutral, looking at ground",
            "Hold position while breathing steadily"
        ],
        tips: [
            "Don't hold your breath - breathe normally",
            "Keep hips level, not sagging or piking",
            "Squeeze glutes and quads",
            "Distribute weight evenly on forearms"
        ],
        commonMistakes: [
            "Letting hips sag down",
            "Piking hips up too high",
            "Holding breath",
            "Not engaging core",
            "Looking up instead of down"
        ]
    },
    "Cool Down": {
        type: "cooldown",
        muscles: ["Full Body"],
        equipment: ["None", "Mat (optional)"],
        difficulty: "Beginner",
        caloriesPerMinute: 2,
        youtubeQuery: "cool down stretches after workout",
        imageUrl: getExerciseImageUrl("Cool Down"),
        instructions: [
            "Walk slowly for 1-2 minutes to lower heart rate",
            "Perform quadriceps stretch - 30 seconds each leg",
            "Hamstring stretch - 30 seconds each leg",
            "Chest stretch - 30 seconds",
            "Shoulder stretch - 30 seconds each arm",
            "Triceps stretch - 30 seconds each arm",
            "Finish with deep breathing for 1 minute"
        ],
        tips: [
            "Hold each stretch without bouncing",
            "Breathe deeply into each stretch",
            "Never force a stretch - it should feel gentle",
            "Focus on muscles you just worked"
        ],
        commonMistakes: [
            "Skipping cool down entirely",
            "Bouncing during stretches",
            "Holding breath while stretching",
            "Rushing through stretches"
        ]
    }
};

/**
 * Get exercise by name
 * @param {string} name - Exercise name
 * @returns {Object|null} Exercise data or null
 */
export const getExerciseByName = (name) => {
    return exerciseDatabase[name] || null;
};

/**
 * Get all exercises
 * @returns {Array} Array of all exercises with names
 */
export const getAllExercises = () => {
    return Object.keys(exerciseDatabase).map(name => ({
        name,
        ...exerciseDatabase[name]
    }));
};

/**
 * Search exercises by type
 * @param {string} type - Exercise type (warmup, cardio, strength, core, cooldown)
 * @returns {Array} Filtered exercises
 */
export const getExercisesByType = (type) => {
    return Object.keys(exerciseDatabase)
        .filter(name => exerciseDatabase[name].type === type)
        .map(name => ({
            name,
            ...exerciseDatabase[name]
        }));
};

/**
 * Calculate estimated calories burned
 * @param {string} exerciseName - Exercise name
 * @param {number} duration - Duration in seconds
 * @returns {number} Estimated calories burned
 */
export const calculateCalories = (exerciseName, duration) => {
    const exercise = exerciseDatabase[exerciseName];
    if (!exercise) return 0;

    const minutes = duration / 60;
    return Math.round(exercise.caloriesPerMinute * minutes);
};

