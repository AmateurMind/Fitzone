/**
 * Database Seed Utility
 * Can be called from React Native app to populate Firestore
 * Usage: Import and call seedDatabase() from a dev screen or button
 */

import {
    collection,
    doc,
    setDoc,
    addDoc,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';
import { db } from '../services/firebase';

// Sample data
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

const gyms = [
    {
        name: 'Integrity Gym',
        area: 'Viman Nagar',
        address: '2nd Floor, above Shri Krishna Hotel, Viman Nagar, Pune',
        distance: '0.3 km',
        rating: 4.9,
        tier: 'Elite',
        amenities: ['Parking', 'Showers', 'Locker Room', 'Personal Training', 'WiFi', 'AC'],
        latitude: 18.5679,
        longitude: 73.9144,
        phone: '+91 98765 43200',
        timings: '6:00 AM - 10:00 PM',
        gradient: 'teal-cyan',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800'
    },
    {
        name: 'The Gym',
        area: 'Viman Nagar',
        address: 'Ganga Home, Row House No.1/2, next to Bank Of India, Viman Nagar, Pune',
        distance: '0.5 km',
        rating: 4.9,
        tier: 'Elite',
        amenities: ['Parking', 'Showers', 'Cafe', 'Steam Room', 'WiFi', 'AC'],
        latitude: 18.5690,
        longitude: 73.9155,
        phone: '+91 98765 43201',
        timings: '5:00 AM - 11:00 PM',
        gradient: 'teal-cyan',
        image: 'https://images.unsplash.com/photo-1540497073359-09d0b8b0e5b1?w=800'
    },
    {
        name: 'Dumbbell Bee Fitness GYM',
        area: 'Viman Nagar',
        address: 'Level II, 44/1, opp. Hotel Brookside, Viman Nagar, Pune',
        distance: '0.7 km',
        rating: 4.8,
        tier: 'Elite',
        amenities: ['Parking', 'Showers', 'Zumba', 'Yoga', 'HIIT Classes', 'WiFi'],
        latitude: 18.5665,
        longitude: 73.9130,
        phone: '+91 98765 43202',
        timings: '6:00 AM - 10:00 PM',
        gradient: 'purple-pink',
        image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800'
    },
    {
        name: 'Technofit by Khandarkars',
        area: 'Viman Nagar',
        address: '103, 1st floor, Orville Business Port, opp. KONARK CAMPUS, Viman Nagar, Pune',
        distance: '0.8 km',
        rating: 4.7,
        tier: 'Pro',
        amenities: ['Parking', 'Showers', 'Modern Equipment', 'Personal Training', 'WiFi'],
        latitude: 18.5685,
        longitude: 73.9125,
        phone: '+91 98765 43203',
        timings: '6:00 AM - 9:00 PM',
        gradient: 'orange-rose',
        image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800'
    },
    {
        name: 'ABS FITNESS VIMAN NAGAR',
        area: 'Viman Nagar',
        address: 'First floor, Panchshil Business Park, above food court, Viman Nagar, Pune',
        distance: '0.4 km',
        rating: 4.5,
        tier: 'Pro',
        amenities: ['Parking', 'Showers', 'Locker Rooms', 'Spacious Workout Area', 'WiFi'],
        latitude: 18.5670,
        longitude: 73.9148,
        phone: '+91 98765 43204',
        timings: '5:00 AM - 10:00 PM',
        gradient: 'blue-indigo',
        image: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800'
    },
    {
        name: 'GET.FIT',
        area: 'Viman Nagar',
        address: 'Lemon Tree Hotel, GET.FIT Sr. No. 232/1 & 2, Plot No. 92, near Nexa Showroom, Viman Nagar, Pune',
        distance: '0.6 km',
        rating: 4.4,
        tier: 'Pro',
        amenities: ['Parking', 'Showers', 'Hotel Facilities', '24/7 Access', 'WiFi'],
        latitude: 18.5680,
        longitude: 73.9150,
        phone: '+91 98765 43205',
        timings: '24/7',
        gradient: 'emerald-teal',
        image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800'
    },
    {
        name: 'FirstFitt',
        area: 'Viman Nagar',
        address: 'Anand Square, Viman Nagar Rd, opp. Symbiosis International School, Viman Nagar, Pune',
        distance: '0.9 km',
        rating: 4.3,
        tier: 'Pro',
        amenities: ['Parking', 'Showers', 'Muscle Strength Training', 'Personal Training', 'WiFi'],
        latitude: 18.5660,
        longitude: 73.9135,
        phone: '+91 98765 43206',
        timings: '6:00 AM - 10:00 PM',
        gradient: 'amber-orange',
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800'
    },
    {
        name: 'Anytime Fitness',
        area: 'Viman Nagar',
        address: '4th floor, 10 Biz Park, beside Symbiosis Law School Road, Viman Nagar, Pune',
        distance: '0.5 km',
        rating: 4.4,
        tier: 'Elite',
        amenities: ['Parking', 'Showers', '24/7 Access', 'On-site Services', 'WiFi', 'AC'],
        latitude: 18.5675,
        longitude: 73.9142,
        phone: '+91 98765 43207',
        timings: '24/7',
        gradient: 'teal-cyan',
        image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800'
    },
    {
        name: 'SK FITNESS 4 ALL',
        area: 'Viman Nagar',
        address: 'Karan Bazar Apartment, Viman Nagar, Pune',
        distance: '0.7 km',
        rating: 4.7,
        tier: 'Pro',
        amenities: ['Parking', 'Showers', 'Personal Training', 'On-site Services', 'WiFi'],
        latitude: 18.5688,
        longitude: 73.9138,
        phone: '+91 98765 43208',
        timings: '6:00 AM - 10:00 PM',
        gradient: 'purple-pink',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800'
    },
    {
        name: '100MILES - A Health and Fitness Hub',
        area: 'Viman Nagar',
        address: 'Office 3090-3rd Floor, Ganga Trueno Business Park, Viman Nagar, Pune',
        distance: '0.6 km',
        rating: 4.6,
        tier: 'Elite',
        amenities: ['Parking', 'Showers', 'Personal Training', 'Health Hub', 'WiFi', 'AC'],
        latitude: 18.5672,
        longitude: 73.9146,
        phone: '+91 98765 43209',
        timings: '6:00 AM - 11:00 PM',
        gradient: 'teal-cyan',
        image: 'https://images.unsplash.com/photo-1540497073359-09d0b8b0e5b1?w=800'
    },
    // Indiranagar Gyms
    {
        name: 'Volt Energy Club',
        area: 'Indiranagar',
        address: '100 Feet Rd, Indiranagar, Bangalore',
        distance: '1.2 km',
        rating: 4.8,
        tier: 'Elite',
        amenities: ['Pool', 'Sauna', 'Personal Training', 'Yoga Studio', 'WiFi', 'AC'],
        latitude: 12.9716,
        longitude: 77.6412,
        phone: '+91 98765 43210',
        timings: '5:00 AM - 11:00 PM',
        gradient: 'purple-pink',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800'
    },
    {
        name: 'Iron Pumping Station',
        area: 'Indiranagar',
        address: '12th Main Rd, Indiranagar, Bangalore',
        distance: '0.8 km',
        rating: 4.5,
        tier: 'Pro',
        amenities: ['Heavy Weights', 'Cardio Zone', 'Lockers', 'Showers'],
        latitude: 12.9784,
        longitude: 77.6408,
        phone: '+91 98765 43211',
        timings: '6:00 AM - 10:00 PM',
        gradient: 'orange-rose',
        image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800'
    },
    {
        name: 'Zenith Fitness Studio',
        area: 'Indiranagar',
        address: 'Double Road, Indiranagar, Bangalore',
        distance: '1.5 km',
        rating: 4.9,
        tier: 'Elite',
        amenities: ['Yoga', 'Pilates', 'Meditation Room', 'Organic Cafe', 'Valet Parking'],
        latitude: 12.9750,
        longitude: 77.6350,
        phone: '+91 98765 43212',
        timings: '6:00 AM - 9:00 PM',
        gradient: 'teal-cyan',
        image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800'
    },
    {
        name: 'FitStop Express',
        area: 'Indiranagar',
        address: '80 Feet Rd, Indiranagar, Bangalore',
        distance: '0.5 km',
        rating: 4.3,
        tier: 'Pro',
        amenities: ['24/7 Access', 'Cardio', 'Strength Machines', 'WiFi'],
        latitude: 12.9730,
        longitude: 77.6450,
        phone: '+91 98765 43213',
        timings: '24/7',
        gradient: 'blue-indigo',
        image: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800'
    }
];

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

/**
 * Seed the database with sample data
 * @returns {Promise<Object>} Seed results
 */
export const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seed...');
        const results = {
            workouts: 0,
            gyms: 0,
            classes: 0,
            user: false,
            bookings: 0,
            checkins: 0
        };

        // Seed workouts
        console.log('📝 Seeding workouts...');
        for (const workout of workouts) {
            const workoutRef = doc(collection(db, 'workouts'));
            await setDoc(workoutRef, {
                ...workout,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            results.workouts++;
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
            results.gyms++;

            // Seed classes for each gym
            const classes = generateClasses(gymRef.id);
            for (const classData of classes) {
                await addDoc(collection(db, 'gyms', gymRef.id, 'classes'), {
                    ...classData,
                    createdAt: serverTimestamp()
                });
                results.classes++;
            }
        }

        // Seed sample user
        console.log('👤 Seeding sample user...');
        const userId = 'demo_user_123';
        await setDoc(doc(db, 'users', userId), {
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
            },
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        results.user = true;

        // Seed sample booking
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
            results.bookings++;
        }

        // Seed sample checkins
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
            results.checkins++;
        }

        console.log('✨ Database seeding completed!', results);
        return results;
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    }
};

