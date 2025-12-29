import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Linking } from 'react-native';
import Icon from '../components/ui/Icon';
import { getExerciseByName, calculateCalories, getExerciseImageUrl } from '../services/exercises.service';

const ExerciseDetailScreen = ({ exercise, setScreen }) => {
    const [exerciseData, setExerciseData] = useState(null);
    const [videoData, setVideoData] = useState(null);
    const [aiData, setAIData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mediaType, setMediaType] = useState('video'); // 'video' or 'image'

    useEffect(() => {
        loadExerciseData();
    }, [exercise]);

    const loadExerciseData = async () => {
        try {
            setLoading(true);

            // Get exercise from database
            const data = getExerciseByName(exercise.name);
            setExerciseData(data);

            // Use exercise image from database or get from helper function
            const exerciseImageUrl = data?.imageUrl || getExerciseImageUrl(exercise.name);

            setMediaType('image');
            setAIData({
                imageUrl: exerciseImageUrl,
                description: data ? `${exercise.name} is a fundamental exercise targeting ${data.muscles?.join(', ') || 'multiple muscle groups'}. Follow the instructions carefully for proper form.` : `${exercise.name} is an effective exercise.`,
                formTips: data?.tips || [
                    "Maintain proper form throughout the movement",
                    "Engage your core for stability",
                    "Breathe consistently - exhale on exertion"
                ]
            });
        } catch (error) {
            console.error('Error loading exercise data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleWatchOnYouTube = () => {
        // Open YouTube search for this exercise
        const searchQuery = `${exercise.name} exercise proper form tutorial`;
        const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
        Linking.openURL(url);
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'cardio': return '#F97316';
            case 'strength': return '#14B8A6';
            case 'core': return '#A855F7';
            case 'warmup': return '#3B82F6';
            case 'cooldown': return '#22C55E';
            default: return '#64748B';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'cardio': return 'Heart';
            case 'strength': return 'Dumbbell';
            case 'core': return 'Target';
            case 'warmup': return 'Zap';
            case 'cooldown': return 'Check';
            default: return 'Activity';
        }
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-background">
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#14B8A6" />
                    <Text className="text-slate-400 mt-4">Loading exercise details...</Text>
                </View>
            </SafeAreaView>
        );
    }

    const typeColor = getTypeColor(exerciseData?.type);
    const calories = calculateCalories(exercise.name, exercise.duration ? parseInt(exercise.duration) : 60);

    return (
        <SafeAreaView className="flex-1 bg-background">
            {/* Header */}
            <View className="px-5 pt-4 pb-4 flex-row items-center gap-4 border-b border-slate-800">
                <TouchableOpacity
                    onPress={() => setScreen('workout-detail')}
                    className="w-10 h-10 bg-slate-800 rounded-full items-center justify-center"
                >
                    <Icon name="ArrowLeft" size={20} color="white" />
                </TouchableOpacity>
                <View className="flex-1">
                    <Text className="text-white text-xl font-bold" numberOfLines={1}>
                        {exercise.name}
                    </Text>
                    <View className="flex-row items-center gap-2 mt-1">
                        <View
                            className="px-3 py-1 rounded-full flex-row items-center gap-1"
                            style={{ backgroundColor: `${typeColor}20` }}
                        >
                            <Icon name={getTypeIcon(exerciseData?.type)} size={12} color={typeColor} />
                            <Text className="text-xs font-bold capitalize" style={{ color: typeColor }}>
                                {exerciseData?.type || 'Exercise'}
                            </Text>
                        </View>
                        <View className="px-2 py-1 bg-slate-800 rounded-full">
                            <Text className="text-slate-300 text-xs font-medium">
                                {exerciseData?.difficulty || 'Intermediate'}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            <ScrollView className="flex-1 pb-24" showsVerticalScrollIndicator={false}>
                {/* Media Section */}
                <View className="relative">
                    <View className="aspect-video bg-slate-800 items-center justify-center relative">
                        {/* Background image with overlay */}
                        <View className="absolute inset-0 bg-slate-800" />
                        <View
                            className="absolute inset-0 opacity-30"
                            style={{
                                backgroundImage: aiData?.imageUrl ? `url(${aiData.imageUrl})` : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        />

                        {/* Content */}
                        <View className="relative z-10 items-center">
                            <View className="w-24 h-24 bg-primary/20 rounded-full items-center justify-center mb-4 border-4 border-primary/30">
                                <Icon name={getTypeIcon(exerciseData?.type)} size={48} color="#14B8A6" />
                            </View>
                            <Text className="text-white text-2xl font-bold text-center px-4">{exercise.name}</Text>
                            <Text className="text-slate-300 text-sm mt-2 text-center">
                                Tap "Watch on YouTube" below for video tutorials
                            </Text>
                        </View>
                    </View>

                    {/* Media Type Badge */}
                    <View className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full">
                        <Text className="text-white text-xs font-bold">
                            🖼️ Exercise Guide
                        </Text>
                    </View>
                </View>

                {/* Quick Stats */}
                <View className="px-5 mt-6">
                    <View className="bg-background-card rounded-3xl p-4 flex-row justify-between border border-slate-700/30">
                        <View className="items-center flex-1">
                            <Icon name="Clock" size={20} color="#2DD4BF" />
                            <Text className="text-white font-bold mt-1">{exercise.duration || exercise.reps}</Text>
                            <Text className="text-slate-500 text-xs">Duration</Text>
                        </View>
                        <View className="items-center flex-1 border-l border-slate-700">
                            <Icon name="Zap" size={20} color="#F97316" />
                            <Text className="text-white font-bold mt-1">{calories}</Text>
                            <Text className="text-slate-500 text-xs">Calories</Text>
                        </View>
                        <View className="items-center flex-1 border-l border-slate-700">
                            <Icon name="Target" size={20} color="#A855F7" />
                            <Text className="text-white font-bold mt-1">{exerciseData?.muscles?.length || 1}</Text>
                            <Text className="text-slate-500 text-xs">Muscles</Text>
                        </View>
                    </View>
                </View>

                {/* Description */}
                {(exerciseData || aiData) && (
                    <View className="px-5 mt-6">
                        <Text className="text-white font-bold text-lg mb-3">About</Text>
                        <View className="bg-background-card rounded-2xl p-4 border border-slate-700/30">
                            <Text className="text-slate-300 leading-6">
                                {aiData?.description || `${exercise.name} is an effective exercise targeting multiple muscle groups.`}
                            </Text>
                        </View>
                    </View>
                )}

                {/* Target Muscles */}
                {exerciseData?.muscles && (
                    <View className="px-5 mt-6">
                        <Text className="text-white font-bold text-lg mb-3">Target Muscles</Text>
                        <View className="flex-row flex-wrap gap-2">
                            {exerciseData.muscles.map((muscle, idx) => (
                                <View key={idx} className="bg-primary/20 border border-primary/30 px-4 py-2 rounded-xl">
                                    <Text className="text-primary font-medium">{muscle}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Equipment */}
                {exerciseData?.equipment && (
                    <View className="px-5 mt-6">
                        <Text className="text-white font-bold text-lg mb-3">Equipment Needed</Text>
                        <View className="flex-row flex-wrap gap-2">
                            {exerciseData.equipment.map((item, idx) => (
                                <View key={idx} className="bg-slate-800 px-3 py-2 rounded-lg">
                                    <Text className="text-slate-300">{item}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Instructions */}
                {exerciseData?.instructions && (
                    <View className="px-5 mt-6">
                        <Text className="text-white font-bold text-lg mb-3">Step-by-Step Instructions</Text>
                        <View className="bg-background-card rounded-3xl p-5 border border-slate-700/30">
                            {exerciseData.instructions.map((instruction, idx) => (
                                <View key={idx} className="flex-row gap-3 mb-3">
                                    <View className="w-6 h-6 bg-primary rounded-full items-center justify-center">
                                        <Text className="text-white text-xs font-bold">{idx + 1}</Text>
                                    </View>
                                    <Text className="text-slate-300 flex-1 leading-6">{instruction}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Form Tips */}
                {(exerciseData?.tips || aiData?.formTips) && (
                    <View className="px-5 mt-6">
                        <Text className="text-white font-bold text-lg mb-3">💡 Form Tips</Text>
                        <View className="bg-teal-500/10 rounded-3xl p-5 border border-teal-500/30">
                            {(exerciseData?.tips || aiData?.formTips).map((tip, idx) => (
                                <View key={idx} className="flex-row gap-3 mb-2">
                                    <Text className="text-primary text-lg">•</Text>
                                    <Text className="text-slate-300 flex-1 leading-6">{tip}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Common Mistakes */}
                {exerciseData?.commonMistakes && (
                    <View className="px-5 mt-6 mb-6">
                        <Text className="text-white font-bold text-lg mb-3">⚠️ Common Mistakes</Text>
                        <View className="bg-red-500/10 rounded-3xl p-5 border border-red-500/30">
                            {exerciseData.commonMistakes.map((mistake, idx) => (
                                <View key={idx} className="flex-row gap-3 mb-2">
                                    <Text className="text-red-400 text-lg">✕</Text>
                                    <Text className="text-slate-300 flex-1 leading-6">{mistake}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Action Buttons */}
            <View className="px-5 pb-5 pt-3 bg-background border-t border-slate-800">
                <View className="flex-row gap-3">
                    <TouchableOpacity
                        onPress={handleWatchOnYouTube}
                        className="flex-1 bg-red-600 rounded-2xl py-4 flex-row items-center justify-center gap-2"
                    >
                        <Icon name="Play" size={20} color="white" />
                        <Text className="text-white font-bold">Watch on YouTube</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setScreen('workout-detail')}
                        className="flex-1 bg-primary rounded-2xl py-4 items-center justify-center"
                    >
                        <Text className="text-white font-bold">Back to Workout</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default ExerciseDetailScreen;

