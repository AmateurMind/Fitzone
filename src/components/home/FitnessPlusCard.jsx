import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, Image } from 'react-native';
import Icon from '../ui/Icon';
import { LinearGradient } from 'expo-linear-gradient';

const FitnessPlusCard = ({ onPress, title, subtitle, image }) => {
    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={onPress}
            className="w-full h-72 rounded-[32px] overflow-hidden relative mb-6"
        >
            <ImageBackground
                source={{ uri: image || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800' }}
                className="flex-1"
                resizeMode="cover"
            >
                {/* Gradient Overlay */}
                <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.3)'
                    }}
                />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.9)']}
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: '50%'
                    }}
                />

                {/* Content */}
                <View className="absolute top-6 left-6 flex-row items-center gap-2">
                    <View className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                        <Text className="text-[#A4FF00] text-[10px] font-black tracking-widest uppercase">For Today</Text>
                    </View>
                </View>

                <View className="absolute bottom-6 left-6 right-6">
                    <Text className="text-white text-3xl font-black italic tracking-tighter uppercase mb-2">
                        {title || "HIIT Blast"}
                    </Text>
                    <View className="flex-row items-center gap-2">
                        <Text className="text-slate-300 font-semibold">{subtitle || "20 MIN • High Intensity"}</Text>
                        <Icon name="ChevronRight" size={16} color="#A4FF00" />
                    </View>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    );
};

export default FitnessPlusCard;
