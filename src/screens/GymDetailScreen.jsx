import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Image, Platform } from 'react-native';
import Icon from '../components/ui/Icon';

// Generate image URL based on gym tier and name for better variety (Same as GymCard)
const getGymImageUrl = (gym) => {
    // If gym object has a specific image property, use it (supports local require or uri)
    if (gym?.image) return gym.image;

    // Default fallback if gym is undefined
    if (!gym) return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800';

    // Curated high-quality gym images from Unsplash
    const gymImages = [
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800', // Heavy weights/Dark
        'https://images.unsplash.com/photo-1540497073359-09d0b8b0e5b1?w=800', // Modern/Teal
        'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800', // Bright/Spacious
        'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800', // Studio/Yoga
        'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800', // Cardio/Treadmills
        'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800', // Crossfit/Action
        'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800'  // Lifestyle/People
    ];

    // Use a consistent hash of the ID or name to select the image
    // This ensures the same gym always gets the same random image
    const hashString = gym.id || gym.name || 'default';
    let hash = 0;
    for (let i = 0; i < hashString.length; i++) {
        hash = ((hash << 5) - hash) + hashString.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
    }

    const index = Math.abs(hash) % gymImages.length;
    return gymImages[index];
};

const GymDetailScreen = ({ gym, setScreen }) => {
    const [selectedDate, setSelectedDate] = useState(0);
    const [bookedClasses, setBookedClasses] = useState({});
    const [imageError, setImageError] = useState(false);
    const dates = ['Today', 'Tomorrow', 'Wed 4', 'Thu 5', 'Fri 6'];

    if (!gym) return null;

    const imageUrl = getGymImageUrl(gym);

    const classes = [
        { time: '6:00 AM', name: 'Morning Yoga', trainer: 'Priya S.', spots: '8/20', type: 'Yoga' },
        { time: '7:30 AM', name: 'HIIT Blast', trainer: 'Amit V.', spots: '15/15', type: 'HIIT', full: true },
        { time: '9:00 AM', name: 'Zumba Dance', trainer: 'Kavya M.', spots: '12/25', type: 'Dance' },
        { time: '5:00 PM', name: 'Strength Training', trainer: 'Rahul K.', spots: '5/12', type: 'Strength' },
        { time: '6:30 PM', name: 'Power Yoga', trainer: 'Priya S.', spots: '18/20', type: 'Yoga' },
    ];

    const handleBooking = (cls, index) => {
        if (cls.full) return;
        const classId = `${cls.name}-${index}-${cls.time}`;
        setBookedClasses(prev => ({ ...prev, [classId]: true }));
    };

    return (
        <View className="flex-1 bg-slate-900">
            <ScrollView className="flex-1 pb-24" showsVerticalScrollIndicator={false}>
                {/* Hero */}
                <View className="h-64 relative overflow-hidden bg-teal-600">
                    {!imageError ? (
                        <Image
                            source={{ uri: imageUrl }}
                            className="w-full h-full"
                            resizeMode="cover"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <View className="w-full h-full items-center justify-center">
                            <Icon name="Dumbbell" size={64} color="rgba(255,255,255,0.3)" />
                        </View>
                    )}
                    {/* Gradient Overlay */}
                    <View
                        className="absolute inset-0"
                        style={Platform.OS === 'web' ? {
                            background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.8) 100%)',
                        } : {
                            backgroundColor: 'rgba(0,0,0,0.5)',
                        }}
                    />

                    <SafeAreaView className="absolute top-0 left-0 right-0 z-10">
                        <View className="flex-row items-center justify-between px-5 mt-4 gap-3">
                            <TouchableOpacity
                                onPress={() => setScreen('gyms')}
                                className="w-10 h-10 bg-black/30 rounded-full items-center justify-center"
                            >
                                <Icon name="ArrowLeft" size={20} color="white" />
                            </TouchableOpacity>
                            <View className="flex-row items-center gap-3">
                                <TouchableOpacity
                                    onPress={() => setScreen('gym-map')}
                                    className="w-10 h-10 bg-black/30 rounded-full items-center justify-center"
                                >
                                    <Icon name="Map" size={20} color="white" />
                                </TouchableOpacity>
                                <TouchableOpacity className="w-10 h-10 bg-black/30 rounded-full items-center justify-center">
                                    <Icon name="Heart" size={20} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </SafeAreaView>

                    <View className="absolute bottom-4 left-5 right-5">
                        <View className="flex-row items-center gap-2 mb-2">
                            <View className={`px-2 py-1 rounded-full ${gym.tier === 'Elite' ? 'bg-amber-400' : 'bg-teal-500'}`}>
                                <Text className={`${gym.tier === 'Elite' ? 'text-amber-900' : 'text-white'} text-xs font-bold`}>{gym.tier || 'Gym'}</Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                                <Icon name="Star" size={14} color="#FBBF24" />
                                <Text className="text-white text-sm font-medium">{gym.rating || '4.5'}</Text>
                                <Text className="text-slate-300 text-sm">(245 reviews)</Text>
                            </View>
                        </View>
                        <Text className="text-white text-2xl font-bold">{gym.name}</Text>
                        <View className="flex-row items-center gap-1 mt-1">
                            <Icon name="MapPin" size={14} color="#CBD5E1" />
                            <Text className="text-slate-300 text-sm">{gym.address || gym.area || 'Address not available'}</Text>
                        </View>
                    </View>
                </View>

                {/* Quick Info */}
                <View className="px-5 -mt-8 z-20">
                    <View
                        className="bg-slate-800 rounded-3xl p-5 flex-row justify-between"
                        style={Platform.OS === 'web' ? {
                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                        } : {
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 10 },
                            shadowOpacity: 0.3,
                            shadowRadius: 20,
                            elevation: 8,
                        }}
                    >
                        {/* Hours */}
                        <View className="items-center flex-1">
                            <View
                                className="w-12 h-12 rounded-2xl items-center justify-center mb-2"
                                style={Platform.OS === 'web' ? {
                                    background: 'linear-gradient(135deg, rgba(45, 212, 191, 0.2), rgba(45, 212, 191, 0.1))',
                                } : {
                                    backgroundColor: 'rgba(45, 212, 191, 0.2)',
                                }}
                            >
                                <Icon name="Clock" size={22} color="#2DD4BF" />
                            </View>
                            <Text className="text-white text-sm font-bold mt-1">5AM - 11PM</Text>
                            <View className="flex-row items-center gap-1 mt-0.5">
                                <View className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                <Text className="text-green-400 text-[10px] font-semibold uppercase">Open Now</Text>
                            </View>
                        </View>

                        {/* Divider */}
                        <View className="w-[1px] bg-slate-700 mx-2" />

                        {/* Distance */}
                        <View className="items-center flex-1">
                            <View
                                className="w-12 h-12 rounded-2xl items-center justify-center mb-2"
                                style={Platform.OS === 'web' ? {
                                    background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.2), rgba(251, 146, 60, 0.1))',
                                } : {
                                    backgroundColor: 'rgba(251, 146, 60, 0.2)',
                                }}
                            >
                                <Icon name="MapPin" size={22} color="#FB923C" />
                            </View>
                            <Text className="text-white text-sm font-bold mt-1">{gym.distance || '1.2 km'}</Text>
                            <Text className="text-slate-400 text-[10px] font-medium uppercase mt-0.5">Distance</Text>
                        </View>

                        {/* Divider */}
                        <View className="w-[1px] bg-slate-700 mx-2" />

                        {/* Classes */}
                        <View className="items-center flex-1">
                            <View
                                className="w-12 h-12 rounded-2xl items-center justify-center mb-2"
                                style={Platform.OS === 'web' ? {
                                    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(168, 85, 247, 0.1))',
                                } : {
                                    backgroundColor: 'rgba(168, 85, 247, 0.2)',
                                }}
                            >
                                <Icon name="Users" size={22} color="#A855F7" />
                            </View>
                            <Text className="text-white text-sm font-bold mt-1">8 Today</Text>
                            <Text className="text-slate-400 text-[10px] font-medium uppercase mt-0.5">Classes</Text>
                        </View>
                    </View>
                </View>

                {/* Amenities */}
                <View className="px-5 mt-6">
                    <Text className="text-white font-bold text-lg mb-3">Amenities</Text>
                    <View className="flex-row flex-wrap gap-2">
                        {(gym.amenities || ['Parking', 'Showers', 'Lockers', 'AC', 'Cafe', 'WiFi']).map(a => (
                            <View key={a} className="px-3 py-1.5 bg-slate-800 rounded-lg flex-row items-center gap-1 mb-2">
                                <Icon name="CheckCircle" size={14} color="#2DD4BF" />
                                <Text className="text-slate-300 text-sm">{a}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Class Schedule */}
                <View className="mt-6 pb-24">
                    <View className="px-5 mb-3">
                        <Text className="text-white font-bold text-lg">Class Schedule</Text>
                    </View>

                    {/* Date Selector */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-5 pb-3" contentContainerStyle={{ paddingRight: 20 }}>
                        {dates.map((date, i) => (
                            <TouchableOpacity
                                key={date}
                                onPress={() => setSelectedDate(i)}
                                className={`px-4 py-2 rounded-xl mr-2 ${selectedDate === i
                                    ? 'bg-teal-500'
                                    : 'bg-slate-800'
                                    }`}
                            >
                                <Text className={`text-sm font-medium ${selectedDate === i ? 'text-white' : 'text-slate-400'}`}>
                                    {date}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Classes */}
                    <View className="px-5 gap-3 mt-2">
                        {classes.map((cls, i) => {
                            const classId = `${cls.name}-${i}-${cls.time}`;
                            const isBooked = !!bookedClasses[classId];
                            return (
                                <View key={classId} className="bg-slate-800 rounded-xl p-4 flex-row items-center justify-between mb-2">
                                    <View className="flex-row items-center gap-4 flex-1">
                                        <View className="items-center w-16">
                                            <Text className="text-teal-400 font-bold">{cls.time.split(' ')[0]}</Text>
                                            <Text className="text-slate-500 text-xs">{cls.time.split(' ')[1]}</Text>
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-white font-medium">{cls.name}</Text>
                                            <Text className="text-slate-500 text-sm">{cls.trainer} • {cls.type}</Text>
                                        </View>
                                    </View>
                                    <View className="items-end max-w-[40%]">
                                        <Text className={`text-sm ${cls.full ? 'text-red-400' : 'text-slate-400'}`}>
                                            {cls.spots}
                                        </Text>
                                        <TouchableOpacity
                                            disabled={cls.full || isBooked}
                                            onPress={() => handleBooking(cls, i)}
                                            className={`mt-1 px-4 py-1.5 rounded-lg ${cls.full
                                                ? 'bg-slate-700'
                                                : isBooked
                                                    ? 'bg-emerald-600'
                                                    : 'bg-teal-500'
                                                }`}
                                        >
                                            <Text className={`text-sm font-medium ${cls.full ? 'text-slate-500' : 'text-white'}`}>
                                                {cls.full ? 'Full' : isBooked ? 'Booked' : 'Book'}
                                            </Text>
                                        </TouchableOpacity>
                                        {!cls.full && isBooked && (
                                            <Text className="text-emerald-300 text-xs font-medium mt-2 text-right">
                                                Saved! Show QR in Check In tab.
                                            </Text>
                                        )}
                                    </View>
                                </View>
                            )
                        })}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default GymDetailScreen;
