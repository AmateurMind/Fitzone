/**
 * Dev Seed Button Component
 * Temporary component for seeding the database during development
 * Remove or hide this in production
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { seedDatabase } from '../utils/seedDatabase';

const DevSeedButton = () => {
    const [loading, setLoading] = useState(false);
    const [seeded, setSeeded] = useState(false);

    const handleSeed = async () => {
        try {
            setLoading(true);
            const result = await seedDatabase();
            setSeeded(true);
            Alert.alert(
                '✅ Database Seeded!',
                `Successfully seeded:\n• ${result.workouts} workouts\n• ${result.gyms} gyms\n• ${result.classes} classes\n• ${result.bookings} booking\n• ${result.checkins} checkins`,
                [{ text: 'OK' }]
            );
        } catch (error) {
            console.error('Seed error:', error);
            Alert.alert('❌ Error', error.message || 'Failed to seed database');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="p-4 bg-slate-800 rounded-xl mb-4">
            <Text className="text-white font-bold mb-2">🔧 Dev Tools</Text>
            <Text className="text-slate-400 text-sm mb-3">
                Seed the database with sample data
            </Text>
            <TouchableOpacity
                onPress={handleSeed}
                disabled={loading || seeded}
                className={`py-3 px-4 rounded-lg items-center ${
                    loading || seeded ? 'bg-slate-700' : 'bg-teal-500'
                }`}
            >
                {loading ? (
                    <View className="flex-row items-center gap-2">
                        <ActivityIndicator size="small" color="white" />
                        <Text className="text-white font-semibold">Seeding...</Text>
                    </View>
                ) : seeded ? (
                    <Text className="text-white font-semibold">✅ Database Seeded</Text>
                ) : (
                    <Text className="text-white font-semibold">Seed Database</Text>
                )}
            </TouchableOpacity>
            {seeded && (
                <Text className="text-teal-400 text-xs mt-2 text-center">
                    Restart the app to see the data
                </Text>
            )}
        </View>
    );
};

export default DevSeedButton;

