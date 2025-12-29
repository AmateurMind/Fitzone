import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '../ui/Icon';

// Generate image URL based on gym tier and name for better variety
const getGymImageUrl = (gym) => {
    // If gym object has a specific image property, use it (supports local require or uri)
    if (gym?.image) return gym.image;

    // Default fallback if gym is undefined
    if (!gym) return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800';

    const gymImages = [
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800', // Heavy weights/Dark
        'https://images.unsplash.com/photo-1540497073359-09d0b8b0e5b1?w=800', // Modern/Teal
        'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800', // Bright/Spacious
        'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800', // Studio/Yoga
        'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800', // Cardio/Treadmills
        'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800', // Crossfit/Action
        'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800'  // Lifestyle/People
    ];

    const hashString = gym.id || gym.name || 'default';
    let hash = 0;
    for (let i = 0; i < hashString.length; i++) {
        hash = ((hash << 5) - hash) + hashString.charCodeAt(i);
        hash |= 0;
    }

    const index = Math.abs(hash) % gymImages.length;
    return gymImages[index];
};

const GymCard = ({ gym, onClick }) => {
    const imageUrl = getGymImageUrl(gym);
    const [imageError, setImageError] = useState(false);
    const isOpen = true; // Placeholder logic

    // Tier Badge Coloring
    const getTierColor = (tier) => {
        if (tier === 'Elite') return { bg: 'rgba(251, 191, 36, 0.2)', text: '#FBBF24', border: 'rgba(251, 191, 36, 0.3)' };
        if (tier === 'Pro') return { bg: 'rgba(168, 85, 247, 0.2)', text: '#C084FC', border: 'rgba(168, 85, 247, 0.3)' }; // Purple
        return { bg: 'rgba(20, 184, 166, 0.2)', text: '#2DD4BF', border: 'rgba(20, 184, 166, 0.3)' }; // Teal
    };

    const tierStyle = getTierColor(gym.tier);

    return (
        <TouchableOpacity
            onPress={onClick}
            className="bg-[#1C1C1E] rounded-[24px] overflow-hidden border border-slate-800/50"
            activeOpacity={0.9}
        >
            {/* Image Section */}
            <View className="h-44 relative bg-slate-800">
                <Image
                    source={typeof imageUrl === 'number' ? imageUrl : { uri: imageUrl }}
                    className="w-full h-full"
                    resizeMode="cover"
                    onError={() => setImageError(true)}
                />

                {/* Gradient Overlay for badges/contrast */}
                <LinearGradient
                    colors={['rgba(0,0,0,0.6)', 'transparent', 'transparent']}
                    className="absolute inset-0"
                />

                {/* Status Badge (Top Left) */}
                <View className="absolute top-4 left-4">
                    <View className="px-2.5 py-1 bg-emerald-500/90 rounded-full backdrop-blur-md">
                        <Text className="text-white text-[10px] font-bold uppercase tracking-wide">
                            OPEN
                        </Text>
                    </View>
                </View>

                {/* Tier Badge (Top Right) */}
                <View className="absolute top-4 right-4">
                    <View
                        className="px-3 py-1 rounded-full backdrop-blur-md border"
                        style={{
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            borderColor: 'rgba(255,255,255,0.1)'
                        }}
                    >
                        <Text
                            className="text-[10px] font-bold uppercase tracking-wide"
                            style={{ color: tierStyle.text }} // Use tier color for text
                        >
                            {gym.tier || 'Standard'}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Content Section */}
            <View className="p-4 pt-3">
                {/* Header Row: Name & Rating */}
                <View className="flex-row justify-between items-start mb-1">
                    <View className="flex-1 mr-2">
                        <Text className="text-white text-lg font-bold leading-tight" numberOfLines={1}>
                            {gym.name}
                        </Text>
                        <View className="flex-row items-center mt-1">
                            <Icon name="MapPin" size={12} color="#94A3B8" />
                            <Text className="text-slate-400 text-xs ml-1 font-medium">
                                {gym.distance} • {gym.area}
                            </Text>
                        </View>
                    </View>

                    {/* Rating Pill */}
                    <View className="flex-row items-center gap-1 bg-[#2C2C2E] px-2 py-1 rounded-lg">
                        <Icon name="Star" size={12} color="#FBBF24" />
                        <Text className="text-white text-xs font-bold">{gym.rating}</Text>
                    </View>
                </View>

                {/* Thin Divider */}
                <View className="h-[1px] bg-slate-800/50 my-3" />

                {/* Features / Amenities */}
                <View className="flex-row items-center justify-between">
                    <View className="flex-row gap-2">
                        {gym.amenities?.slice(0, 3).map((amenity, i) => (
                            <View key={i} className="px-2.5 py-1 bg-[#2C2C2E] rounded-lg border border-slate-700/30">
                                <Text className="text-slate-300 text-[10px] font-medium">{amenity}</Text>
                            </View>
                        ))}
                        {gym.amenities?.length > 3 && (
                            <Text className="text-slate-500 text-[10px] self-center ml-1">
                                +{gym.amenities.length - 3}
                            </Text>
                        )}
                    </View>

                    {/* Hours */}
                    <View className="flex-row items-center gap-1">
                        <Icon name="Clock" size={12} color="#64748B" />
                        <Text className="text-slate-500 text-[10px] font-medium">5AM-11PM</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default GymCard;
