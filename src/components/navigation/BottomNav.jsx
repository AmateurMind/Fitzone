import React from 'react';
import { View, TouchableOpacity, Text, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '../ui/Icon';
import { playUIClick } from '../../services/voice.service';

const BottomNav = ({ active = 'home', setScreen }) => {
    const insets = useSafeAreaInsets();
    const navItems = [
        { id: 'home', icon: 'Home', label: 'Home' },
        { id: 'workouts', icon: 'Dumbbell', label: 'Workouts' },
        { id: 'scan', icon: 'QrCode', label: 'Scan', special: true },
        { id: 'gyms', icon: 'Map', label: 'Gyms' },
        { id: 'plans', icon: 'Calendar', label: 'Plan' },
    ];

    const handlePress = (id) => {
        playUIClick();
        setScreen(id);
    };

    return (
        <View className="absolute bottom-0 w-full items-center z-50 pointer-events-box-none">
            {/* Main Tab Bar Background */}
            <View
                className="w-full bg-[#1C1C1E] border-t border-white/5 flex-row items-end"
                style={{
                    paddingBottom: Math.max(insets.bottom, 20),
                    paddingTop: 8,
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -10 },
                    shadowOpacity: 0.5,
                    shadowRadius: 20,
                    elevation: 25,
                }}
            >
                {navItems.map(({ id, icon, label, special }) => {
                    const isActive = active === id;

                    // Special "Scan" Button (Floating)
                    if (special) {
                        return (
                            <View
                                key={id}
                                className="flex-1 relative items-center justify-end h-full"
                            >
                                <TouchableOpacity
                                    onPress={() => handlePress(id)}
                                    activeOpacity={0.9}
                                    className="rounded-full"
                                    style={{
                                        position: 'absolute',
                                        top: -45,
                                        shadowColor: '#14B8A6',
                                        shadowOffset: { width: 0, height: 8 },
                                        shadowOpacity: 0.6,
                                        shadowRadius: 16,
                                        elevation: 12,
                                    }}
                                >
                                    <LinearGradient
                                        colors={['#2DD4BF', '#0D9488']}
                                        className="w-16 h-16 rounded-full items-center justify-center"
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                    >
                                        <Icon name="QrCode" size={28} color="#FFFFFF" />
                                    </LinearGradient>
                                </TouchableOpacity>
                                <Text className="text-[10px] font-medium tracking-wide text-zinc-500 mb-0.5 opacity-0">
                                    {label}
                                </Text>
                            </View>
                        );
                    }

                    // Standard Tab Item
                    return (
                        <TouchableOpacity
                            key={id}
                            onPress={() => handlePress(id)}
                            activeOpacity={0.7}
                            className="flex-1 items-center justify-center py-1"
                        >
                            <View className="items-center justify-center h-7 mb-1.5">
                                <Icon
                                    name={icon}
                                    size={24}
                                    color={isActive ? '#2DD4BF' : '#71717A'}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                            </View>
                            <Text
                                className={`text-[10px] font-medium tracking-wide ${isActive ? 'text-[#2DD4BF]' : 'text-zinc-500'
                                    }`}
                            >
                                {label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

export default BottomNav;
