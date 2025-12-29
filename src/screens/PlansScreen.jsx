import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '../components/ui/Icon';
import { getUserPlans } from '../services/firestore.service';
import { getCurrentUserId } from '../services/auth.service';

const PlansScreen = ({ setScreen, setSelectedPlan }) => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        loadPlans();
    }, []);

    const loadPlans = async () => {
        try {
            setLoading(true);
            const userId = getCurrentUserId();
            if (userId) {
                const userPlans = await getUserPlans(userId);
                setPlans(userPlans);
            }
        } catch (error) {
            console.error('Error loading plans:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredPlans = activeTab === 'all'
        ? plans
        : plans.filter(p => p.type === activeTab);

    const workoutPlans = plans.filter(p => p.type === 'workout');
    const dietPlans = plans.filter(p => p.type === 'diet');

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-black items-center justify-center">
                <ActivityIndicator size="large" color="#14B8A6" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-black">
            {/* Header */}
            <View className="px-6 pt-10 pb-6">
                <View className="flex-row items-center justify-between mb-8">
                    <View>
                        <Text className="text-white text-3xl font-bold tracking-tight">Daily Plans</Text>
                        <Text className="text-slate-500 text-sm font-medium mt-1">
                            {plans.length} custom {plans.length === 1 ? 'schedule' : 'schedules'} active
                        </Text>
                    </View>
                    <View className="flex-row gap-3">
                        <TouchableOpacity
                            onPress={loadPlans}
                            className="w-10 h-10 bg-[#1C1C1E] rounded-full items-center justify-center border border-white/5"
                        >
                            <Icon name="RefreshCw" size={18} color="#94A3B8" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setScreen('ai-chat')}
                            className="w-10 h-10 bg-[#14B8A6] rounded-full items-center justify-center shadow-lg shadow-teal-500/30"
                        >
                            <Icon name="Plus" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Filter Tabs */}
                <View className="flex-row gap-2">
                    {[
                        { id: 'all', label: 'All', count: plans.length },
                        { id: 'workout', label: 'Workout', count: workoutPlans.length },
                        { id: 'diet', label: 'Diet', count: dietPlans.length }
                    ].map(tab => (
                        <TouchableOpacity
                            key={tab.id}
                            onPress={() => setActiveTab(tab.id)}
                            className={`px-5 py-2.5 rounded-full flex-row items-center gap-2 ${activeTab === tab.id ? 'bg-[#14B8A6]' : 'bg-[#1C1C1E]'
                                }`}
                        >
                            <Text className={`text-[13px] font-bold ${activeTab === tab.id ? 'text-white' : 'text-slate-400'}`}>
                                {tab.label}
                            </Text>
                            <View className={`px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-white/20' : 'bg-black/20'}`}>
                                <Text className={`text-[10px] font-bold ${activeTab === tab.id ? 'text-white' : 'text-slate-500'}`}>
                                    {tab.count}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <ScrollView
                className="flex-1 px-6 pb-24"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {filteredPlans.length === 0 ? (
                    <View className="items-center justify-center py-20">
                        <View className="w-20 h-20 bg-[#1C1C1E] rounded-[24px] items-center justify-center mb-6 border border-white/5">
                            <Icon name="Clipboard" size={32} color="#334155" />
                        </View>
                        <Text className="text-white text-xl font-bold mb-2">No active plans</Text>
                        <Text className="text-slate-500 text-center text-sm px-10 mb-8">
                            Ask our AI Trainer to build a personalized roadmap for your goals.
                        </Text>
                        <TouchableOpacity
                            onPress={() => setScreen('ai-chat')}
                            className="bg-[#14B8A6] px-8 py-3.5 rounded-full"
                        >
                            <Text className="text-white font-bold">Start AI Chat</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    filteredPlans.map((plan) => (
                        <TouchableOpacity
                            key={plan.id}
                            onPress={() => {
                                setSelectedPlan(plan);
                                setScreen('plan-detail');
                            }}
                            activeOpacity={0.8}
                            className="bg-[#1C1C1E] rounded-[24px] p-5 mb-5 border border-white/5"
                        >
                            <View className="flex-row justify-between items-start mb-4">
                                <View className="flex-row items-center gap-3 flex-1 mr-3">
                                    <View className={`w-12 h-12 rounded-2xl items-center justify-center flex-shrink-0 ${plan.type === 'workout' ? 'bg-teal-500/10' : 'bg-orange-500/10'
                                        }`}>
                                        <Icon
                                            name={plan.type === 'workout' ? 'Dumbbell' : 'Heart'}
                                            size={22}
                                            color={plan.type === 'workout' ? '#14B8A6' : '#F97316'}
                                        />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-white font-bold text-lg" numberOfLines={1} ellipsizeMode="tail">
                                            {plan.planName || 'Custom Plan'}
                                        </Text>
                                        <Text className="text-slate-500 text-xs font-medium uppercase tracking-widest mt-0.5">
                                            {plan.type === 'workout' ? 'Training' : 'Nutrition'} Schedule
                                        </Text>
                                    </View>
                                </View>
                                {plan.status === 'active' && (
                                    <View className="bg-emerald-500/90 px-3 py-1 rounded-full flex-shrink-0">
                                        <Text className="text-white text-[10px] font-black uppercase">Active</Text>
                                    </View>
                                )}
                            </View>

                            {plan.plan?.summary && (
                                <Text className="text-slate-400 text-sm leading-5 mb-4" numberOfLines={2}>
                                    {plan.plan.summary}
                                </Text>
                            )}

                            <View className="pt-4 border-t border-white/5 flex-row items-center justify-between">
                                <View className="flex-row items-center gap-4">
                                    {plan.type === 'workout' ? (
                                        <View className="flex-row gap-1.5">
                                            {['Mon', 'Wed', 'Fri'].map((d, i) => (
                                                <View key={i} className="bg-black/30 px-2 py-1 rounded-md">
                                                    <Text className="text-slate-400 text-[10px] font-bold uppercase">{d}</Text>
                                                </View>
                                            ))}
                                            <Text className="text-slate-600 text-[10px] font-bold px-1 py-1">···</Text>
                                        </View>
                                    ) : (
                                        <View className="flex-row items-center gap-3">
                                            <View className="flex-row items-center gap-1.5">
                                                <View className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                                <Text className="text-slate-400 text-xs font-bold">{plan.plan?.dailyCalories || '---'} kcal</Text>
                                            </View>
                                            <View className="flex-row items-center gap-1.5">
                                                <View className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                                                <Text className="text-slate-400 text-xs font-bold">{plan.plan?.macros?.protein || '---'} Protein</Text>
                                            </View>
                                        </View>
                                    )}
                                </View>
                                <Icon name="ChevronRight" size={18} color="#475569" />
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default PlansScreen;

