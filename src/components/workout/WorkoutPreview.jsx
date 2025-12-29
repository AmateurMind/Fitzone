import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated, Easing, Image } from 'react-native';
import Icon from '../ui/Icon';

const WorkoutPreview = ({ workout, onBack, onStart }) => {
    // Animation for the main Hero Image (Slight zoom loop)
    const zoomAnim = useRef(new Animated.Value(1)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Entrance Fade
        Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: Platform.OS !== 'web' }).start();

        // Hero Zoom Loop (Simulates a video breathing effect)
        Animated.loop(
            Animated.sequence([
                Animated.timing(zoomAnim, {
                    toValue: 1.05,
                    duration: 4000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: Platform.OS !== 'web',
                }),
                Animated.timing(zoomAnim, {
                    toValue: 1,
                    duration: 4000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: Platform.OS !== 'web',
                }),
            ])
        ).start();
    }, []);

    return (
        <View className="flex-1 bg-[#0F172A]">
            {/* 1. HERO ANIMATED PREVIEW */}
            <View className="h-[45%] w-full overflow-hidden relative">
                <Animated.View style={{ transform: [{ scale: zoomAnim }], flex: 1 }}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000' }}
                        className="w-full h-full opacity-60"
                        resizeMode="cover"
                    />
                </Animated.View>

                {/* Overlay Gradient & Play Icon */}
                <View className="absolute inset-0 bg-black/20 items-center justify-center">
                    <View className="w-20 h-20 bg-teal-500/20 rounded-full items-center justify-center border border-teal-400/40">
                        <Icon name="Play" size={40} color="#2DD4BF" fill="#2DD4BF" />
                    </View>
                    <View className="bg-teal-500 px-3 py-1 rounded-full mt-4">
                        <Text className="text-[10px] font-bold text-white uppercase tracking-tighter">Preview Loop</Text>
                    </View>
                </View>

                {/* Header UI */}
                <TouchableOpacity
                    onPress={onBack}
                    className="absolute top-12 left-6 z-20 w-10 h-10 bg-black/40 rounded-full items-center justify-center"
                >
                    <Icon name="ChevronLeft" color="white" size={24} />
                </TouchableOpacity>
            </View>

            {/* 2. EXERCISE LIST WITH MOTION MINI-PREVIEWS */}
            <View className="flex-1 px-6 -mt-10 bg-[#0F172A] rounded-t-[40px] pt-8">
                <Text className="text-white text-2xl font-bold mb-6">Exercises</Text>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                    <ExerciseRow
                        name="Jumping Jacks"
                        subtitle="0:45 • Cardio"
                        gifUrl="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJueXF6bm96bm96bm96bm96bm96bm96bm96bm96bm96bm96JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxxcahtdc9W/giphy.gif"
                    />
                    <ExerciseRow
                        name="Mountain Climbers"
                        subtitle="0:30 • Core"
                        gifUrl="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJueXF6bm96bm96bm96bm96bm96bm96bm96bm96bm96bm96JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/l41lS27mD4lXNfL8s/giphy.gif"
                    />
                    <ExerciseRow
                        name="Burpees"
                        subtitle="10 Reps • Power"
                        gifUrl="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJueXF6bm96bm96bm96bm96bm96bm96bm96bm96bm96bm96JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/26uf7p7U92B3O3lPa/giphy.gif"
                    />
                </ScrollView>
            </View>

            {/* Fixed Start Button */}
            <View className="absolute bottom-10 w-full px-6">
                <TouchableOpacity
                    onPress={onStart}
                    className="bg-teal-500 py-5 rounded-2xl items-center shadow-2xl shadow-teal-500/40"
                >
                    <Text className="text-white text-xl font-bold">Start Workout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// COMPONENT: Individual Exercise Row with Looping GIF/Preview
const ExerciseRow = ({ name, subtitle, gifUrl }) => {
    return (
        <View className="flex-row items-center bg-slate-800/40 border border-white/5 p-3 rounded-3xl mb-4">
            {/* The Looping Preview Window */}
            <View className="w-20 h-20 bg-slate-700 rounded-2xl overflow-hidden border border-teal-500/20">
                <Image
                    source={{ uri: gifUrl }}
                    className="w-full h-full"
                    resizeMode="cover"
                />
                {/* Subtle overlay to make it look "Techy" */}
                <View className="absolute inset-0 bg-teal-500/10" />
            </View>

            {/* Exercise Details */}
            <View className="ml-4 flex-1">
                <Text className="text-white text-lg font-bold">{name}</Text>
                <Text className="text-slate-400 text-sm">{subtitle}</Text>
            </View>

            {/* Action Icon */}
            <View className="mr-2">
                <Icon name="Info" size={20} color="#64748B" />
            </View>
        </View>
    );
};

export default WorkoutPreview;
