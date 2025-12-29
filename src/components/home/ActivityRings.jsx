import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

const Ring = ({ center, radius, stroke, progress, color, bgcolor = "#000000" }) => {
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <G transform={`rotate(-90 ${center} ${center})`}>
            <Circle
                stroke={bgcolor}
                strokeWidth={stroke}
                fill="transparent"
                r={radius}
                cx={center}
                cy={center}
                strokeOpacity={0.2}
            />
            <Circle
                stroke={color}
                strokeWidth={stroke}
                strokeDasharray={`${circumference} ${circumference}`}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                fill="transparent"
                r={radius}
                cx={center}
                cy={center}
            />
        </G>
    );
};

const ActivityRings = ({ move = 0, exercise = 0, stand = 0, scale = 1 }) => {
    // Apple Watch Activity Colors matches reference
    const MOVE_COLOR = "#FA114F";    // Red/Pink
    const EXERCISE_COLOR = "#A4FF00"; // Lime Green
    const STAND_COLOR = "#00DBFF";    // Light Blue

    const size = 120 * scale;
    const center = size / 2;
    const strokeWidth = 12 * scale;
    const gap = 1 * scale; // Small gap between rings

    // Radius calculations (outer to inner)
    // We adjust by strokeWidth/2 so the stroke sits inside the bounds
    const r1 = (size / 2) - (strokeWidth / 2);
    const r2 = r1 - strokeWidth - gap;
    const r3 = r2 - strokeWidth - gap;

    return (
        <View style={{ width: size, height: size }}>
            <Svg height={size} width={size}>
                <Ring center={center} radius={r1} stroke={strokeWidth} progress={move} color={MOVE_COLOR} bgcolor={MOVE_COLOR} />
                <Ring center={center} radius={r2} stroke={strokeWidth} progress={exercise} color={EXERCISE_COLOR} bgcolor={EXERCISE_COLOR} />
                <Ring center={center} radius={r3} stroke={strokeWidth} progress={stand} color={STAND_COLOR} bgcolor={STAND_COLOR} />
            </Svg>
        </View>
    );
};

export default ActivityRings;

