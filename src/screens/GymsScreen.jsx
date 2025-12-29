import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Platform } from 'react-native';
import Icon from '../components/ui/Icon';
import GymCard from '../components/cards/GymCard';
import { getGyms } from '../services/gyms.service';

const GymsScreen = ({ setScreen, setSelectedGym }) => {
    const [gyms, setGyms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    useEffect(() => {
        loadGyms();
    }, []);

    const loadGyms = async () => {
        try {
            setLoading(true);
            const data = await getGyms();
            setGyms(data);
        } catch (error) {
            console.error('Error loading gyms:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredGyms = gyms.filter(gym => {
        const matchesSearch = !searchQuery ||
            gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            gym.area.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter = activeFilter === 'All' ||
            gym.tier === activeFilter ||
            (activeFilter === 'Pool' && gym.amenities?.includes('Pool')) ||
            (activeFilter === 'Parking' && gym.amenities?.includes('Parking'));

        return matchesSearch && matchesFilter;
    });

    const handleGymSelect = (gym) => {
        setSelectedGym && setSelectedGym(gym);
        setScreen('gym-detail');
    };

    return (
        <SafeAreaView className="flex-1 bg-black">
            <View className="flex-1 px-5 pt-2">
                {/* Header */}
                <View className="flex-row justify-between items-start mb-6 mt-4">
                    <View>
                        <Text className="text-white text-3xl font-bold tracking-tight">Find Gyms</Text>
                        <View className="flex-row items-center gap-1.5 mt-1">
                            <Icon name="MapPin" size={14} color="#94A3B8" />
                            <Text className="text-slate-400 text-sm font-medium">Viman Nagar, Pune</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={() => setScreen('gym-map')}
                        className="bg-[#2C2C2E] px-4 py-2 rounded-full flex-row items-center gap-2 border border-slate-800"
                    >
                        <Icon name="Map" size={16} color="#14B8A6" />
                        <Text className="text-white font-semibold text-sm">Map</Text>
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View className="mb-6">
                    <View className="flex-row items-center bg-[#2C2C2E] h-12 rounded-full px-4">
                        <Icon name="Search" size={20} color="#94A3B8" />
                        <TextInput
                            placeholder="Search gyms, areas..."
                            placeholderTextColor="#94A3B8"
                            className="flex-1 ml-3 text-white text-base"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </View>

                {/* Filters */}
                <View className="mb-6 h-10">
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ gap: 8 }}
                    >
                        {['All', 'Elite', 'Pro', 'Pool', 'Parking'].map(filter => {
                            const isActive = activeFilter === filter;
                            return (
                                <TouchableOpacity
                                    key={filter}
                                    onPress={() => setActiveFilter(filter)}
                                    className={`px-5 h-9 justify-center rounded-full ${isActive ? 'bg-[#14B8A6]' : 'bg-[#2C2C2E]'}`}
                                >
                                    <Text className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-slate-400'}`}>
                                        {filter}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* Results Count */}
                <Text className="text-slate-500 text-sm font-medium mb-4">
                    {filteredGyms.length} gym{filteredGyms.length !== 1 ? 's' : ''} found
                </Text>

                {/* Gym List */}
                <ScrollView
                    className="flex-1 -mx-5 px-5"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                >
                    {loading ? (
                        <View className="py-20 items-center">
                            <ActivityIndicator size="large" color="#14B8A6" />
                            <Text className="text-slate-500 mt-4 font-medium">Finding best gyms...</Text>
                        </View>
                    ) : filteredGyms.length === 0 ? (
                        <View className="py-20 items-center opacity-75">
                            <View className="w-16 h-16 bg-[#2C2C2E] rounded-full items-center justify-center mb-4">
                                <Icon name="Search" size={32} color="#64748B" />
                            </View>
                            <Text className="text-white font-bold text-lg">No gyms found</Text>
                            <Text className="text-slate-500 text-center mt-2 max-w-[200px]">
                                Try adjusting your filters or search for another area.
                            </Text>
                        </View>
                    ) : (
                        <View className="gap-5">
                            {filteredGyms.map(gym => (
                                <GymCard
                                    key={gym.id}
                                    gym={gym}
                                    onClick={() => handleGymSelect(gym)}
                                />
                            ))}
                        </View>
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default GymsScreen;
