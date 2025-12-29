import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Image } from 'react-native';
import Icon from '../components/ui/Icon';
import { getWorkouts } from '../services/workouts.service';

// Real workout images from Unsplash
const workoutImages = {
    dance: { uri: 'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?w=800&q=80' },
    corecrusher: { uri: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80' },
    hiit: { uri: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=800&q=80' },
    yoga: { uri: 'https://images.unsplash.com/photo-1544367563-12123d896689?w=800&q=80' },
    stretch: { uri: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80' },
    upperbody: { uri: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80' },
    default: { uri: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80' }
};

const WorkoutsScreen = ({ setScreen, setSelectedWorkout }) => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [difficulty, setDifficulty] = useState('All');
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const categories = ['All', 'HIIT', 'Strength', 'Yoga', 'Cardio', 'Dance', 'Pilates'];
    const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

    useEffect(() => {
        loadWorkouts();
    }, []);

    const loadWorkouts = async () => {
        try {
            setLoading(true);
            const data = await getWorkouts();
            setWorkouts(data);
        } catch (error) {
            console.error('Error loading workouts:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredWorkouts = workouts.filter(workout => {
        const matchesCategory = activeCategory === 'All' || workout.category === activeCategory;
        const matchesDifficulty = difficulty === 'All' || (workout.difficulty || '').toLowerCase() === difficulty.toLowerCase();
        const matchesSearch = !searchQuery ||
            workout.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            workout.trainer.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesDifficulty && matchesSearch;
    });

    const getGradientColor = (gradientClass) => {
        if (gradientClass.includes('orange')) return '#F97316';
        if (gradientClass.includes('purple')) return '#A855F7';
        if (gradientClass.includes('blue')) return '#3B82F6';
        if (gradientClass.includes('pink')) return '#EC4899';
        if (gradientClass.includes('green')) return '#22C55E';
        return '#14B8A6';
    };

    const getWorkoutImage = (workout) => {
        // Map workouts to mascot images
        const title = (workout.title || '').toLowerCase();
        const category = (workout.category || '').toLowerCase();

        // Dance workouts
        if (title.includes('dance') || category === 'dance') {
            return workoutImages.dance;
        }
        // HIIT workouts
        if (category === 'hiit' || title.includes('hiit')) {
            return workoutImages.hiit;
        }
        // Yoga workouts
        if (category === 'yoga' || title.includes('yoga')) {
            return workoutImages.yoga;
        }
        // Morning Stretch / Stretching / Flexibility
        if (title.includes('morning') || title.includes('stretch') || title.includes('flex') || category === 'stretching' || category === 'pilates') {
            return workoutImages.stretch;
        }
        // Upper body / Strength
        if (title.includes('upper') || title.includes('arm') || title.includes('chest') || title.includes('back')) {
            return workoutImages.upperbody;
        }
        // Core workouts
        if (title.includes('core') || title.includes('ab') || category === 'strength') {
            return workoutImages.corecrusher;
        }
        // Cardio - use HIIT image
        if (category === 'cardio') {
            return workoutImages.hiit;
        }
        // Default
        return workoutImages.corecrusher;
    };

    return (
        <SafeAreaView className="flex-1 bg-black">
            <View className="flex-1 px-5 pt-4">
                {/* Header Title */}
                <Text className="text-white text-4xl font-bold mb-6 mt-2">Workouts</Text>

                {/* Search Bar */}
                <View className="flex-row items-center mb-6">
                    <View className="flex-1 h-12 bg-[#2C2C2E] rounded-full flex-row items-center px-4 mr-3">
                        <Icon name="Search" size={20} color="#8E8E93" />
                        <TextInput
                            placeholder="Search workouts, trainers..."
                            placeholderTextColor="#8E8E93"
                            className="flex-1 ml-3 text-white text-base"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                    <TouchableOpacity className="w-12 h-12 bg-[#86D6C6] rounded-full items-center justify-center">
                        <Icon name="Filter" size={20} color="#004D40" />
                    </TouchableOpacity>
                </View>

                {/* Categories & Difficulty Filters */}
                <View className="mb-6">
                    {/* Categories Row */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3" contentContainerStyle={{ paddingRight: 20 }}>
                        <Text className="text-white font-bold mr-4 self-center">Workout Type</Text>
                        {categories.map(cat => (
                            <TouchableOpacity
                                key={cat}
                                onPress={() => setActiveCategory(cat)}
                                className={`px-4 py-1.5 rounded-full mr-2 ${activeCategory === cat ? 'bg-[#86D6C6]' : 'bg-[#2C2C2E]'}`}
                            >
                                <Text className={`text-sm font-medium ${activeCategory === cat ? 'text-[#004D40]' : 'text-[#8E8E93]'}`}>
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Difficulty Row */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20 }}>
                        <Text className="text-white font-bold mr-9 self-center">Difficulty</Text>
                        {difficulties.map(level => (
                            <TouchableOpacity
                                key={level}
                                onPress={() => setDifficulty(level)}
                                className={`px-4 py-1.5 rounded-full mr-2 ${difficulty === level ? 'bg-[#2C2C2E] border border-white/20' : 'bg-[#2C2C2E]'}`}
                            >
                                <Text className={`text-sm font-medium ${difficulty === level ? 'text-white' : 'text-[#8E8E93]'}`}>
                                    {level}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Workout List */}
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#86D6C6" className="mt-10" />
                    ) : filteredWorkouts.length === 0 ? (
                        <Text className="text-[#8E8E93] text-center mt-10">No workouts found.</Text>
                    ) : (
                        filteredWorkouts.map(workout => (
                            <TouchableOpacity
                                key={workout.id}
                                onPress={() => { setSelectedWorkout(workout); setScreen('workout-detail'); }}
                                className="bg-[#1C1C1E] p-4 rounded-[24px] mb-4 flex-row items-center"
                            >
                                {/* Avatar */}
                                <View className={`w-16 h-16 rounded-full items-center justify-center mr-4 overflow-hidden bg-${workout.gradient ? workout.gradient.split('-')[1] + '-500' : 'gray-700'}/20`}>
                                    <Image
                                        source={getWorkoutImage(workout)}
                                        className="w-14 h-14"
                                        resizeMode="contain"
                                    />
                                </View>

                                {/* Info */}
                                <View className="flex-1 justify-center">
                                    <Text className="text-white text-lg font-bold mb-1">{workout.title}</Text>
                                    <Text className="text-[#8E8E93] text-sm">{workout.trainer || 'FitZone Trainer'}</Text>
                                </View>

                                {/* Stats */}
                                <View className="items-end justify-center">
                                    <View className="flex-row items-center mb-1">
                                        <Icon name="Clock" size={14} color="#8E8E93" />
                                        <Text className="text-[#8E8E93] text-xs ml-1">{workout.duration} min</Text>
                                    </View>
                                    <View className="flex-row items-center">
                                        <Icon name="Zap" size={14} color="#86D6C6" />
                                        <Text className="text-[#8E8E93] text-xs ml-1">{workout.calories} kcal</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default WorkoutsScreen;
