import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ActivityIndicator, Platform, Dimensions, Linking, ScrollView } from 'react-native';
import Icon from '../components/ui/Icon';
import { getGyms } from '../services/gyms.service';

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

// Your Google Maps API Key (for web - Maps JavaScript API)
const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

// Import GoogleMapsView - it's safe because it returns null on non-web platforms
import GoogleMapsView from '../components/maps/GoogleMapsView';

const GymMapScreen = ({ setScreen, setSelectedGym }) => {
    const [gyms, setGyms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [MapViewComponent, setMapViewComponent] = useState(null);
    const [MarkerComponent, setMarkerComponent] = useState(null);

    // Default region centered on Viman Nagar, Pune
    const initialRegion = {
        latitude: 18.5679,
        longitude: 73.9144,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    };

    useEffect(() => {
        loadGyms();
        // Only load map components on native
        if (!isWeb) {
            loadMapComponents();
        }
    }, []);

    const loadMapComponents = async () => {
        try {
            const Maps = await import('react-native-maps');
            setMapViewComponent(() => Maps.default);
            setMarkerComponent(() => Maps.Marker);
        } catch (error) {
            console.log('Maps not available:', error);
        }
    };

    const loadGyms = async () => {
        try {
            setLoading(true);
            const data = await getGyms();

            // If no gyms or gyms without coordinates, use fallback data
            if (!data || data.length === 0 || !data.some(g => g.latitude && g.longitude)) {
                console.log('Using fallback gym data');
                const { gyms: fallbackGyms } = require('../data/gyms');
                setGyms(fallbackGyms);
            } else {
                console.log('Loaded gyms from service:', data.length);
                setGyms(data);
            }
        } catch (error) {
            console.error('Error loading gyms:', error);
            // Fallback to static data on error
            try {
                const { gyms: fallbackGyms } = require('../data/gyms');
                setGyms(fallbackGyms);
            } catch (fallbackError) {
                console.error('Fallback also failed:', fallbackError);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGymSelect = (gym) => {
        setSelectedGym && setSelectedGym(gym);
        setScreen('gym-detail');
    };

    const openInGoogleMaps = (gym) => {
        const url = gym?.latitude && gym?.longitude
            ? `https://www.google.com/maps/search/?api=1&query=${gym.latitude},${gym.longitude}`
            : `https://www.google.com/maps/search/FitZone+Gym+Viman+Nagar+Pune`;

        if (isWeb) {
            window.open(url, '_blank');
        } else {
            Linking.openURL(url);
        }
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-slate-900 items-center justify-center">
                <ActivityIndicator size="large" color="#14B8A6" />
                <Text className="text-slate-400 mt-4">Loading map...</Text>
            </SafeAreaView>
        );
    }

    // Web - Show Google Maps with markers
    if (isWeb) {
        return (
            <SafeAreaView className="flex-1 bg-slate-900">
                {/* Header */}
                <View className="px-5 pt-8 pb-4 flex-row items-center gap-4">
                    <TouchableOpacity
                        onPress={() => setScreen('gyms')}
                        className="w-10 h-10 bg-slate-800 rounded-full items-center justify-center"
                    >
                        <Icon name="ArrowLeft" size={20} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-bold">Gym Locations</Text>
                </View>

                {/* Google Maps View */}
                <View className="mx-5 mb-4" style={{ height: 400 }}>
                    {gyms.length > 0 ? (
                        <GoogleMapsView
                            gyms={gyms}
                            centerLat={18.5679}
                            centerLng={73.9144}
                            apiKey={GOOGLE_MAPS_API_KEY}
                            onMarkerPress={setSelectedMarker}
                        />
                    ) : (
                        <View className="flex-1 items-center justify-center bg-slate-800 rounded-xl">
                            <Text className="text-slate-400">Loading gym locations...</Text>
                        </View>
                    )}
                </View>

                {selectedMarker && (
                    <View className="px-5 mb-4">
                        <View className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
                            <View className="flex-row items-center justify-between mb-3">
                                <View className="flex-1 pr-4">
                                    <Text className="text-white text-lg font-bold">{selectedMarker.name}</Text>
                                    <Text className="text-slate-400 text-sm">{selectedMarker.address || selectedMarker.area}</Text>
                                    <View className="flex-row items-center gap-2 mt-2">
                                        <View className={`px-2 py-0.5 rounded ${selectedMarker.tier === 'Elite' ? 'bg-amber-500/20' : 'bg-teal-500/20'}`}>
                                            <Text className={`text-xs font-semibold ${selectedMarker.tier === 'Elite' ? 'text-amber-300' : 'text-teal-300'}`}>
                                                {selectedMarker.tier}
                                            </Text>
                                        </View>
                                        <View className="flex-row items-center">
                                            <Icon name="Star" size={12} color="#FBBF24" />
                                            <Text className="text-white text-xs ml-1">{selectedMarker.rating}</Text>
                                        </View>
                                        <Text className="text-slate-500 text-xs">• {selectedMarker.distance}</Text>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    onPress={() => openInGoogleMaps(selectedMarker)}
                                    className="px-4 py-2 rounded-xl bg-slate-700 flex-row items-center gap-2"
                                >
                                    <Icon name="ExternalLink" size={14} color="#94A3B8" />
                                    <Text className="text-slate-200 text-sm font-semibold">Directions</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                onPress={() => handleGymSelect(selectedMarker)}
                                className="bg-teal-500 rounded-xl py-3 items-center"
                            >
                                <Text className="text-white font-semibold text-sm">View Details</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* Gym List */}
                <ScrollView className="flex-1 px-5 pb-8" showsVerticalScrollIndicator={false}>
                    <Text className="text-white font-bold text-lg mb-3">All Gyms in Viman Nagar ({gyms.length})</Text>
                    {gyms.map((gym) => (
                        <TouchableOpacity
                            key={gym.id}
                            onPress={() => handleGymSelect(gym)}
                            className="bg-slate-800 rounded-xl p-4 mb-3 flex-row items-center"
                        >
                            <View className="w-12 h-12 bg-teal-500/20 rounded-full items-center justify-center mr-4">
                                <Icon name="MapPin" size={24} color="#2DD4BF" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-white font-bold">{gym.name}</Text>
                                <Text className="text-slate-400 text-sm">{gym.address || gym.area}</Text>
                                <View className="flex-row items-center gap-2 mt-1">
                                    <View className="flex-row items-center">
                                        <Icon name="Star" size={12} color="#FBBF24" />
                                        <Text className="text-white text-xs ml-1">{gym.rating}</Text>
                                    </View>
                                    <Text className="text-slate-500 text-xs">•</Text>
                                    <Text className="text-slate-500 text-xs">{gym.distance}</Text>
                                    <Text className="text-slate-500 text-xs">•</Text>
                                    <View className={`px-2 py-0.5 rounded ${gym.tier === 'Elite' ? 'bg-amber-500/20' : 'bg-teal-500/20'}`}>
                                        <Text className={`text-xs ${gym.tier === 'Elite' ? 'text-amber-400' : 'text-teal-400'}`}>
                                            {gym.tier}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <Icon name="ChevronRight" size={20} color="#64748B" />
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </SafeAreaView>
        );
    }

    // Native Map View
    const MapView = MapViewComponent;
    const Marker = MarkerComponent;

    if (!MapView) {
        return (
            <SafeAreaView className="flex-1 bg-slate-900 items-center justify-center">
                <ActivityIndicator size="large" color="#14B8A6" />
                <Text className="text-slate-400 mt-4">Loading map...</Text>
            </SafeAreaView>
        );
    }

    return (
        <View className="flex-1 bg-slate-900">
            {/* Map */}
            <MapView
                style={{ width, height: height * 0.7 }}
                initialRegion={initialRegion}
                showsUserLocation={true}
                showsMyLocationButton={true}
            >
                {gyms.map((gym) => (
                    gym.latitude && gym.longitude && Marker && (
                        <Marker
                            key={gym.id}
                            coordinate={{
                                latitude: gym.latitude,
                                longitude: gym.longitude,
                            }}
                            title={gym.name}
                            description={`${gym.tier} • ${gym.rating}⭐`}
                            onPress={() => setSelectedMarker(gym)}
                        />
                    )
                ))}
            </MapView>

            {/* Back Button */}
            <SafeAreaView className="absolute top-0 left-0 right-0">
                <View className="flex-row items-center gap-4 px-5 mt-4">
                    <TouchableOpacity
                        onPress={() => setScreen('gyms')}
                        className="w-10 h-10 bg-slate-900/80 rounded-full items-center justify-center"
                    >
                        <Icon name="ArrowLeft" size={20} color="white" />
                    </TouchableOpacity>
                    <View className="flex-1 bg-slate-900/80 rounded-xl px-4 py-2">
                        <Text className="text-white font-bold">Gyms in Viman Nagar</Text>
                        <Text className="text-slate-400 text-xs">{gyms.length} locations</Text>
                    </View>
                </View>
            </SafeAreaView>

            {/* Selected Gym Card */}
            {selectedMarker && (
                <View className="absolute bottom-0 left-0 right-0 p-5 bg-slate-900">
                    <TouchableOpacity
                        onPress={() => handleGymSelect(selectedMarker)}
                        className="bg-slate-800 rounded-2xl p-4 flex-row items-center"
                    >
                        <View className="w-16 h-16 bg-teal-500/20 rounded-xl items-center justify-center mr-4">
                            <Icon name="MapPin" size={28} color="#2DD4BF" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-white font-bold text-lg">{selectedMarker.name}</Text>
                            <Text className="text-slate-400">{selectedMarker.area} • {selectedMarker.distance}</Text>
                            <View className="flex-row items-center gap-2 mt-1">
                                <View className={`px-2 py-0.5 rounded ${selectedMarker.tier === 'Elite' ? 'bg-amber-500/20' : 'bg-teal-500/20'}`}>
                                    <Text className={`text-xs ${selectedMarker.tier === 'Elite' ? 'text-amber-400' : 'text-teal-400'}`}>
                                        {selectedMarker.tier}
                                    </Text>
                                </View>
                                <View className="flex-row items-center">
                                    <Icon name="Star" size={12} color="#FBBF24" />
                                    <Text className="text-white text-sm ml-1">{selectedMarker.rating}</Text>
                                </View>
                            </View>
                        </View>
                        <Icon name="ChevronRight" size={24} color="#64748B" />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default GymMapScreen;
