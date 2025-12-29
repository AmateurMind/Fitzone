import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import Icon from '../ui/Icon';

const AIRecommendationCard = ({ recommendation, onPress, loading }) => {
    const cardStyle = [
        Platform.OS === 'web' ? {
            background: 'linear-gradient(135deg, #14B8A6 0%, #0891B2 100%)',
            boxShadow: '0 8px 30px rgba(20, 184, 166, 0.2)',
            cursor: 'pointer',
        } : {
            backgroundColor: '#14B8A6', // Fallback for native without linear gradient
            shadowColor: '#14B8A6',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 8,
        }
    ];

    if (loading) {
        return (
            <View
                className="mx-5 mb-4 rounded-3xl p-6"
                style={cardStyle}
            >
                <View className="flex-row items-center gap-4">
                    <View className="w-14 h-14 bg-white/20 rounded-2xl items-center justify-center">
                        <Icon name="Sparkles" size={28} color="white" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-white font-bold text-xl">AI is thinking...</Text>
                        <Text className="text-teal-50/80 text-sm mt-1">Curating your personalized routine</Text>
                    </View>
                </View>
                <View className="mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <View className="h-full bg-white/40 w-1/3" />
                </View>
            </View>
        );
    }

    if (!recommendation) return null;

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.9}
            className="mx-5 mb-6 rounded-3xl p-6"
            style={cardStyle}
        >
            <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 bg-white/20 rounded-xl items-center justify-center">
                        <Icon name="Zap" size={20} color="white" />
                    </View>
                    <View>
                        <Text className="text-white font-bold text-lg">AI Recommended</Text>
                        <Text className="text-teal-50/70 text-[10px] font-bold uppercase tracking-widest">Personalized For You</Text>
                    </View>
                </View>
                <View className="px-3 py-1 bg-white/20 rounded-full backdrop-blur-md">
                    <Text className="text-white text-xs font-bold">✨ Smart</Text>
                </View>
            </View>

            <Text className="text-white/90 text-sm leading-relaxed mb-5 font-medium">
                "{recommendation.reason}"
            </Text>

            {recommendation.suggestedWorkout && (
                <View
                    className="bg-black/10 rounded-2xl p-4"
                    style={Platform.OS === 'web' ? { backdropFilter: 'blur(10px)' } : {}}
                >
                    <View className="flex-row justify-between items-start mb-3">
                        <Text className="text-white font-bold text-base flex-1 mr-2">
                            {recommendation.suggestedWorkout.title}
                        </Text>
                        <View className="px-2 py-1 bg-white/10 rounded-lg">
                            <Text className="text-white text-[10px] font-bold uppercase">
                                {recommendation.suggestedWorkout.difficulty}
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row items-center gap-4">
                        <View className="flex-row items-center gap-1.5">
                            <Icon name="Clock" size={12} color="rgba(255,255,255,0.7)" />
                            <Text className="text-teal-50/90 text-xs font-semibold">
                                {recommendation.suggestedWorkout.duration}m
                            </Text>
                        </View>
                        <View className="flex-row items-center gap-1.5">
                            <Icon name="Zap" size={12} color="rgba(255,255,255,0.7)" />
                            <Text className="text-teal-50/90 text-xs font-semibold">
                                {recommendation.suggestedWorkout.calories}kcal
                            </Text>
                        </View>
                    </View>

                    {recommendation.tip && (
                        <View className="mt-3 pt-3 border-t border-white/5 flex-row items-center gap-2">
                            <Icon name="Lightbulb" size={12} color="#FDE047" />
                            <Text className="text-teal-50/80 text-[11px] italic flex-1">
                                {recommendation.tip}
                            </Text>
                        </View>
                    )}
                </View>
            )}

            <View className="mt-4 flex-row items-center justify-center gap-2">
                <Text className="text-white/60 text-xs font-medium">Tap to start workout</Text>
                <Icon name="ArrowRight" size={12} color="rgba(255,255,255,0.6)" />
            </View>
        </TouchableOpacity>
    );
};

export default AIRecommendationCard;

