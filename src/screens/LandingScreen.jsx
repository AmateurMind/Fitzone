import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing, StatusBar, Platform, Dimensions, ScrollView, ImageBackground } from 'react-native';
import Icon from '../components/ui/Icon';
import { playSoothingSound, playUIClick } from '../services/voice.service';
import Svg, { Circle, Path, G, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const onboardingSlides = [
    {
        id: 1,
        title: "Track what matters",
        description: "Monitor your workouts, calories, and progress with AI-powered insights that help you achieve your fitness goals faster.",
        icon: "TrackIcon",
        gradient: ["#A855F7", "#F97316"],
        bgImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80" // Yoga/sunset silhouette
    },
    {
        id: 2,
        title: "Identify Patterns",
        description: "Discover your fitness patterns and optimize your routine with intelligent analysis of your workout data and performance trends.",
        icon: "PatternIcon",
        gradient: ["#22C55E", "#F97316"],
        bgImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80" // Weightlifting
    },
    {
        id: 3,
        title: "Build New Habits",
        description: "Transform your fitness journey with personalized workout plans and daily motivation to build lasting healthy habits.",
        icon: "HabitIcon",
        gradient: ["#A855F7", "#EC4899"],
        bgImage: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&q=80" // Running silhouette
    }
];

// Custom Icon Components
const TrackIcon = ({ size = 80, gradient }) => (
    <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
            <LinearGradient id="trackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={gradient[0]} stopOpacity="1" />
                <Stop offset="100%" stopColor={gradient[1]} stopOpacity="1" />
            </LinearGradient>
        </Defs>
        <Circle cx="50" cy="50" r="45" fill="url(#trackGrad)" />
        <Path d="M 30 50 L 45 65 L 70 40" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const PatternIcon = ({ size = 80, gradient }) => (
    <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
            <LinearGradient id="patternGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={gradient[0]} stopOpacity="1" />
                <Stop offset="100%" stopColor={gradient[1]} stopOpacity="1" />
            </LinearGradient>
        </Defs>
        <G>
            <Path d="M 20 20 L 40 20 L 40 40 L 20 40 Z" fill="url(#patternGrad)" opacity="0.8" />
            <Path d="M 50 20 L 70 20 L 70 40 L 50 40 Z" fill="url(#patternGrad)" opacity="0.9" />
            <Path d="M 80 20 L 80 40 L 60 40 L 60 20 Z" fill="url(#patternGrad)" opacity="0.7" />
            <Path d="M 20 50 L 40 50 L 40 70 L 20 70 Z" fill="url(#patternGrad)" opacity="0.9" />
            <Path d="M 50 50 L 70 50 L 70 70 L 50 70 Z" fill="url(#patternGrad)" opacity="0.6" />
            <Path d="M 80 50 L 80 70 L 60 70 L 60 50 Z" fill="url(#patternGrad)" opacity="0.8" />
        </G>
    </Svg>
);

const HabitIcon = ({ size = 80, gradient }) => (
    <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
            <LinearGradient id="habitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={gradient[0]} stopOpacity="1" />
                <Stop offset="100%" stopColor={gradient[1]} stopOpacity="1" />
            </LinearGradient>
        </Defs>
        <Circle cx="50" cy="50" r="45" fill="url(#habitGrad)" />
        <Path d="M 35 50 L 50 65 L 65 35" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <Circle cx="50" cy="50" r="30" stroke="white" strokeWidth="3" fill="none" opacity="0.3" />
    </Svg>
);

const LandingScreen = ({ setScreen }) => {
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const scrollViewRef = useRef(null);

    // Animation Values for Initial Landing
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const floatingAnim = useRef(new Animated.Value(0)).current;
    const featureScale = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const glowAnim = useRef(new Animated.Value(0.3)).current;
    const onboardingFadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Play soothing sound on mount
        playSoothingSound();

        if (!showOnboarding) {
            // Initial Landing Page Animations
            Animated.sequence([
                Animated.delay(200),
                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: Platform.OS !== 'web',
                        easing: Easing.out(Easing.cubic),
                    }),
                    Animated.spring(slideAnim, {
                        toValue: 0,
                        friction: 8,
                        tension: 40,
                        useNativeDriver: Platform.OS !== 'web',
                    }),
                ]),
                Animated.spring(featureScale, {
                    toValue: 1,
                    friction: 6,
                    tension: 50,
                    useNativeDriver: Platform.OS !== 'web',
                })
            ]).start();

            // Infinite Floating Animation for Logo
            Animated.loop(
                Animated.sequence([
                    Animated.timing(floatingAnim, {
                        toValue: -12,
                        duration: 3000,
                        easing: Easing.inOut(Easing.sin),
                        useNativeDriver: Platform.OS !== 'web',
                    }),
                    Animated.timing(floatingAnim, {
                        toValue: 0,
                        duration: 3000,
                        easing: Easing.inOut(Easing.sin),
                        useNativeDriver: Platform.OS !== 'web',
                    }),
                ])
            ).start();

            // Subtle Button Pulse
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.02,
                        duration: 1500,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: Platform.OS !== 'web',
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1500,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: Platform.OS !== 'web',
                    }),
                ])
            ).start();

            // Glow animation for background orbs
            Animated.loop(
                Animated.sequence([
                    Animated.timing(glowAnim, {
                        toValue: 0.6,
                        duration: 4000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: Platform.OS !== 'web',
                    }),
                    Animated.timing(glowAnim, {
                        toValue: 0.3,
                        duration: 4000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: Platform.OS !== 'web',
                    }),
                ])
            ).start();
        } else {
            // Onboarding fade in
            Animated.timing(onboardingFadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: Platform.OS !== 'web',
            }).start();
        }
    }, [showOnboarding]);

    const handleBeginJourney = () => {
        playUIClick();
        setShowOnboarding(true);
    };

    const handleNext = () => {
        playUIClick();
        if (currentSlide < onboardingSlides.length - 1) {
            const nextSlide = currentSlide + 1;
            setCurrentSlide(nextSlide);
            scrollViewRef.current?.scrollTo({ x: nextSlide * width, animated: true });
        } else {
            handleGetStarted();
        }
    };

    const handleSkip = () => {
        playUIClick();
        handleGetStarted();
    };

    const handleGetStarted = () => {
        playUIClick();
        setScreen('login');
    };

    const handleScroll = (event) => {
        const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
        if (slideIndex !== currentSlide) {
            setCurrentSlide(slideIndex);
        }
    };

    const renderIcon = (iconType, gradient) => {
        switch (iconType) {
            case "TrackIcon":
                return <TrackIcon size={80} gradient={gradient} />;
            case "PatternIcon":
                return <PatternIcon size={80} gradient={gradient} />;
            case "HabitIcon":
                return <HabitIcon size={80} gradient={gradient} />;
            default:
                return <Icon name="Dumbbell" size={80} color={gradient[0]} />;
        }
    };

    // Show Initial Landing Page
    if (!showOnboarding) {
        return (
            <ImageBackground
                source={require('../assets/images/pullups.png')}
                style={{ flex: 1 }}
                resizeMode="cover"
            >
                {/* Dark Overlay for Readability - Gradient for depth */}
                <View
                    className="absolute inset-0"
                    style={{
                        backgroundColor: 'rgba(0,0,0,0.6)', // Base darkness
                        backgroundImage: Platform.OS === 'web' ? 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8))' : undefined
                    }}
                >
                    {/* Native Gradient Fallback (Simple View overlay) */}
                    {Platform.OS !== 'web' && (
                        <View className="absolute inset-0 bg-black/40" />
                    )}
                </View>

                <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

                {/* Main Content */}
                <View className="flex-1 items-center justify-center w-full pb-20">
                    {/* Logo Section */}
                    <Animated.View
                        style={{
                            opacity: fadeAnim,
                            transform: [
                                { translateY: Animated.add(slideAnim, floatingAnim) }
                            ],
                            alignItems: 'center'
                        }}
                    >
                        {/* Logo Container - Simplified for Mobile */}
                        <View className="mb-8 p-6 bg-white/5 rounded-[40px] border border-white/10 backdrop-blur-md">
                            <Icon name="Dumbbell" size={64} color="#2DD4BF" />
                        </View>

                        {/* App Title */}
                        <Text
                            className="text-white text-6xl font-bold tracking-tighter mb-2"
                            style={{
                                textShadowColor: 'rgba(0, 0, 0, 0.75)',
                                textShadowOffset: { width: 0, height: 2 },
                                textShadowRadius: 10
                            }}
                        >
                            Fit<Text className="text-teal-400">Zone</Text>
                        </Text>

                        {/* Tagline - Full Width */}
                        <View className="flex-row items-center justify-center w-full mt-4">
                            <View className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-teal-500/50 to-transparent opacity-50" />
                            <Text className="text-white/90 text-[10px] tracking-[4px] uppercase font-bold text-center mx-4">
                                AI Powered Fitness
                            </Text>
                            <View className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-teal-500/50 to-transparent opacity-50" />
                        </View>
                    </Animated.View>

                    {/* Feature Icons - Cleaner Row aligned */}
                    <Animated.View
                        style={{
                            opacity: fadeAnim,
                            transform: [{ scale: featureScale }],
                        }}
                        className="flex-row items-center justify-between gap-6 px-10 mt-16 w-full max-w-md"
                    >
                        <FeatureIcon icon="Zap" label="Smart" color="#F97316" delay={0} />
                        <FeatureIcon icon="Activity" label="Track" color="#14B8A6" delay={100} />
                        <FeatureIcon icon="Mic" label="Voice" color="#A855F7" delay={200} />
                    </Animated.View>
                </View>

                {/* Bottom Section */}
                <Animated.View
                    style={{
                        opacity: fadeAnim,
                        transform: [{ scale: pulseAnim }],
                    }}
                    className="absolute bottom-12 w-full px-8"
                >
                    {/* CTA Button */}
                    <TouchableOpacity
                        onPress={handleBeginJourney}
                        activeOpacity={0.8}
                        className="w-full py-5 rounded-full bg-teal-500 items-center justify-center shadow-xl shadow-teal-500/30"
                    >
                        <Text className="text-white text-lg font-bold tracking-wide uppercase">
                            Begin Journey
                        </Text>
                    </TouchableOpacity>

                    {/* Powered By Badge */}
                    <View className="flex-row justify-center items-center mt-8 opacity-60">
                        <Text className="text-white/60 text-[10px] uppercase font-semibold">Powered By AI</Text>
                    </View>
                </Animated.View>
            </ImageBackground>



        );
    }

    // Show Onboarding Slides
    return (
        <Animated.View style={{ flex: 1, opacity: onboardingFadeAnim }} className="bg-[#0a0f1a]">
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Skip Button */}
            <TouchableOpacity
                onPress={handleSkip}
                className="absolute top-12 right-6 z-50 px-4 py-2"
                style={{ zIndex: 50 }}
            >
                <Text className="text-white text-base font-medium">Skip</Text>
            </TouchableOpacity>

            {/* Scrollable Slides */}
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                className="flex-1"
            >
                {onboardingSlides.map((slide, index) => (
                    <View key={slide.id} style={{ width, height: '100%' }}>
                        <ImageBackground
                            source={{ uri: slide.bgImage }}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode="cover"
                        >
                            <View
                                className="absolute inset-0"
                                style={{
                                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                    ...(Platform.OS === 'web' ? {
                                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 100%)'
                                    } : {})
                                }}
                            />
                            <View className="flex-1 justify-center items-center px-8 pb-24">
                                <View className="mb-12 mt-20">
                                    {renderIcon(slide.icon, slide.gradient)}
                                </View>
                                <Text className="text-white text-3xl font-bold text-center mb-6 px-4">
                                    {slide.title}
                                </Text>
                                <Text className="text-white/80 text-base text-center leading-6 px-6 mb-16">
                                    {slide.description}
                                </Text>
                            </View>
                        </ImageBackground>
                    </View>
                ))}
            </ScrollView>

            {/* Bottom Section - Pagination & Button */}
            <View className="absolute bottom-0 left-0 right-0 pb-12 px-8">
                <View className="flex-row justify-center items-center mb-8 gap-2">
                    {onboardingSlides.map((_, index) => (
                        <View
                            key={index}
                            style={{
                                width: index === currentSlide ? 32 : 8,
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: index === currentSlide ? '#3B82F6' : 'rgba(255, 255, 255, 0.3)'
                            }}
                        />
                    ))}
                </View>

                <TouchableOpacity
                    onPress={handleNext}
                    activeOpacity={0.85}
                    className="w-full py-4 rounded-2xl items-center"
                    style={{
                        backgroundColor: '#3B82F6',
                        ...(Platform.OS === 'web' ? {
                            boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
                            cursor: 'pointer'
                        } : {
                            elevation: 8
                        })
                    }}
                >
                    <Text className="text-white text-lg font-semibold">
                        {currentSlide === onboardingSlides.length - 1 ? 'Get Started' : 'Next'}
                    </Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

// Enhanced Feature Icon Component
const FeatureIcon = ({ icon, label, color, delay = 0 }) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 5,
            tension: 60,
            delay: delay,
            useNativeDriver: Platform.OS !== 'web',
        }).start();
    }, []);

    return (
        <Animated.View
            style={{ transform: [{ scale: scaleAnim }] }}
            className="items-center justify-center flex-1"
        >
            <View
                className="w-16 h-16 rounded-2xl items-center justify-center mb-3 border border-white/10"
                style={Platform.OS === 'web' ? {
                    background: `linear-gradient(145deg, ${color}15, ${color}08)`,
                    boxShadow: `0 4px 20px ${color}20`,
                } : {
                    backgroundColor: `${color}15`,
                }}
            >
                <Icon name={icon} size={26} color={color} />
            </View>
            <Text className="text-slate-300 text-[11px] font-semibold uppercase tracking-wider text-center">
                {label}
            </Text>
        </Animated.View>
    );
};

export default LandingScreen;