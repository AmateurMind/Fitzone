import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions, Image, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pedometer } from 'expo-sensors';
import Icon from '../components/ui/Icon';
import WorkoutCard from '../components/cards/WorkoutCard';
import ActivityRings from '../components/home/ActivityRings';
import BentoGrid from '../components/home/BentoGrid';
import FitnessPlusCard from '../components/home/FitnessPlusCard';
import { getFeaturedWorkouts } from '../services/workouts.service';
import { getCurrentUser } from '../services/auth.service';
import { getUpcomingBookings } from '../services/bookings.service';
import { useWorkoutRecommendation } from '../hooks/useWorkoutRecommendation';

const { width } = Dimensions.get('window');

const HomeScreen = ({ setScreen, setSelectedWorkout }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [featuredWorkouts, setFeaturedWorkouts] = useState([]);

    // Pedometer State
    const [pastStepCount, setPastStepCount] = useState(0);
    const [currentSessionSteps, setCurrentSessionSteps] = useState(0);
    const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');

    // Derived total steps
    const currentStepCount = pastStepCount + currentSessionSteps;

    // AI Recommendation
    const userProfile = {
        goal: user?.goal || 'general',
        level: user?.fitnessLevel || 'Intermediate',
        preferences: []
    };
    const { recommendedWorkout, loading: aiLoading } = useWorkoutRecommendation(userProfile);

    useEffect(() => {
        loadData();
        subscribeToPedometer();
    }, []);

    const subscribeToPedometer = async () => {
        // Method 1: Try Native Pedometer / Google Fit
        try {
            const { status } = await Pedometer.requestPermissionsAsync();
            if (status === 'granted') {
                const isAvailable = await Pedometer.isAvailableAsync();

                if (isAvailable) {
                    // 1. Try History
                    try {
                        const end = new Date();
                        const start = new Date();
                        start.setHours(0, 0, 0, 0);
                        const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);
                        if (pastStepCountResult) setPastStepCount(pastStepCountResult.steps);
                    } catch (e) {
                        console.log('History fetch failed, using live only');
                    }

                    // 2. Start Live Tracking
                    let initialListenerValue = null;
                    return Pedometer.watchStepCount(result => {
                        if (initialListenerValue === null) initialListenerValue = result.steps;
                        setCurrentSessionSteps(result.steps - initialListenerValue);
                    });
                }
            }
        } catch (e) {
            console.log("Standard Pedometer failed, falling back to Accelerometer", e);
        }

        // Method 2: FALLBACK - Raw Accelerometer for older devices (Samsung On6, J-series)
        // This is a naive implementation: detecting peaks in acceleration magnitude
        // SKIP ON WEB to prevent crashes (setUpdateInterval not supported)
        if (Platform.OS !== 'web') {
            console.log("Activating Accelerometer fallback...");
            Alert.alert("Legacy Mode", "Using accelerometer for step counting since native step sensor is missing.");

            // Dynamic import to avoid crash on non-mobile
            const { Accelerometer } = require('expo-sensors');
            Accelerometer.setUpdateInterval(100); // 10Hz

            let lastMagnitude = 0;
            let stepThreshold = 1.2; // Sensitivity thresold (approx > 1.2G force)
            let lastStepTime = 0;

            const subscription = Accelerometer.addListener(({ x, y, z }) => {
                const magnitude = Math.sqrt(x * x + y * y + z * z);
                const now = Date.now();

                // Detect a "step" if force > threshold and enough time passed (avoid double count)
                if (magnitude > stepThreshold && lastMagnitude <= stepThreshold) {
                    if (now - lastStepTime > 350) { // Max 3 steps per sec limit
                        setCurrentSessionSteps(prev => prev + 1);
                        lastStepTime = now;
                    }
                }
                lastMagnitude = magnitude;
            });

            return subscription;
        }

        return null;
    };

    const loadData = async () => {
        try {
            setLoading(true);
            const [userData, workouts] = await Promise.all([
                getCurrentUser(),
                getFeaturedWorkouts()
            ]);
            setUser(userData);
            setFeaturedWorkouts(workouts);
        } catch (error) {
            console.error('Error loading home data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-black">
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#A4FF00" />
                </View>
            </SafeAreaView>
        );
    }

    const displayName = user?.name || 'User';
    const stats = user?.stats || { workoutsCompleted: 0, caloriesBurned: 0, streak: 0 };

    // Calculate Ring Progress (Mocked Logic for demo visual + Pedometer integration)
    const moveProgress = Math.min((stats.caloriesBurned / 600) * 100, 100);
    const exerciseProgress = Math.min((stats.workoutsCompleted * 30 / 30) * 100, 100);
    const standProgress = Math.min((stats.streak / 12) * 100, 100);

    // Date formatting
    const today = new Date();
    const dateOptions = { weekday: 'long', month: 'short', day: 'numeric' };
    const dateString = today.toLocaleDateString('en-US', dateOptions);

    // Calculate distance from steps (approx 0.762m per step)
    const distanceKm = (currentStepCount * 0.762 / 1000).toFixed(2);

    return (
        <SafeAreaView className="flex-1 bg-black" edges={['top', 'left', 'right']}>
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Header Section */}
                <View className="px-5 pt-4 pb-2 flex-row justify-between items-start">
                    <View>
                        <Text className="text-white text-3xl font-bold tracking-tight mb-0.5">Summary</Text>
                        <Text className="text-[#8E8E93] font-semibold text-xs tracking-wide">{dateString}</Text>
                    </View>

                    {/* Profile & AI Access */}
                    <View className="flex-row items-center gap-3">
                        {/* Hidden AI "Copilot" Button */}
                        <TouchableOpacity
                            onPress={() => setScreen('ai-chat')}
                            className="w-9 h-9 bg-[#1C1C1E] rounded-full items-center justify-center border border-[#3A3A3C]"
                        >
                            <Icon name="Sparkles" size={16} color="#A4FF00" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setScreen('profile')}
                            className="w-9 h-9 bg-[#1C1C1E] rounded-full items-center justify-center border border-[#3A3A3C]"
                        >
                            <Image
                                source={{ uri: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100' }}
                                className="w-full h-full rounded-full opacity-80"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Activity Rings Card - Identical to Reference */}
                <View className="px-4 mt-1 mb-3">
                    <View className="bg-[#1C1C1E] rounded-[20px] p-4 flex-row items-center gap-4">
                        {/* Rings */}
                        <View className="relative">
                            <ActivityRings
                                move={moveProgress}
                                exercise={exerciseProgress}
                                stand={standProgress}
                                scale={0.65} // Adjusted scale for smaller screens
                            />
                        </View>

                        {/* Legend */}
                        <View className="flex-1 gap-3">
                            {/* Move */}
                            <View>
                                <Text className="text-white text-[12px] font-semibold">Move</Text>
                                <View className="flex-row items-baseline gap-1">
                                    <Text className="text-[#FA114F] text-xl font-bold italic font-mono tracking-tight">{stats.caloriesBurned}</Text>
                                    <Text className="text-[#FA114F] text-[13px] font-bold italic tracking-tight">/600 CAL</Text>
                                </View>
                            </View>

                            {/* Exercise */}
                            <View>
                                <Text className="text-white text-[12px] font-semibold">Exercise</Text>
                                <View className="flex-row items-baseline gap-1">
                                    <Text className="text-[#A4FF00] text-xl font-bold italic font-mono tracking-tight">{stats.workoutsCompleted * 30}</Text>
                                    <Text className="text-[#A4FF00] text-[13px] font-bold italic tracking-tight">/30 MIN</Text>
                                </View>
                            </View>

                            {/* Stand */}
                            <View>
                                <Text className="text-white text-[12px] font-semibold">Stand</Text>
                                <View className="flex-row items-baseline gap-1">
                                    <Text className="text-[#00DBFF] text-xl font-bold italic font-mono tracking-tight">{stats.streak}</Text>
                                    <Text className="text-[#00DBFF] text-[13px] font-bold italic tracking-tight">/12 HRS</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Bento Grid Stats (Steps & Distance) */}
                <View className="px-5 mb-8">
                    <BentoGrid
                        steps={currentStepCount || 0}
                        distance={currentStepCount > 0 ? distanceKm : '0.00'}
                        onRefresh={() => {
                            subscribeToPedometer();
                        }}
                    />
                </View>

                {/* Fitness+ Featured Card */}
                <View className="px-5 mb-8">
                    <View className="flex-row justify-between items-center mb-3">
                        <View className="flex-row items-center gap-1">
                            <Icon name="Apple" size={16} color="white" />
                            <Text className="text-white text-xl font-bold tracking-tight">Fitness+</Text>
                        </View>
                        <TouchableOpacity onPress={() => setScreen('workouts')}>
                            <View className="w-6 h-6 bg-[#3A3A3C] rounded-full items-center justify-center">
                                <Icon name="ChevronRight" size={12} color="#8E8E93" />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <FitnessPlusCard
                        title="Low Impact Bodyweight"
                        subtitle="20 MIN • High Intensity"
                        image="https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=800"
                        onPress={() => setScreen('workouts')}
                    />
                </View>

                {/* Recent Workouts List */}
                <View className="px-5 pb-6">
                    <View className="flex-row justify-between items-center mb-3">
                        <Text className="text-white text-xl font-bold tracking-tight">Workouts</Text>
                        <TouchableOpacity onPress={() => setScreen('workouts')}>
                            <Text className="text-[#A4FF00] text-sm font-semibold">Show All</Text>
                        </TouchableOpacity>
                    </View>

                    {featuredWorkouts.slice(0, 3).map(workout => (
                        <TouchableOpacity
                            key={workout.id}
                            onPress={() => { setSelectedWorkout(workout); setScreen('workout-detail'); }}
                            className="bg-[#1C1C1E] p-4 rounded-2xl mb-3 flex-row items-center gap-4"
                        >
                            <View className="w-12 h-12 rounded-full bg-[#3A3A3C] items-center justify-center">
                                <Icon name="Activity" size={20} color="#A4FF00" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-white font-bold text-base tracking-tight">{workout.title}</Text>
                                <Text className="text-[#8E8E93] text-xs font-medium">{workout.category} • {workout.duration} min</Text>
                            </View>
                            <Text className="text-[#A4FF00] font-bold text-sm">OPEN</Text>
                        </TouchableOpacity>
                    ))}
                </View>

            </ScrollView>

            {/* Floating AI Chat Button (Alternative access) */}
            <TouchableOpacity
                onPress={() => setScreen('ai-chat')}
                className="absolute bottom-6 right-6 w-14 h-14 bg-[#3A3A3C] rounded-full items-center justify-center shadow-lg border border-[#A4FF00]/20"
                style={Platform.OS === 'web' ? { boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)' } : { elevation: 5 }}
            >
                <Icon name="Sparkles" size={24} color="#A4FF00" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default HomeScreen;
