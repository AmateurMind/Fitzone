/**
 * Database Seed Script
 * Populates Firestore with dummy data for development/testing
 * Run with: node scripts/seedDatabase.js
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample workouts data
const workouts = [
    {
        title: 'Full Body HIIT Blast',
        trainer: 'Priya Sharma',
        duration: 30,
        calories: 350,
        difficulty: 'Intermediate',
        category: 'HIIT',
        isPremium: false,
        equipment: ['Mat', 'Dumbbells'],
        gradient: 'orange-pink',
        description: 'High-intensity interval training for full body strength and cardio',
        exercises: [
            { name: 'Jumping Jacks', duration: '60 sec', type: 'cardio' },
            { name: 'Squats', reps: '15 reps', type: 'strength' },
            { name: 'Push-ups', reps: '12 reps', type: 'strength' },
            { name: 'Burpees', reps: '10 reps', type: 'cardio' },
            { name: 'Plank', duration: '45 sec', type: 'core' }
        ]
    },
    {
        title: 'Power Yoga Flow',
        trainer: 'Amit Verma',
        duration: 45,
        calories: 200,
        difficulty: 'Beginner',
        category: 'Yoga',
        isPremium: true,
        equipment: ['Mat', 'Yoga Block'],
        gradient: 'teal-cyan',
        description: 'Gentle flow yoga for flexibility and mindfulness',
        exercises: [
            { name: 'Sun Salutation', duration: '5 min', type: 'warmup' },
            { name: 'Warrior Poses', duration: '10 min', type: 'strength' },
            { name: 'Tree Pose', duration: '3 min', type: 'balance' },
            { name: 'Savasana', duration: '5 min', type: 'relaxation' }
        ]
    },
    {
        title: 'Core Crusher',
        trainer: 'Neha Singh',
        duration: 20,
        calories: 180,
        difficulty: 'Advanced',
        category: 'Strength',
        isPremium: false,
        equipment: ['Mat'],
        gradient: 'purple-indigo',
        description: 'Intense core workout targeting abs and obliques',
        exercises: [
            { name: 'Crunches', reps: '20 reps', type: 'core' },
            { name: 'Plank Hold', duration: '60 sec', type: 'core' },
            { name: 'Russian Twists', reps: '30 reps', type: 'core' },
            { name: 'Leg Raises', reps: '15 reps', type: 'core' }
        ]
    },
    {
        title: 'Dance Fitness Party',
        trainer: 'Kavya Menon',
        duration: 35,
        calories: 400,
        difficulty: 'Beginner',
        category: 'Cardio',
        isPremium: false,
        equipment: [],
        gradient: 'pink-rose',
        description: 'Fun dance-based cardio workout',
        exercises: [
            { name: 'Warm-up Dance', duration: '5 min', type: 'warmup' },
            { name: 'Hip Hop Moves', duration: '15 min', type: 'cardio' },
            { name: 'Latin Dance', duration: '10 min', type: 'cardio' },
            { name: 'Cool Down', duration: '5 min', type: 'cooldown' }
        ]
    },
    {
        title: 'Upper Body Strength',
        trainer: 'Rahul Verma',
        duration: 40,
        calories: 280,
        difficulty: 'Intermediate',
        category: 'Strength',
        isPremium: true,
        equipment: ['Dumbbells', 'Resistance Bands'],
        gradient: 'blue-indigo',
        description: 'Build upper body strength with weights',
        exercises: [
            { name: 'Dumbbell Press', sets: 3, reps: '12 reps', type: 'strength' },
            { name: 'Bicep Curls', sets: 3, reps: '15 reps', type: 'strength' },
            { name: 'Tricep Dips', sets: 3, reps: '12 reps', type: 'strength' },
            { name: 'Shoulder Press', sets: 3, reps: '10 reps', type: 'strength' }
        ]
    },
    {
        title: 'Morning Stretch',
        trainer: 'Anita Kapoor',
        duration: 15,
        calories: 80,
        difficulty: 'Beginner',
        category: 'Yoga',
        isPremium: false,
        equipment: ['Mat'],
        gradient: 'green-emerald',
        description: 'Gentle morning stretching routine',
        exercises: [
            { name: 'Neck Rolls', duration: '2 min', type: 'stretch' },
            { name: 'Shoulder Stretches', duration: '3 min', type: 'stretch' },
            { name: 'Spinal Twists', duration: '5 min', type: 'stretch' },
            { name: 'Leg Stretches', duration: '5 min', type: 'stretch' }
        ]
    }
];

// Sample gyms data
const gyms = [
    {
        name: 'FitZone Koramangala',
        area: 'Koramangala',
        distance: '1.2 km',
        rating: 4.8,
        tier: 'Elite',
        amenities: ['Parking', 'Showers', 'Cafe', 'WiFi', 'AC'],
        location: {
            lat: 12.9352,
            lng: 77.6245
        },
        phone: '+91 80 1234 5678',
        timings: '6:00 AM - 11:00 PM'
    },
    {
        name: 'FitZone Indiranagar',
        area: 'Indiranagar',
        distance: '2.5 km',
        rating: 4.6,
        tier: 'Pro',
        amenities: ['Parking', 'Showers', 'Steam', 'WiFi'],
        location: {
            lat: 12.9784,
            lng: 77.6408
        },
        phone: '+91 80 2345 6789',
        timings: '5:30 AM - 10:30 PM'
    },
    {
        name: 'FitZone HSR Layout',
        area: 'HSR Layout',
        distance: '3.1 km',
        rating: 4.7,
        tier: 'Pro',
        amenities: ['Parking', 'AC', 'WiFi', 'Cafe'],
        location: {
            lat: 12.9141,
            lng: 77.6416
        },
        phone: '+91 80 3456 7890',
        timings: '6:00 AM - 11:00 PM'
    },
    {
        name: 'FitZone Whitefield',
        area: 'Whitefield',
        distance: '8.4 km',
        rating: 4.5,
        tier: 'Elite',
        amenities: ['Parking', 'Pool', 'Spa', 'Cafe', 'WiFi'],
        location: {
            lat: 12.9698,
            lng: 77.7499
        },
        phone: '+91 80 4567 8901',
        timings: '5:00 AM - 12:00 AM'
    }
];

// Sample user data
const sampleUser = {
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

// Sample classes for gyms
const generateClasses = (gymId) => {
    const classTypes = ['Yoga', 'HIIT', 'Zumba', 'Pilates', 'Strength Training'];
    const trainers = ['Priya S.', 'Amit V.', 'Neha S.', 'Kavya M.', 'Rahul V.'];
    const times = ['6:00 AM', '8:00 AM', '10:00 AM', '6:00 PM', '8:00 PM'];

    const classes = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];

        classTypes.forEach((type, idx) => {
            classes.push({
                name: `${type} Class`,
                trainer: trainers[idx % trainers.length],
                time: times[idx % times.length],
                type: type,
                capacity: 20,
                booked: Math.floor(Math.random() * 15) + 5,
                date: dateStr
            });
        });
    }

    return classes;
};

// Seed function
const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seed...');

        // Seed workouts
        console.log('📝 Seeding workouts...');
        for (const workout of workouts) {
            const workoutRef = doc(collection(db, 'workouts'));
            await setDoc(workoutRef, {
                ...workout,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            console.log(`  ✓ Added: ${workout.title}`);
        }

        // Seed gyms
        console.log('🏋️ Seeding gyms...');
        const gymIds = [];
        for (const gym of gyms) {
            const gymRef = doc(collection(db, 'gyms'));
            await setDoc(gymRef, {
                ...gym,
                createdAt: serverTimestamp()
            });
            gymIds.push(gymRef.id);
            console.log(`  ✓ Added: ${gym.name}`);

            // Seed classes for each gym
            const classes = generateClasses(gymRef.id);
            for (const classData of classes) {
                await addDoc(collection(db, 'gyms', gymRef.id, 'classes'), {
                    ...classData,
                    createdAt: serverTimestamp()
                });
            }
            console.log(`    ✓ Added ${classes.length} classes`);
        }

        // Seed sample user
        console.log('👤 Seeding sample user...');
        const userId = 'demo_user_123';
        await setDoc(doc(db, 'users', userId), {
            ...sampleUser,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        console.log(`  ✓ Added user: ${sampleUser.name}`);

        // Seed sample booking
        console.log('📅 Seeding sample booking...');
        if (gymIds.length > 0) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowStr = tomorrow.toISOString().split('T')[0];

            await addDoc(collection(db, 'bookings'), {
                userId: userId,
                gymId: gymIds[0],
                gymName: gyms[0].name,
                classId: 'class_123',
                className: 'Yoga & Meditation',
                date: tomorrowStr,
                time: '6:00 AM',
                status: 'confirmed',
                createdAt: serverTimestamp()
            });
            console.log('  ✓ Added sample booking');
        }

        // Seed sample checkins
        console.log('✅ Seeding sample checkins...');
        for (let i = 0; i < 5; i++) {
            const checkinDate = new Date();
            checkinDate.setDate(checkinDate.getDate() - i);

            await addDoc(collection(db, 'checkins'), {
                userId: userId,
                gymId: gymIds[0],
                gymName: gyms[0].name,
                visitNumber: 145 - i,
                time: Timestamp.fromDate(checkinDate)
            });
        }
        console.log('  ✓ Added 5 sample checkins');

        console.log('\n✨ Database seeding completed successfully!');
        console.log(`📊 Summary:`);
        console.log(`   - ${workouts.length} workouts`);
        console.log(`   - ${gyms.length} gyms`);
        console.log(`   - ${gyms.length * 35} classes`);
        console.log(`   - 1 user`);
        console.log(`   - 1 booking`);
        console.log(`   - 5 checkins`);

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

// Run seed
seedDatabase().then(() => {
    console.log('\n🎉 All done!');
    process.exit(0);
}).catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});

