import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, SafeAreaView } from 'react-native';
import Icon from '../components/ui/Icon';

const SubscriptionScreen = ({ setScreen }) => {
    const [selectedPlan, setSelectedPlan] = useState('annual');
    const [paymentStatus, setPaymentStatus] = useState('');

    const plans = [
        { id: 'monthly', name: 'Pro Monthly', price: '₹1,499', period: '/month', savings: null, features: ['Unlimited workouts', 'All gym access', '2 classes/month'] },
        { id: 'annual', name: 'Pro Annual', price: '₹12,999', period: '/year', savings: 'Save ₹5,000', popular: true, features: ['Unlimited workouts', 'All gym access', 'Unlimited classes', 'Priority booking'] },
        { id: 'elite', name: 'Elite Annual', price: '₹24,999', period: '/year', savings: 'Best Value', features: ['Everything in Pro', 'Elite gym access', 'Personal trainer', 'Spa & wellness'] },
    ];

    return (
        <View className="flex-1 bg-slate-900">
            <ScrollView className="flex-1 pb-32" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="relative h-72 bg-teal-700">
                    {/* Gradient Placeholder */}
                    <View className="absolute inset-0 bg-black/10" />

                    <SafeAreaView className="absolute top-0 left-0 right-0">
                        <TouchableOpacity
                            onPress={() => setScreen('home')}
                            className="ml-5 mt-4 w-10 h-10 bg-white/10 rounded-full items-center justify-center"
                        >
                            <Icon name="ArrowLeft" size={20} color="white" />
                        </TouchableOpacity>
                    </SafeAreaView>

                    <View className="absolute bottom-0 left-0 right-0 items-center pb-8">
                        <Icon name="Crown" size={48} color="#FBBF24" />
                        <Text className="text-white text-3xl font-bold mt-4">Go Premium</Text>
                        <Text className="text-teal-200 mt-2 text-center px-10">Unlock unlimited access to workouts, classes & more</Text>
                    </View>
                </View>

                {/* Plans */}
                <View className="px-5 mt-8 gap-4">
                    {plans.map(plan => (
                        <TouchableOpacity
                            key={plan.id}
                            onPress={() => setSelectedPlan(plan.id)}
                            className={`w-full p-5 rounded-2xl relative overflow-hidden mb-2 border-2 ${selectedPlan === plan.id
                                    ? 'bg-slate-800 border-teal-500'
                                    : 'bg-slate-800 border-transparent'
                                }`}
                        >
                            {plan.popular && (
                                <View className="absolute top-0 right-0 bg-amber-400 px-3 py-1 rounded-bl-xl z-10">
                                    <Text className="text-amber-900 text-xs font-bold">POPULAR</Text>
                                </View>
                            )}
                            <View className="flex-row justify-between items-start">
                                <View className="flex-1">
                                    <Text className="font-bold text-lg text-white">
                                        {plan.name}
                                    </Text>
                                    <View className="flex-row items-baseline gap-1 mt-1">
                                        <Text className="text-2xl font-bold text-white">
                                            {plan.price}
                                        </Text>
                                        <Text className={selectedPlan === plan.id ? 'text-teal-100' : 'text-slate-400'}>
                                            {plan.period}
                                        </Text>
                                    </View>
                                    {plan.savings && (
                                        <View className={`self-start mt-2 px-2 py-0.5 rounded ${selectedPlan === plan.id ? 'bg-white/20' : 'bg-teal-500/20'
                                            }`}>
                                            <Text className={`text-xs font-medium ${selectedPlan === plan.id ? 'text-white' : 'text-teal-400'}`}>
                                                {plan.savings}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                                <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${selectedPlan === plan.id
                                        ? 'border-white bg-white'
                                        : 'border-slate-600'
                                    }`}>
                                    {selectedPlan === plan.id && <Icon name="CheckCircle" size={16} color="#14B8A6" />}
                                </View>
                            </View>
                            <View className="mt-4 gap-2">
                                {plan.features.map((f, i) => (
                                    <View key={i} className="flex-row items-center gap-2">
                                        <Icon name="CheckCircle" size={16} color={selectedPlan === plan.id ? '#CCFBF1' : '#14B8A6'} />
                                        <Text className={selectedPlan === plan.id ? 'text-teal-50 text-sm' : 'text-slate-400 text-sm'}>
                                            {f}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Promo Code */}
                <View className="px-5 mt-6 mb-32">
                    <View className="flex-row gap-2">
                        <TextInput
                            placeholder="Enter promo code"
                            placeholderTextColor="#64748B"
                            className="flex-1 bg-slate-800 text-white rounded-xl py-3 px-4"
                        />
                        <TouchableOpacity className="px-6 bg-slate-700 rounded-xl justify-center">
                            <Text className="text-slate-300 font-medium">Apply</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* CTA */}
            <View className="absolute bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 p-5 pb-8">
                <TouchableOpacity
                    className="w-full bg-teal-500 py-4 rounded-2xl flex-row items-center justify-center gap-2"
                    onPress={() => {
                        setPaymentStatus('Generating secure payment link...');
                        setTimeout(() => {
                            setPaymentStatus('Payment link sent! Check your email to complete checkout.');
                        }, 900);
                    }}
                >
                    <Text className="text-white font-bold text-lg">Continue to Payment</Text>
                    <Icon name="ChevronRight" size={20} color="white" />
                </TouchableOpacity>
                <Text className="text-center text-slate-500 text-xs mt-3">
                    Cancel anytime. No hidden charges.
                </Text>
                {paymentStatus !== '' && (
                    <Text className="text-center text-teal-300 text-xs mt-2">
                        {paymentStatus}
                    </Text>
                )}
            </View>
        </View>
    );
};

export default SubscriptionScreen;
