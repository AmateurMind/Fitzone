import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Platform } from 'react-native';
import Icon from '../ui/Icon';

// Generate image URL based on workout category and title
const getWorkoutImageUrl = (workout) => {
    if (!workout) return 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800';

    const title = (workout.title || '').toLowerCase();
    const category = (workout.category || '').toLowerCase();

    // Map workouts to appropriate Unsplash images
    if (title.includes('hiit') || category === 'hiit') {
        return 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800';
    }
    if (title.includes('yoga') || category === 'yoga') {
        return 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800';
    }
    if (title.includes('dance') || category === 'dance') {
        return 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800';
    }
    if (title.includes('core') || title.includes('crusher')) {
        return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800';
    }
    if (title.includes('upper') || title.includes('strength') || category === 'strength') {
        return 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800';
    }
    if (title.includes('stretch') || title.includes('morning') || category === 'pilates') {
        return 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800';
    }
    if (category === 'cardio') {
        return 'https://images.unsplash.com/photo-1434608519347-1a85abd4f135?w=800';
    }
    // Default fitness image
    return 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800';
};

// Helper to map gradient class names to hex colors (since RN doesn't support CSS gradients natively)
const getGradientColor = (gradientClass) => {
    if (gradientClass?.includes('orange')) return '#F97316';
    if (gradientClass?.includes('teal')) return '#14B8A6';
    if (gradientClass?.includes('purple')) return '#A855F7';
    if (gradientClass?.includes('blue')) return '#3B82F6';
    if (gradientClass?.includes('green')) return '#22C55E';
    if (gradientClass?.includes('pink')) return '#EC4899';
    return '#14B8A6';
};

const WorkoutCard = ({ workout, onClick }) => {
    const imageUrl = getWorkoutImageUrl(workout);
    const [imageError, setImageError] = useState(false);
    const bgColor = getGradientColor(workout.gradient || 'teal');

    return (
        <TouchableOpacity
            onPress={onClick}
            activeOpacity={0.9}
            className="rounded-2xl overflow-hidden bg-slate-800 mr-4"
            style={[
                { width: 280 },
                Platform.OS === 'web' ? {
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.25)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease',
                } : {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                    elevation: 4,
                }
            ]}
        >
            {/* Header with Image */}
            <View className="h-40 relative" style={{ backgroundColor: bgColor }}>
                {!imageError ? (
                    <Image
                        source={{ uri: imageUrl }}
                        className="w-full h-full"
                        resizeMode="cover"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <View className="w-full h-full items-center justify-center">
                        <Icon name="Activity" size={48} color="rgba(255,255,255,0.3)" />
                    </View>
                )}

                {/* Gradient Overlay for better text visibility */}
                <View
                    className="absolute inset-0"
                    style={Platform.OS === 'web' ? {
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.8) 100%)',
                    } : {
                        backgroundColor: 'rgba(0,0,0,0.4)',
                    }}
                />

                {/* Top Badges */}
                <View className="absolute top-3 left-3 flex-row gap-2">
                    <View className="px-2.5 py-1 bg-black/50 rounded-full blur-[2px]">
                        <Text className="text-[10px] text-white font-bold uppercase tracking-wider">{workout.duration} min</Text>
                    </View>
                    <View
                        className="px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: bgColor + 'CC' }}
                    >
                        <Text className="text-[10px] text-white font-bold uppercase tracking-wider">{workout.difficulty}</Text>
                    </View>
                </View>

                {/* Premium Badge */}
                {workout.isPremium && (
                    <View className="absolute top-3 right-3 bg-amber-400 rounded-full p-1.5">
                        <Icon name="Crown" size={12} color="#92400E" />
                    </View>
                )}

                {/* Title and Trainer */}
                <View className="absolute bottom-3 left-3 right-3">
                    <Text className="text-white font-bold text-lg leading-tight" numberOfLines={1}>
                        {workout.title}
                    </Text>
                    <Text className="text-slate-200 text-xs mt-0.5 opacity-90">{workout.trainer}</Text>
                </View>
            </View>

            {/* Bottom Info Section */}
            <View className="p-3.5 flex-row items-center justify-between bg-slate-800/50">
                <View className="flex-row items-center gap-3">
                    <View className="flex-row items-center gap-1.5">
                        <Icon name="Zap" size={14} color="#FB923C" />
                        <Text className="text-slate-300 text-xs font-semibold">{workout.calories} kcal</Text>
                    </View>
                    <View className="flex-row items-center gap-1.5 border-l border-slate-700 pl-3">
                        <Icon name="Users" size={14} color="#94A3B8" />
                        <Text className="text-slate-400 text-xs">{(workout.id * 123) % 400 + 100} joined</Text>
                    </View>
                </View>

                <View className="p-1.5 bg-slate-700/50 rounded-lg">
                    <Icon name="ChevronRight" size={14} color="#64748B" />
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default WorkoutCard;

