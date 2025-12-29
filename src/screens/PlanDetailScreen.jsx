import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '../components/ui/Icon';

const PlanDetailScreen = ({ plan, setScreen }) => {
    const [completedDays, setCompletedDays] = useState([]);
    const [completedMeals, setCompletedMeals] = useState([]);

    if (!plan) {
        return (
            <SafeAreaView className="flex-1 bg-black items-center justify-center">
                <Text className="text-slate-500">Plan details unavailable</Text>
            </SafeAreaView>
        );
    }

    const isWorkout = plan.type === 'workout';
    const isDiet = plan.type === 'diet';
    const planData = plan.plan || {};

    const toggleDayComplete = (day) => {
        if (completedDays.includes(day)) {
            setCompletedDays(completedDays.filter(d => d !== day));
        } else {
            setCompletedDays([...completedDays, day]);
        }
    };

    const toggleMealComplete = (meal) => {
        if (completedMeals.includes(meal)) {
            setCompletedMeals(completedMeals.filter(m => m !== meal));
        } else {
            setCompletedMeals([...completedMeals, meal]);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-black">
            {/* Header */}
            <View className="px-6 pt-4 pb-4 flex-row items-center border-b border-white/5 bg-black/80">
                <TouchableOpacity
                    onPress={() => setScreen('plans')}
                    className="w-10 h-10 items-center justify-center"
                >
                    <Icon name="ArrowLeft" size={24} color="white" />
                </TouchableOpacity>
                <View className="flex-1 ml-2">
                    <Text className="text-white text-lg font-bold" numberOfLines={1}>
                        {plan.planName || (isWorkout ? 'Training Plan' : 'Nutrition Plan')}
                    </Text>
                    <Text className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-0.5">
                        {isWorkout ? 'Workout Flow' : 'Daily Nutrition'}
                    </Text>
                </View>
                {isDiet && (
                    <TouchableOpacity
                        onPress={() => setScreen('grocery-list')}
                        className="w-10 h-10 bg-white/5 rounded-full items-center justify-center border border-white/5"
                    >
                        <Icon name="Bag" size={18} color="#14B8A6" />
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView
                className="flex-1 px-6 pt-6"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 150 }}
            >
                {/* Intro Card */}
                {planData.summary && (
                    <View className="bg-[#1C1C1E] rounded-[24px] p-6 mb-8 border border-white/10">
                        <Text className="text-slate-300 text-sm leading-6 tracking-wide">
                            {planData.summary}
                        </Text>
                    </View>
                )}

                {/* Training Flow */}
                {isWorkout && planData.weeklySchedule && (
                    <View className="mb-8">
                        <View className="flex-row items-center justify-between mb-5 px-1">
                            <Text className="text-white text-xl font-bold tracking-tight">Weekly Roadmap</Text>
                            <View className="bg-teal-500/10 px-3 py-1 rounded-full">
                                <Text className="text-teal-400 text-[10px] font-black uppercase">Schedule</Text>
                            </View>
                        </View>

                        {planData.weeklySchedule.map((day, idx) => {
                            const isCompleted = completedDays.includes(day.day);
                            return (
                                <TouchableOpacity
                                    key={idx}
                                    onPress={() => toggleDayComplete(day.day)}
                                    activeOpacity={0.8}
                                    className={`rounded-[24px] p-5 mb-4 border ${isCompleted ? 'bg-teal-500/10 border-teal-500/40' : 'bg-[#1C1C1E] border-white/5'
                                        }`}
                                >
                                    <View className="flex-row items-center justify-between">
                                        <View className="flex-1 pr-4">
                                            <View className="flex-row items-center gap-3 mb-2">
                                                <Text className="text-white font-bold text-lg">{day.day}</Text>
                                                {day.type && day.type !== 'Rest' && (
                                                    <View className="bg-black/40 px-2 py-0.5 rounded-md border border-white/5">
                                                        <Text className="text-slate-400 text-[10px] font-black uppercase">{day.type}</Text>
                                                    </View>
                                                )}
                                            </View>
                                            <Text className="text-white font-medium mb-2">{day.workout}</Text>
                                            <View className="flex-row items-center gap-3">
                                                <View className="flex-row items-center gap-1.5 grayscale opacity-60">
                                                    <Icon name="Clock" size={14} color="white" />
                                                    <Text className="text-white text-xs">{day.duration} min</Text>
                                                </View>
                                                {day.focus && (
                                                    <Text className="text-slate-500 text-xs font-semibold uppercase">• {day.focus}</Text>
                                                )}
                                            </View>
                                        </View>
                                        <View className={`w-10 h-10 rounded-full items-center justify-center border-2 ${isCompleted ? 'bg-teal-500 border-teal-500 shadow-lg shadow-teal-500/50' : 'border-white/10'
                                            }`}>
                                            {isCompleted && <Icon name="Check" size={20} color="white" />}
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}

                {/* Nutrition Flow */}
                {isDiet && (
                    <>
                        {/* Daily Overview */}
                        <View className="bg-[#1C1C1E] rounded-[32px] p-6 mb-8 border border-white/5">
                            <Text className="text-white text-xl font-bold mb-6">Daily Fuel</Text>
                            <View className="flex-row justify-between">
                                <View className="items-center">
                                    <Text className="text-slate-500 text-[10px] font-black uppercase mb-1">Calories</Text>
                                    <Text className="text-white text-3xl font-black">{planData.dailyCalories}</Text>
                                    <Text className="text-slate-600 text-[10px] font-bold">KCAL</Text>
                                </View>
                                {planData.macros && (
                                    <>
                                        <View className="items-center">
                                            <Text className="text-teal-500 text-[10px] font-black uppercase mb-1">Protein</Text>
                                            <Text className="text-white text-3xl font-black">{planData.macros.protein?.split('g')[0]}</Text>
                                            <Text className="text-slate-600 text-[10px] font-bold">GRAMS</Text>
                                        </View>
                                        <View className="items-center">
                                            <Text className="text-orange-500 text-[10px] font-black uppercase mb-1">Carbs</Text>
                                            <Text className="text-white text-3xl font-black">{planData.macros.carbs?.split('g')[0]}</Text>
                                            <Text className="text-slate-600 text-[10px] font-bold">GRAMS</Text>
                                        </View>
                                    </>
                                )}
                            </View>
                        </View>

                        {/* Meals */}
                        <View className="mb-8">
                            <Text className="text-white text-xl font-bold mb-5 px-1 tracking-tight">Daily Meals</Text>
                            {planData.meals && planData.meals.map((meal, idx) => {
                                const isCompleted = completedMeals.includes(meal.meal);
                                return (
                                    <TouchableOpacity
                                        key={idx}
                                        onPress={() => toggleMealComplete(meal.meal)}
                                        activeOpacity={0.8}
                                        className={`rounded-[24px] p-5 mb-4 border ${isCompleted ? 'bg-orange-500/10 border-orange-500/40' : 'bg-[#1C1C1E] border-white/5'
                                            }`}
                                    >
                                        <View className="flex-row items-start justify-between">
                                            <View className="flex-1 pr-4">
                                                <View className="flex-row items-center gap-3 mb-3">
                                                    <Text className="text-white font-bold text-lg">{meal.meal}</Text>
                                                    <View className="bg-black/40 px-2 py-0.5 rounded-md border border-white/5">
                                                        <Text className="text-slate-400 text-[10px] font-black">{meal.time}</Text>
                                                    </View>
                                                </View>
                                                <View className="mb-3 space-y-1">
                                                    {meal.foods?.map((food, fIdx) => (
                                                        <Text key={fIdx} className="text-slate-300 text-sm font-medium leading-5">
                                                            • {food}
                                                        </Text>
                                                    ))}
                                                </View>
                                                <View className="flex-row items-center gap-4">
                                                    <View className="flex-row items-center gap-1.5 grayscale opacity-60">
                                                        <Icon name="Zap" size={14} color="white" />
                                                        <Text className="text-white text-xs">{meal.calories} kcal</Text>
                                                    </View>
                                                    {meal.prep && (
                                                        <Text className="text-slate-500 text-xs font-semibold uppercase">⏱️ {meal.prep}</Text>
                                                    )}
                                                </View>
                                            </View>
                                            <View className={`w-10 h-10 rounded-full items-center justify-center border-2 ${isCompleted ? 'bg-orange-500 border-orange-500 shadow-lg shadow-orange-500/50' : 'border-white/10'
                                                }`}>
                                                {isCompleted && <Icon name="Check" size={20} color="white" />}
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </>
                )}

                {/* Extra Sections (Tips/Results) */}
                <View className="flex-row flex-wrap gap-4">
                    {planData.tips && (
                        <View className="w-full bg-blue-500/10 rounded-[24px] p-6 border border-blue-500/20">
                            <Text className="text-blue-400 text-lg font-bold mb-3">Pro Coaching Tips</Text>
                            {planData.tips.slice(0, 3).map((tip, idx) => (
                                <Text key={idx} className="text-slate-300 text-sm mb-2 leading-5">• {tip}</Text>
                            ))}
                        </View>
                    )}

                    {planData.expectedResults && (
                        <View className="w-full bg-emerald-500/10 rounded-[24px] p-6 border border-emerald-500/20">
                            <Text className="text-emerald-400 text-lg font-bold mb-2">Target Outcome</Text>
                            <Text className="text-slate-300 text-sm leading-5">{planData.expectedResults}</Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Bottom CTA */}
            {isWorkout && (
                <View className="absolute bottom-0 left-0 right-0 px-6 pb-8 pt-4 bg-black/80 border-t border-white/5">
                    <TouchableOpacity
                        onPress={() => setScreen('workouts')}
                        className="bg-[#14B8A6] h-14 rounded-2xl items-center justify-center shadow-xl shadow-teal-500/30"
                    >
                        <Text className="text-white font-black text-lg">START TODAY'S TRAINING</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
};

export default PlanDetailScreen;

