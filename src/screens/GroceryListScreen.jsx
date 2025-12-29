import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Platform } from 'react-native';
import Icon from '../components/ui/Icon';
import { getActivePlan } from '../services/firestore.service';
import { getCurrentUserId } from '../services/auth.service';

const GroceryListScreen = ({ setScreen }) => {
    const [groceryList, setGroceryList] = useState([]);
    const [checkedItems, setCheckedItems] = useState([]);

    useEffect(() => {
        loadGroceryList();
    }, []);

    const loadGroceryList = async () => {
        try {
            const userId = getCurrentUserId();
            if (userId) {
                const dietPlan = await getActivePlan(userId, 'diet');
                if (dietPlan?.plan?.groceryList) {
                    setGroceryList(dietPlan.plan.groceryList);
                }
            }
        } catch (error) {
            console.error('Error loading grocery list:', error);
        }
    };

    const toggleItem = (item) => {
        if (checkedItems.includes(item)) {
            setCheckedItems(checkedItems.filter(i => i !== item));
        } else {
            setCheckedItems([...checkedItems, item]);
        }
    };

    const progress = groceryList.length > 0
        ? Math.round((checkedItems.length / groceryList.length) * 100)
        : 0;

    return (
        <SafeAreaView className="flex-1 bg-[#0a0f1a]">
            {/* Header */}
            <View className="px-6 pt-6 pb-4 flex-row items-center gap-4">
                <TouchableOpacity
                    onPress={() => setScreen('plans')}
                    className="w-10 h-10 bg-slate-800 rounded-2xl items-center justify-center border border-slate-700/50"
                >
                    <Icon name="ArrowLeft" size={20} color="white" />
                </TouchableOpacity>
                <View className="flex-1">
                    <Text className="text-white text-2xl font-bold">Grocery List</Text>
                    <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-0.5">
                        {checkedItems.length} of {groceryList.length} items collected
                    </Text>
                </View>
            </View>

            {groceryList.length === 0 ? (
                <View className="flex-1 items-center justify-center px-10">
                    <View className="w-24 h-24 bg-slate-800/50 rounded-[32px] items-center justify-center mb-6 border border-slate-700/30">
                        <Icon name="ShoppingBag" size={48} color="#475569" />
                    </View>
                    <Text className="text-white text-xl font-bold mb-2">No items yet</Text>
                    <Text className="text-slate-400 text-center mb-8 leading-5">
                        Create a personalized diet plan with your AI Coach to generate a grocery list.
                    </Text>
                    <TouchableOpacity
                        onPress={() => setScreen('ai-chat')}
                        className="bg-teal-500 px-8 py-4 rounded-2xl"
                        style={Platform.OS === 'web' ? { boxShadow: '0 4px 15px rgba(20, 184, 166, 0.3)' } : {}}
                    >
                        <Text className="text-white font-bold">Get Diet Plan</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    {/* Progress Card */}
                    <View className="px-6 pt-6 pb-6">
                        <View className="bg-slate-800/40 rounded-3xl p-5 border border-slate-700/30">
                            <View className="flex-row items-center justify-between mb-3">
                                <View className="flex-row items-center gap-2">
                                    <Icon name="Target" size={16} color="#14B8A6" />
                                    <Text className="text-white font-bold">Trip Progress</Text>
                                </View>
                                <Text className="text-teal-400 font-bold">{progress}%</Text>
                            </View>
                            <View className="h-2 bg-slate-900 rounded-full overflow-hidden">
                                <View
                                    className="h-full bg-teal-500 rounded-full"
                                    style={{ width: `${progress}%` }}
                                />
                            </View>
                        </View>
                    </View>

                    <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                        <Text className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-4 ml-1">Items To Buy</Text>

                        {groceryList.map((item, idx) => {
                            const isChecked = checkedItems.includes(item);
                            return (
                                <TouchableOpacity
                                    key={idx}
                                    onPress={() => toggleItem(item)}
                                    activeOpacity={0.8}
                                    className={`rounded-2xl p-4 mb-3 border flex-row items-center gap-4 ${isChecked
                                            ? 'bg-emerald-500/5 border-emerald-500/20'
                                            : 'bg-slate-800/30 border-slate-800'
                                        }`}
                                >
                                    <View className={`w-7 h-7 rounded-xl items-center justify-center border-2 ${isChecked
                                            ? 'bg-emerald-500 border-emerald-500'
                                            : 'border-slate-700 bg-slate-900'
                                        }`}>
                                        {isChecked && <Icon name="Check" size={16} color="white" />}
                                    </View>
                                    <Text className={`flex-1 text-base font-medium ${isChecked ? 'text-slate-500 line-through' : 'text-white/90'
                                        }`}>
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}

                        {/* Quick Actions */}
                        <View className="mt-8 mb-10 p-5 bg-slate-800/20 rounded-3xl border border-slate-800/50">
                            <Text className="text-white font-bold mb-4">Batch Actions</Text>
                            <View className="flex-row gap-3">
                                <TouchableOpacity
                                    onPress={() => setCheckedItems([])}
                                    className="flex-1 bg-slate-800 rounded-2xl py-3.5 items-center border border-slate-700/50"
                                >
                                    <Text className="text-slate-400 font-bold text-sm">Reset</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setCheckedItems(groceryList)}
                                    className="flex-3 bg-teal-500/10 rounded-2xl py-3.5 items-center border border-teal-500/30"
                                >
                                    <Text className="text-teal-400 font-bold text-sm">Select All</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </>
            )}
        </SafeAreaView>
    );
};

export default GroceryListScreen;


