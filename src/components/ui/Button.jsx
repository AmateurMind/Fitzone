import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

const Button = ({ children, onClick, variant = 'primary', className = '' }) => {
    const baseStyle = "py-3 rounded-xl flex-row items-center justify-center gap-2";
    const variants = {
        primary: "bg-teal-600", // Solid color for broad platform compatibility
        secondary: "bg-slate-700",
        outline: "border border-slate-500"
    };

    const textVariants = {
        primary: "text-white font-bold",
        secondary: "text-white font-bold",
        outline: "text-slate-400 font-bold"
    };

    return (
        <TouchableOpacity
            onPress={onClick}
            className={`${baseStyle} ${variants[variant]} ${className}`}
        >
            <Text className={textVariants[variant]}>{children}</Text>
        </TouchableOpacity>
    );
};

export default Button;
