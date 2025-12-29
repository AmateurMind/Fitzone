import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Image, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '../components/ui/Icon';
import VoiceGuidedWorkout from '../components/workout/VoiceGuidedWorkout';

const { width } = Dimensions.get('window');

const WorkoutDetailScreen = ({ workout, setScreen, setSelectedExercise }) => {
    const [showVoiceWorkout, setShowVoiceWorkout] = useState(false);

    // Generate exercises based on workout type
    const getExercisesForWorkout = (workout) => {
        const title = (workout?.title || '').toLowerCase();

        // HIIT Workouts
        if (title.includes('hiit') || title.includes('blast')) {
            return [
                { name: 'Warm Up', duration: '5 sec', type: 'warmup' },
                { name: 'Jumping Jacks', duration: '5 sec', type: 'cardio' },
                { name: 'Burpees', duration: '5 sec', type: 'cardio' },
                { name: 'Mountain Climbers', duration: '5 sec', type: 'cardio' },
                { name: 'Squats', duration: '5 sec', type: 'strength' },
                { name: 'Push Ups', duration: '5 sec', type: 'strength' },
                { name: 'High Knees', duration: '5 sec', type: 'cardio' },
                { name: 'Plank Hold', duration: '5 sec', type: 'core' },
                { name: 'Cool Down', duration: '5 sec', type: 'cooldown' },
            ];
        }

        // Yoga Workouts
        if (title.includes('yoga') || title.includes('flow')) {
            return [
                { name: 'Warm Up', duration: '5 sec', type: 'warmup' },
                { name: 'Sun Salutation', duration: '5 sec', type: 'yoga' },
                { name: 'Warrior Poses', duration: '5 sec', type: 'yoga' },
                { name: 'Triangle Pose', duration: '5 sec', type: 'yoga' },
                { name: 'Tree Pose', duration: '5 sec', type: 'yoga' },
                { name: 'Downward Dog', duration: '5 sec', type: 'yoga' },
                { name: 'Child\'s Pose', duration: '5 sec', type: 'yoga' },
                { name: 'Savasana', duration: '5 sec', type: 'cooldown' },
            ];
        }

        // Core Workouts
        if (title.includes('core') || title.includes('crusher') || title.includes('abs')) {
            return [
                { name: 'Warm Up', duration: '5 sec', type: 'warmup' },
                { name: 'Plank Hold', duration: '5 sec', type: 'core' },
                { name: 'Bicycle Crunches', duration: '5 sec', type: 'core' },
                { name: 'Russian Twists', duration: '5 sec', type: 'core' },
                { name: 'Leg Raises', duration: '5 sec', type: 'core' },
                { name: 'Mountain Climbers', duration: '5 sec', type: 'core' },
                { name: 'Side Plank', duration: '5 sec', type: 'core' },
                { name: 'Cool Down', duration: '5 sec', type: 'cooldown' },
            ];
        }

        // Dance Workouts
        if (title.includes('dance') || title.includes('party')) {
            return [
                { name: 'Warm Up', duration: '5 sec', type: 'warmup' },
                { name: 'Basic Steps', duration: '5 sec', type: 'dance' },
                { name: 'Hip Hop Moves', duration: '5 sec', type: 'dance' },
                { name: 'Cardio Dance', duration: '5 sec', type: 'cardio' },
                { name: 'Freestyle', duration: '5 sec', type: 'dance' },
                { name: 'Cool Down Dance', duration: '5 sec', type: 'cooldown' },
            ];
        }

        // Upper Body / Strength Workouts
        if (title.includes('upper') || title.includes('strength') || title.includes('power')) {
            return [
                { name: 'Warm Up', duration: '5 sec', type: 'warmup' },
                { name: 'Push Ups', duration: '5 sec', type: 'strength' },
                { name: 'Dumbbell Press', duration: '5 sec', type: 'strength' },
                { name: 'Tricep Dips', duration: '5 sec', type: 'strength' },
                { name: 'Bicep Curls', duration: '5 sec', type: 'strength' },
                { name: 'Shoulder Press', duration: '5 sec', type: 'strength' },
                { name: 'Plank to Push Up', duration: '5 sec', type: 'strength' },
                { name: 'Cool Down', duration: '5 sec', type: 'cooldown' },
            ];
        }

        // Stretch / Morning Workouts
        if (title.includes('stretch') || title.includes('morning') || title.includes('flexibility')) {
            return [
                { name: 'Gentle Wake Up', duration: '5 sec', type: 'warmup' },
                { name: 'Neck Rolls', duration: '5 sec', type: 'stretch' },
                { name: 'Shoulder Stretch', duration: '5 sec', type: 'stretch' },
                { name: 'Hamstring Stretch', duration: '5 sec', type: 'stretch' },
                { name: 'Hip Flexor Stretch', duration: '5 sec', type: 'stretch' },
                { name: 'Spinal Twist', duration: '5 sec', type: 'stretch' },
                { name: 'Full Body Stretch', duration: '5 sec', type: 'stretch' },
            ];
        }

        // Default Full Body Workout
        return [
            { name: 'Warm Up', duration: '5 sec', type: 'warmup' },
            { name: 'Jumping Jacks', duration: '5 sec', type: 'cardio' },
            { name: 'Squats', duration: '5 sec', type: 'strength' },
            { name: 'Push Ups', duration: '5 sec', type: 'strength' },
            { name: 'Lunges', duration: '5 sec', type: 'strength' },
            { name: 'Plank Hold', duration: '5 sec', type: 'core' },
            { name: 'Burpees', duration: '5 sec', type: 'cardio' },
            { name: 'Cool Down', duration: '5 sec', type: 'cooldown' },
        ];
    };

    const exercises = getExercisesForWorkout(workout);

    const handleExerciseClick = (exercise) => {
        setSelectedExercise(exercise);
        setScreen('exercise-detail');
    };

    const getWorkoutImageUrl = (workout) => {
        if (!workout) return 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800';

        const title = (workout.title || '').toLowerCase();
        const category = (workout.category || '').toLowerCase();

        // Map workouts to Unsplash search terms (reused logic)
        if (title.includes('hiit') || category === 'hiit') return 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800';
        if (title.includes('yoga') || category === 'yoga') return 'https://images.unsplash.com/photo-1544367563-12123d896689?w=800';
        if (title.includes('dance') || category === 'dance') return 'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?w=800';
        if (title.includes('core') || title.includes('crusher')) return 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800';
        if (title.includes('upper') || title.includes('strength') || category === 'strength') return 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800';
        if (title.includes('stretch') || title.includes('morning') || category === 'pilates') return 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800';
        if (category === 'cardio') return 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=800';

        return 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800';
    };

    return (
        <View className="flex-1 bg-black">
            <ScrollView className="flex-1 pb-32" showsVerticalScrollIndicator={false} bounces={false}>
                {/* Hero Header Section */}
                <View className="relative w-full h-[450px]">
                    <Image
                        source={{ uri: getWorkoutImageUrl(workout) }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />

                    {/* Gradient Overlay */}
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)', '#000000']}
                        locations={[0, 0.4, 0.7, 1]}
                        className="absolute inset-0"
                    />

                    {/* Back Button */}
                    <SafeAreaView className="absolute top-0 left-0 w-full z-20">
                        <TouchableOpacity
                            onPress={() => setScreen('workouts')}
                            className="ml-5 mt-2 w-10 h-10 bg-black/40 rounded-full items-center justify-center border border-white/10 backdrop-blur-md"
                        >
                            <Icon name="ArrowLeft" size={20} color="white" />
                        </TouchableOpacity>
                    </SafeAreaView>

                    {/* Header Content */}
                    <View className="absolute bottom-0 left-0 right-0 px-6 pb-8">
                        {/* Tags/Badges */}
                        <View className="flex-row items-center gap-2 mb-4">
                            <View className="bg-[#14B8A6] px-3 py-1.5 rounded-full">
                                <Text className="text-white text-xs font-bold uppercase tracking-wide">
                                    {workout?.difficulty || 'Intermediate'}
                                </Text>
                            </View>
                            {workout?.isPremium && (
                                <View className="bg-amber-500 px-3 py-1.5 rounded-full flex-row items-center gap-1">
                                    <Icon name="Crown" size={10} color="white" />
                                    <Text className="text-white text-xs font-bold uppercase tracking-wide">Premium</Text>
                                </View>
                            )}
                        </View>

                        <Text className="text-white text-4xl font-extrabold leading-tight mb-2 shadow-sm">
                            {workout?.title || 'Core Crusher'}
                        </Text>
                        <Text className="text-slate-300 text-lg font-medium">
                            with <Text className="text-white">{workout?.trainer || 'Neha Singh'}</Text>
                        </Text>
                    </View>
                </View>

                {/* Main Content Body */}
                <View className="px-5 -mt-6">
                    {/* Stats Row */}
                    <View className="flex-row gap-3 mb-8">
                        <View className="flex-1 bg-[#1C1C1E] p-4 rounded-2xl items-center justify-center border border-slate-800/50">
                            <Icon name="Clock" size={20} color="#2DD4BF" />
                            <Text className="text-white text-lg font-bold mt-2">{workout?.duration || 20} <Text className="text-sm font-normal text-slate-500">min</Text></Text>
                            <Text className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mt-1">Duration</Text>
                        </View>
                        <View className="flex-1 bg-[#1C1C1E] p-4 rounded-2xl items-center justify-center border border-slate-800/50">
                            <Icon name="Zap" size={20} color="#F97316" />
                            <Text className="text-white text-lg font-bold mt-2">{workout?.calories || 180}</Text>
                            <Text className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mt-1">Calories</Text>
                        </View>
                        <View className="flex-1 bg-[#1C1C1E] p-4 rounded-2xl items-center justify-center border border-slate-800/50">
                            <Icon name="Activity" size={20} color="#A855F7" />
                            <Text className="text-white text-lg font-bold mt-2">{exercises.length}</Text>
                            <Text className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mt-1">Exercises</Text>
                        </View>
                    </View>

                    {/* About Section */}
                    <View className="mb-8">
                        <Text className="text-white text-xl font-bold mb-3">About this workout</Text>
                        <Text className="text-slate-400 leading-6 text-[15px]">
                            High intensity interval training designed to burn maximum calories and build lean muscle.
                            This full-body workout combines cardio and strength exercises for a complete fitness session.
                        </Text>
                    </View>

                    {/* Equipment Section */}
                    <View className="mb-8">
                        <Text className="text-white text-xl font-bold mb-3">Equipment Needed</Text>
                        <View className="flex-row flex-wrap gap-2">
                            {['Yoga Mat', 'Dumbbells', 'Water Bottle'].map((item) => (
                                <View key={item} className="bg-[#2C2C2E] px-4 py-2 rounded-full border border-slate-700/50">
                                    <Text className="text-slate-300 text-sm font-medium">{item}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Exercise List */}
                    <View className="mb-32">
                        <View className="flex-row justify-between items-end mb-4">
                            <Text className="text-white text-xl font-bold">Exercises</Text>
                            <Text className="text-slate-500 text-sm font-medium">{exercises.length} movements</Text>
                        </View>

                        <View className="gap-3">
                            {exercises.map((ex, i) => (
                                <TouchableOpacity
                                    key={i}
                                    onPress={() => handleExerciseClick(ex)}
                                    className="bg-[#1C1C1E] p-4 rounded-2xl flex-row items-center border border-slate-800/50 active:bg-[#2C2C2E] transition-colors"
                                >
                                    <View className="w-8 h-8 bg-[#2C2C2E] rounded-lg items-center justify-center mr-4">
                                        <Text className="text-[#A4FF00] font-bold font-mono">{i + 1}</Text>
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-white font-semibold text-base">{ex.name}</Text>
                                        <Text className="text-slate-500 text-xs">{ex.duration || ex.reps} • {ex.type}</Text>
                                    </View>
                                    <Icon name="ChevronRight" size={16} color="#525252" />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Sticky Bottom Button */}
            <View className="absolute bottom-0 left-0 right-0 p-5 bg-black/80 blur-xl">
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)', '#000000']}
                    locations={[0, 0.1, 0.4]}
                    className="absolute -top-10 left-0 right-0 h-10"
                />
            </View>
            <SafeAreaView className="absolute bottom-0 w-full p-5">
                <TouchableOpacity
                    onPress={() => setShowVoiceWorkout(true)}
                    className="w-full bg-[#14B8A6] h-14 rounded-2xl flex-row items-center justify-center shadow-lg shadow-teal-500/20 active:opacity-90"
                >
                    <Icon name="Play" size={20} color="white" />
                    <Text className="text-white font-bold text-lg ml-2 tracking-wide">Start AI Voice-Guided Workout</Text>
                </TouchableOpacity>
            </SafeAreaView>

            {/* Voice-Guided Workout Modal */}
            {showVoiceWorkout && (
                <View className="absolute inset-0 z-50 bg-black">
                    <VoiceGuidedWorkout
                        exercises={exercises}
                        workoutName={workout?.title || 'Workout'}
                        onComplete={() => {
                            setShowVoiceWorkout(false);
                            setScreen('home');
                        }}
                        onPause={() => console.log('Workout paused')}
                        onResume={() => console.log('Workout resumed')}
                    />
                    <SafeAreaView className="absolute top-0 right-0 p-4">
                        <TouchableOpacity
                            onPress={() => setShowVoiceWorkout(false)}
                            className="w-10 h-10 bg-[#1C1C1E] rounded-full items-center justify-center border border-slate-700"
                        >
                            <Icon name="X" size={20} color="white" />
                        </TouchableOpacity>
                    </SafeAreaView>
                </View>
            )}
        </View>
    );
};

export default WorkoutDetailScreen;
