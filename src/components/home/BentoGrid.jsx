import React from 'react';
import { View, Text, Platform, TouchableOpacity } from 'react-native';
import Icon from '../ui/Icon';

const ChartBar = ({ height, color, active }) => (
    <View
        className={`w-1 rounded-full mx-[2px] ${active ? '' : 'opacity-30'}`}
        style={{
            height: `${height}%`,
            backgroundColor: color
        }}
    />
);

const MiniChart = ({ color }) => {
    // Mock data to match the visual rhythm of the reference
    const bars = [20, 30, 15, 40, 60, 30, 50, 80, 40, 20, 60, 45, 90, 70, 40];

    return (
        <View className="h-12 flex-row items-end justify-between mt-auto opacity-80">
            {bars.map((h, i) => (
                <ChartBar key={i} height={h} color={color} active={i > 10} />
            ))}
        </View>
    );
};

const GridCard = ({ title, value, unit, color, icon, onPress }) => (
    <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        className="flex-1 bg-[#1C1C1E] rounded-[24px] p-4 justify-between h-40"
        style={Platform.OS === 'web' ? { boxShadow: '0 4px 12px rgba(0,0,0,0.2)' } : {}}
    >
        <View>
            <View className="flex-row justify-between items-start mb-1">
                <Text className="text-white text-[15px] font-bold">{title}</Text>
                <View className="w-5 h-5 bg-[#3A3A3C] rounded-full items-center justify-center">
                    <Icon name="ChevronRight" size={12} color="#8E8E93" />
                </View>
            </View>
            <Text className="text-[#8E8E93] text-xs font-semibold mb-1">Today</Text>
            <View className="flex-row items-baseline gap-1">
                <Text className={`text-3xl font-bold`} style={{ color: color }}>
                    {value}
                </Text>
                {unit && (
                    <Text className="text-2xl font-bold uppercase" style={{ color: color }}>
                        {unit}
                    </Text>
                )}
            </View>
        </View>

        {/* Time labels for chart */}
        <View className="mt-2">
            <MiniChart color={color} />
            <View className="flex-row justify-between mt-1">
                <Text className="text-[#636366] text-[8px]">12 AM</Text>
                <Text className="text-[#636366] text-[8px]">6 AM</Text>
                <Text className="text-[#636366] text-[8px]">12 PM</Text>
                <Text className="text-[#636366] text-[8px]">6 PM</Text>
            </View>
        </View>
    </TouchableOpacity>
);

const BentoGrid = ({ steps = 0, distance = 0, onRefresh }) => {
    return (
        <View className="flex-row gap-3.5 w-full">
            <GridCard
                title="Step Count"
                value={steps.toLocaleString()}
                color="#EC4E20" // Orange/Red from reference
                icon="Footprints"
                onPress={onRefresh}
            />
            <GridCard
                title="Step Distance"
                value={distance}
                unit="KM"
                color="#00DBFF" // Cyan from reference
                icon="MapPin"
                onPress={onRefresh}
            />
        </View>
    );
};

export default BentoGrid;
