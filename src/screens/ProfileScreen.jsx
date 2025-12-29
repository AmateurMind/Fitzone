import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import Icon from '../components/ui/Icon';
import { getCurrentUser } from '../services/auth.service';
import DevSeedButton from '../components/DevSeedButton';
import { isSoundEffectsEnabled, setSoundEffectsEnabled as saveSoundSetting, playUIClick } from '../services/voice.service';

const ProfileScreen = ({ setScreen, onSignOut }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [voiceEnabled, setVoiceEnabled] = useState(true);
    const [soundEffectsEnabled, setSoundEffectsEnabled] = useState(() => isSoundEffectsEnabled());

    useEffect(() => {
        loadUser();
    }, []);

    // Handle sound effects toggle
    const handleSoundEffectsToggle = () => {
        const newValue = !soundEffectsEnabled;
        setSoundEffectsEnabled(newValue);
        saveSoundSetting(newValue);
        // Play click sound if turning ON (so user hears feedback)
        if (newValue) {
            playUIClick();
        }
    };

    const loadUser = async () => {
        try {
            setLoading(true);
            const userData = await getCurrentUser();
            setUser(userData);
        } catch (error) {
            console.error('Error loading user:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 bg-slate-900">
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#14B8A6" />
                    <Text className="text-slate-400 mt-4">Loading profile...</Text>
                </View>
            </View>
        );
    }

    const displayName = user?.name || 'User';
    const email = user?.email || 'user@example.com';
    const avatar = user?.avatar || 'U';
    const membership = user?.membership || 'free';
    const stats = user?.stats || { workoutsCompleted: 0, caloriesBurned: 0, streak: 0 };
    const subscription = user?.subscription || { plan: 'free', active: false };
    
    const statItems = [
        { label: 'Workouts', value: String(stats.workoutsCompleted || 0), icon: 'Dumbbell' },
        { label: 'Calories', value: String(Math.round(stats.caloriesBurned / 100) * 100) || '0', icon: 'Flame' },
        { label: 'Streak', value: `${stats.streak || 0} 🔥`, icon: 'TrendingUp' },
        { label: 'Level', value: membership === 'elite' ? 'Elite' : membership === 'pro' ? 'Pro' : 'Free', icon: 'Award' },
    ];

    const menuItems = [
        { icon: 'User', label: 'Personal Information', color: '#2DD4BF' },
        { icon: 'TrendingUp', label: 'My Progress', color: '#A855F7' },
        { icon: 'Award', label: 'Achievements', color: '#FBBF24' },
        { icon: 'Calendar', label: 'Booking History', color: '#3B82F6' },
        { icon: 'CreditCard', label: 'Payment Methods', color: '#22C55E' },
        { icon: 'Gift', label: 'Refer & Earn', color: '#EC4899' },
        { icon: 'Bell', label: 'Notifications', color: '#FB923C' },
        { icon: 'Settings', label: 'Settings', color: '#94A3B8' },
    ];

    const handleMenuPress = (label) => {
        if (label === 'Notifications') {
            Alert.alert('Notifications', 'Notification preferences coming soon.');
            return;
        }
        if (label === 'Settings') {
            Alert.alert('Settings', 'Settings screen coming soon.');
            return;
        }
        Alert.alert(label, 'Feature coming soon.');
    };

    return (
        <View className="flex-1 bg-background">
            <ScrollView className="flex-1 pb-24" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="bg-background-header px-5 pt-12 pb-10 rounded-b-4xl  border-b border-slate-800/50">
                    <View className="flex-row justify-between items-start">
                        <Text className="text-white text-3xl font-extrabold">Profile</Text>
                        <TouchableOpacity
                            accessibilityLabel="Open profile settings"
                            className="w-12 h-12 bg-background-card rounded-2xl items-center justify-center border border-slate-700/50 "
                            onPress={() => handleMenuPress('Settings')}
                        >
                            <Icon name="Settings" size={24} color="#94A3B8" />
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row items-center gap-5 mt-8">
                        <View className="relative">
                            <View className="w-24 h-24 bg-primary rounded-3xl items-center justify-center  border-4 border-slate-900 overflow-hidden">
                                <Text className="text-white text-3xl font-extrabold uppercase">{avatar}</Text>
                            </View>
                            <TouchableOpacity className="absolute -bottom-2 -right-2 bg-secondary p-2 rounded-xl  border-2 border-slate-900">
                                <Icon name="Camera" size={14} color="white" />
                            </TouchableOpacity>
                        </View>
                        <View className="flex-1">
                            <Text className="text-white text-2xl font-extrabold tracking-tight">{displayName}</Text>
                            <Text className="text-slate-400 font-medium">{email}</Text>
                            <View className="flex-row items-center gap-2 mt-3">
                                {membership !== 'free' && (
                                    <View className="px-3 py-1.5 bg-amber-500/20 rounded-xl flex-row items-center gap-2 border border-amber-500/30">
                                        <Icon name="Crown" size={14} color="#FBBF24" />
                                        <Text className="text-amber-400 text-xs font-bold uppercase tracking-wider">
                                            {membership} Member
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>
                </View>

                {/* Stats */}
                <View className="px-5 -mt-8">
                    <View className="bg-background-card rounded-3xl p-5 flex-row justify-between  border border-slate-700/30">
                        {statItems.map(({ label, value, icon }) => (
                            <View key={label} className="items-center flex-1">
                                <View className="bg-slate-900/50 p-2 rounded-xl mb-2">
                                    <Icon name={icon} color="#2DD4BF" size={20} />
                                </View>
                                <Text className="text-white font-extrabold text-lg">{value}</Text>
                                <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">{label}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Subscription Card */}
                {subscription.active && (
                    <View className="px-5 mt-8">
                        <View className="bg-secondary rounded-3xl p-6  relative overflow-hidden">
                            {/* Background Pattern */}
                            <View className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                            
                            <View className="flex-row justify-between items-start relative z-10">
                                <View>
                                    <View className="px-3 py-1 bg-white/20 rounded-full self-start backdrop-blur-md border border-white/30">
                                        <Text className="text-[10px] text-white font-bold uppercase tracking-widest">Active Plan</Text>
                                    </View>
                                    <Text className="text-white font-extrabold text-2xl mt-3 tracking-tight">
                                        {subscription.plan.toUpperCase()}
                                    </Text>
                                    {subscription.validTill && (
                                        <View className="flex-row items-center gap-1.5 mt-2">
                                            <Icon name="Calendar" size={12} color="#FFEDD5" />
                                            <Text className="text-orange-100 text-xs font-medium">
                                                Valid till {new Date(subscription.validTill).toLocaleDateString()}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                                <View className="bg-white/20 p-4 rounded-3xl backdrop-blur-md border border-white/30">
                                    <Icon name="Crown" color="white" size={32} />
                                </View>
                            </View>
                            
                            <View className="flex-row gap-4 mt-6 relative z-10">
                                <TouchableOpacity 
                                    className="flex-1 bg-white/10 py-3.5 rounded-2xl items-center border border-white/20 backdrop-blur-md active:scale-95 transition-all"
                                    onPress={() => setScreen('subscription')}
                                >
                                    <Text className="text-white text-sm font-bold">Manage Plan</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    className="flex-1 bg-white py-3.5 rounded-2xl items-center  active:scale-95 transition-all"
                                    onPress={() => setScreen('subscription')}
                                >
                                    <Text className="text-secondary font-bold text-sm">View Perks</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}

                {/* AI Trainer CTA */}
                <View className="px-5 mt-8">
                    <TouchableOpacity
                        onPress={() => setScreen('ai-chat')}
                        className="bg-teal-500/20 border border-teal-400/30 rounded-3xl p-4 flex-row items-center justify-between"
                    >
                        <View className="flex-row items-center gap-3">
                            <View className="w-12 h-12 rounded-2xl bg-teal-500/30 items-center justify-center">
                                <Icon name="MessageCircle" size={22} color="#14B8A6" />
                            </View>
                            <View>
                                <Text className="text-white font-bold">Chat with AI Trainer</Text>
                                <Text className="text-slate-400 text-xs">Personalized tips & plans</Text>
                            </View>
                        </View>
                        <Icon name="ChevronRight" size={18} color="#94A3B8" />
                    </TouchableOpacity>
                </View>

                {/* Voice & Audio Settings */}
                <View className="px-5 mt-8">
                    <Text className="text-white font-extrabold text-xl mb-4 tracking-tight">Audio Experience</Text>
                    <View className="bg-background-card rounded-3xl p-6 gap-6  border border-slate-700/30">
                        <View className="flex-row justify-between items-center">
                            <View className="flex-row items-center gap-4 flex-1">
                                <View className="bg-primary/10 p-3 rounded-2xl border border-primary/20">
                                    <Icon name="Volume2" color="#14B8A6" size={24} />
                                </View>
                                <View>
                                    <Text className="text-white font-bold text-lg leading-tight">AI Voice Coaching</Text>
                                    <Text className="text-slate-400 text-xs mt-1">Real-time guidance by Eleven Labs</Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={() => setVoiceEnabled(!voiceEnabled)}
                                className={`w-14 h-8 rounded-2xl p-1 ${voiceEnabled ? 'bg-primary' : 'bg-slate-700'}`}
                            >
                                <View className={`w-6 h-6 bg-white rounded-xl ${voiceEnabled ? 'self-end' : 'self-start'}`} />
                            </TouchableOpacity>
                        </View>
                        
                        <View className="flex-row justify-between items-center">
                            <View className="flex-row items-center gap-4 flex-1">
                                <View className="bg-secondary/10 p-3 rounded-2xl border border-secondary/20">
                                    <Icon name="Zap" color="#F97316" size={24} />
                                </View>
                                <View>
                                    <Text className="text-white font-bold text-lg leading-tight">Sound Effects</Text>
                                    <Text className="text-slate-400 text-xs mt-1">UI click sounds</Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={handleSoundEffectsToggle}
                                className={`w-14 h-8 rounded-2xl p-1 ${soundEffectsEnabled ? 'bg-primary' : 'bg-slate-700'}`}
                            >
                                <View className={`w-6 h-6 bg-white rounded-xl ${soundEffectsEnabled ? 'self-end' : 'self-start'}`} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Dev Tools - Remove in production */}
                <View className="px-5 mt-6">
                    <DevSeedButton />
                </View>

                {/* Menu Items */}
                <View className="px-5 mt-6 gap-2 mb-24">
                    {menuItems.map(({ icon, label, color }) => (
                        <TouchableOpacity
                            key={label}
                            onPress={() => handleMenuPress(label)}
                            accessibilityLabel={label}
                            className="bg-slate-800 rounded-xl p-4 flex-row items-center justify-between mb-2"
                        >
                            <View className="flex-row items-center gap-3">
                                <Icon name={icon} color={color} size={22} />
                                <Text className="text-white font-medium">{label}</Text>
                            </View>
                            <Icon name="ChevronRight" color="#475569" size={20} />
                        </TouchableOpacity>
                    ))}

                    {/* Logout */}
                    <TouchableOpacity
                        className="border border-red-500/30 py-3 rounded-xl items-center mt-2"
                        accessibilityLabel="Sign out"
                        onPress={() => {
                            onSignOut && onSignOut();
                            setScreen('login');
                        }}
                    >
                        <Text className="text-red-400 font-medium">Sign Out</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

export default ProfileScreen;
