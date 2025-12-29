import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Platform, Alert } from 'react-native';
import Icon from '../components/ui/Icon';

const ScanQRScreen = ({ setScreen }) => {
    const [scanning, setScanning] = useState(true);
    const [checkInSuccess, setCheckInSuccess] = useState(false);
    const [showMyQR, setShowMyQR] = useState(false);
    const [error, setError] = useState(null);
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        if (Platform.OS !== 'web') return;
        const update = () => setIsOffline(!navigator.onLine);
        update();
        window.addEventListener('online', update);
        window.addEventListener('offline', update);
        return () => {
            window.removeEventListener('online', update);
            window.removeEventListener('offline', update);
        };
    }, []);

    const handleCheckIn = () => {
        setError(null);
        setScanning(false);
        // Simulate async check-in and handle failures gracefully
        setTimeout(() => {
            if (isOffline) {
                setError('You are offline. Reconnect and retry check-in.');
                setScanning(true);
                return;
            }
            setCheckInSuccess(true);
        }, 1200);
    };

    const handleSimulateFailure = () => {
        setError('Camera not available. Please allow camera access or try manual check-in.');
    };

    if (checkInSuccess) {
        return (
            <SafeAreaView className="flex-1 bg-slate-900 items-center justify-center px-5">
                <View className="w-24 h-24 bg-green-500 rounded-full items-center justify-center mb-6">
                    <Icon name="CheckCircle" size={48} color="white" />
                </View>
                <Text className="text-white text-2xl font-bold">Check-In Successful!</Text>
                <Text className="text-slate-400 mt-2 text-center">Welcome to FitZone Koramangala</Text>

                <View className="bg-slate-800 rounded-2xl p-6 mt-8 w-full max-w-sm">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-slate-400">Date</Text>
                        <Text className="text-white font-medium">Dec 26, 2025</Text>
                    </View>
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-slate-400">Time</Text>
                        <Text className="text-white font-medium">6:45 AM</Text>
                    </View>
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-slate-400">Gym</Text>
                        <Text className="text-white font-medium">Koramangala</Text>
                    </View>
                    <View className="flex-row justify-between items-center">
                        <Text className="text-slate-400">Visit #</Text>
                        <Text className="text-teal-400 font-medium">146</Text>
                    </View>
                </View>

                <View className="mt-8 items-center">
                    <Text className="text-slate-500 text-sm">🔥 7 day streak! Keep it up!</Text>
                </View>

                <TouchableOpacity
                    onPress={() => { setCheckInSuccess(false); setScanning(true); setScreen('home'); }}
                    className="mt-8 w-full max-w-sm bg-teal-500 py-4 rounded-2xl items-center"
                >
                    <Text className="text-white font-bold text-lg">Done</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    if (showMyQR) {
        return (
            <SafeAreaView className="flex-1 bg-slate-900">
                <ScrollView className="flex-1 px-5 pt-8" showsVerticalScrollIndicator={false}>
                    <View className="flex-row items-center gap-4 mb-8">
                        <TouchableOpacity
                            onPress={() => setShowMyQR(false)}
                            className="w-10 h-10 bg-slate-800 rounded-full items-center justify-center"
                        >
                            <Icon name="ArrowLeft" size={20} color="white" />
                        </TouchableOpacity>
                        <Text className="text-white text-xl font-bold">My QR Code</Text>
                    </View>

                    <View className="bg-teal-600 rounded-3xl p-6 items-center">
                        <View className="bg-white rounded-2xl p-6 w-full max-w-xs items-center">
                            {/* QR Code Placeholder */}
                            <View className="w-48 h-48 bg-slate-100 rounded-xl items-center justify-center overflow-hidden relative">
                                <View className="flex-row flex-wrap w-full h-full p-2">
                                    {/* Simplified generative pattern for RN */}
                                    {[...Array(64)].map((_, i) => (
                                        <View key={i} className={`w-5 h-5 ${Math.random() > 0.5 ? 'bg-slate-900' : 'bg-transparent'}`} />
                                    ))}
                                </View>

                                    <View className="absolute inset-0 items-center justify-center">
                                        <View className="w-12 h-12 bg-white rounded-lg items-center justify-center">
                                            <Icon name="Dumbbell" size={24} color="#14B8A6" />
                                        </View>
                                    </View>
                            </View>
                            <Text className="text-slate-900 font-bold mt-4 text-lg">Rahul Sharma</Text>
                            <Text className="text-slate-500 text-sm">Pro Member</Text>
                        </View>

                        <Text className="text-teal-100 text-sm mt-4 text-center">
                            Show this QR at the gym entrance for quick check-in
                        </Text>
                    </View>

                    <View className="mt-6 bg-slate-800 rounded-2xl p-4 mb-24">
                        <Text className="text-white font-semibold mb-3">Recent Check-ins</Text>
                        {[
                            { gym: 'FitZone Koramangala', date: 'Today, 6:30 AM' },
                            { gym: 'FitZone Koramangala', date: 'Yesterday, 7:00 AM' },
                            { gym: 'FitZone Indiranagar', date: 'Dec 24, 6:45 AM' },
                        ].map((checkin, i) => (
                            <View key={i} className="flex-row items-center justify-between py-3 border-b border-slate-700">
                                <View className="flex-row items-center gap-3">
                                    <View className="w-10 h-10 bg-teal-500/20 rounded-full items-center justify-center">
                                        <Icon name="CheckCircle" size={18} color="#2DD4BF" />
                                    </View>
                                    <View>
                                        <Text className="text-white text-sm font-medium">{checkin.gym}</Text>
                                        <Text className="text-slate-500 text-xs">{checkin.date}</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-slate-900">
            <ScrollView className="flex-1 px-5 pt-8" showsVerticalScrollIndicator={false}>
                <View className="flex-row items-center justify-between mb-6">
                    <TouchableOpacity
                        onPress={() => setScreen('home')}
                        className="w-10 h-10 bg-slate-800 rounded-full items-center justify-center"
                    >
                        <Icon name="X" size={20} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-bold">Check In</Text>
                    <View className="w-10" />
                </View>

                {Platform.OS === 'web' && (
                    <View className="bg-amber-500/20 border border-amber-500/50 rounded-xl p-3 mb-4">
                        <Text className="text-amber-200 text-sm font-semibold">
                            Camera access is not available in this web test. Use “Manual Check-in” or the mock buttons below.
                        </Text>
                    </View>
                )}

                {error && (
                    <View className="bg-red-500/20 border border-red-500/40 rounded-xl p-3 mb-4">
                        <Text className="text-red-100 text-sm font-semibold">{error}</Text>
                        <TouchableOpacity
                            onPress={() => { setError(null); setScanning(true); }}
                            className="mt-2 bg-red-500/30 rounded-lg px-3 py-2 items-center"
                        >
                            <Text className="text-white text-xs font-bold">Retry</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Tab Switcher */}
                <View className="flex-row bg-slate-800 rounded-xl p-1 mb-6">
                    <TouchableOpacity
                        onPress={() => setShowMyQR(false)}
                        className={`flex-1 py-2 rounded-lg items-center ${!showMyQR ? 'bg-teal-500' : ''
                            }`}
                    >
                        <Text className={`text-sm font-medium ${!showMyQR ? 'text-white' : 'text-slate-400'}`}>Scan QR</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setShowMyQR(true)}
                        className={`flex-1 py-2 rounded-lg items-center ${showMyQR ? 'bg-teal-500' : ''
                            }`}
                    >
                        <Text className={`text-sm font-medium ${showMyQR ? 'text-white' : 'text-slate-400'}`}>My QR</Text>
                    </TouchableOpacity>
                </View>

                {/* Scanner Area */}
                <View className="aspect-square bg-slate-800 rounded-3xl overflow-hidden relative">
                    {/* Simulated Camera View */}
                    <View className="absolute inset-0 bg-slate-700">
                        {/* Scan Frame */}
                        <View className="absolute inset-8 border-2 border-teal-500 rounded-2xl z-10">
                            {/* Note: Complex corner markers removed for simplicity in RN, can use SVGs */}
                            {/* Scanning Line Animation Placeholder - Animations require Reanimated in RN usually */}
                            {scanning && (
                                <View className="w-full h-0.5 bg-teal-400 absolute top-1/2 opacity-80" />
                            )}
                        </View>

                        {/* QR Icon in center */}
                        <View className="absolute inset-0 items-center justify-center">
                            <Icon name="QrCode" size={64} color="#475569" />
                        </View>
                    </View>
                </View>

                <Text className="text-center text-slate-400 mt-6">
                    Point your camera at the QR code at the gym entrance
                </Text>

                {Platform.OS === 'web' && (
                    <TouchableOpacity
                        onPress={handleSimulateFailure}
                        className="mt-3 w-full bg-red-500/20 py-3 rounded-xl items-center border border-red-500/40"
                    >
                        <Text className="text-red-100 font-semibold">Simulate Camera Failure</Text>
                    </TouchableOpacity>
                )}

                {/* Manual Check-in Button (for demo) */}
                <TouchableOpacity
                    onPress={handleCheckIn}
                    className="mt-6 w-full bg-slate-800 py-4 rounded-xl flex-row items-center justify-center gap-2"
                >
                    <Icon name="MapPin" size={18} color="#CBD5E1" />
                    <Text className="text-slate-300 font-medium">Check in at nearby gym</Text>
                </TouchableOpacity>

                {/* Nearby Gyms */}
                <View className="mt-6 mb-24">
                    <Text className="text-white font-semibold mb-3">Nearby Gyms</Text>
                    <View className="gap-2">
                        {[
                            { name: 'FitZone Koramangala', distance: '150m', status: 'Open' },
                            { name: 'FitZone Indiranagar', distance: '2.5km', status: 'Open' },
                        ].map((gym, i) => (
                            <TouchableOpacity
                                key={i}
                                onPress={handleCheckIn}
                                className="w-full bg-slate-800 rounded-xl p-4 flex-row items-center justify-between mb-2"
                            >
                                <View className="flex-row items-center gap-3">
                                    <View className="w-10 h-10 bg-teal-500/20 rounded-full items-center justify-center">
                                        <Icon name="MapPin" size={18} color="#2DD4BF" />
                                    </View>
                                    <View>
                                        <Text className="text-white font-medium">{gym.name}</Text>
                                        <Text className="text-slate-500 text-sm">{gym.distance} • {gym.status}</Text>
                                    </View>
                                </View>
                                <Icon name="ChevronRight" size={20} color="#475569" />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ScanQRScreen;
