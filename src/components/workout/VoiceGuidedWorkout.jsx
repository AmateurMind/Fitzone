/**
 * Voice-Guided Workout Component
 * AI-powered voice coaching during workouts with short, efficient cues
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import Icon from '../ui/Icon';
import { voiceCue, workoutVoice } from '../../services/workoutVoice.service';
import { playCountdown, playExerciseSound, playRestSound, playCompletionCelebration, stopAllSounds } from '../../services/soundEffects.service';
import { getExerciseAnimation } from '../../data/exerciseAnimations';
import LottieView from 'lottie-react-native';

const VoiceGuidedWorkout = ({ exercises, workoutName, onComplete, onPause, onResume }) => {
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [progress, setProgress] = useState(0);
    const [voiceEnabled, setVoiceEnabled] = useState(true);
    const [loading, setLoading] = useState(false);

    const timerRef = useRef(null);
    const exerciseDurationRef = useRef(0);
    const hasPlayedHalfway = useRef(false);
    const hasPlayedFinalPush = useRef(false);
    const currentExercise = exercises[currentExerciseIndex];

    // Sync voice enabled state
    useEffect(() => {
        voiceCue.enable(voiceEnabled);
    }, [voiceEnabled]);

    // Initialize workout
    useEffect(() => {
        if (isPlaying && !isPaused) {
            startExercise();
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            stopAllSounds();
        };
    }, [currentExerciseIndex, isPlaying, isPaused]);

    const startExercise = async () => {
        if (!currentExercise) return;

        setLoading(true);
        const duration = parseDuration(currentExercise.duration || currentExercise.reps);
        exerciseDurationRef.current = duration;
        hasPlayedHalfway.current = false;
        hasPlayedFinalPush.current = false;

        // Short countdown
        await playCountdown(3);

        // Short voice cue: "Go." or "Begin."
        if (voiceEnabled) {
            await voiceCue.exerciseStart(currentExercise.name);
        }

        setTimeRemaining(duration);
        setProgress(0);
        setLoading(false);

        // Start timer
        timerRef.current = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    completeExercise();
                    return 0;
                }

                const newTime = prev - 1;
                const totalDuration = exerciseDurationRef.current;
                const newProgress = 1 - (newTime / totalDuration);
                setProgress(newProgress);

                // Voice cues at key moments (minimal, strategic)
                if (voiceEnabled) {
                    handleTimerCues(newTime, totalDuration, newProgress);
                }

                return newTime;
            });
        }, 1000);
    };

    /**
     * Handle voice cues during timer - minimal and strategic
     */
    const handleTimerCues = async (timeLeft, totalDuration, progress) => {
        // Halfway point - "Halfway there."
        if (!hasPlayedHalfway.current && progress >= 0.5 && progress < 0.55) {
            hasPlayedHalfway.current = true;
            voiceCue.halfway();
        }

        // Final push - last 10 seconds for exercises > 30 sec
        if (!hasPlayedFinalPush.current && timeLeft === 10 && totalDuration > 30) {
            hasPlayedFinalPush.current = true;
            voiceCue.finalPush();
        }

        // Countdown cues: 5, 3, 2, 1
        if ([5, 3, 2, 1].includes(timeLeft) && totalDuration > 15) {
            voiceCue.countdown(timeLeft);
        }
    };

    const completeExercise = async () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        // Short cue: "Done." or "Nice."
        if (voiceEnabled) {
            await voiceCue.setComplete();
        }

        await playExerciseSound('complete');

        // Check if workout is complete
        if (currentExerciseIndex >= exercises.length - 1) {
            await completeWorkout();
        } else {
            // Rest period
            if (currentExercise.type !== 'cooldown') {
                if (voiceEnabled) {
                    await voiceCue.rest(); // "Rest now."
                }
                await playRestSound('start');
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            setCurrentExerciseIndex(prev => prev + 1);
        }
    };

    const completeWorkout = async () => {
        setIsPlaying(false);
        stopAllSounds();

        // Final voice cue: "Great job." or "You did it."
        if (voiceEnabled) {
            await voiceCue.complete();
        }

        await playCompletionCelebration();
        onComplete?.();
    };

    const parseDuration = (duration) => {
        if (!duration) return 60;
        if (typeof duration === 'number') return duration;

        const match = duration.match(/(\d+)/);
        if (match) {
            const value = parseInt(match[1]);
            if (duration.includes('min')) return value * 60;
            if (duration.includes('sec')) return value;
            if (duration.includes('rep')) return 30;
            return value;
        }
        return 60;
    };

    const handleStart = async () => {
        voiceCue.reset();
        setIsPlaying(true);
        setIsPaused(false);
        setCurrentExerciseIndex(0);

        // Short start cue: "Let's go."
        if (voiceEnabled) {
            await voiceCue.start();
        }
    };

    const handlePause = () => {
        setIsPaused(true);
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        onPause?.();
    };

    const handleResume = () => {
        setIsPaused(false);
        startExercise();
        onResume?.();
    };

    const handleStop = () => {
        setIsPlaying(false);
        setIsPaused(false);
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        stopAllSounds();
        voiceCue.reset();
    };

    if (!isPlaying) {
        return (
            <View className="items-center justify-center p-6">
                <TouchableOpacity
                    onPress={handleStart}
                    className="bg-teal-500 px-8 py-4 rounded-2xl flex-row items-center gap-3"
                >
                    <Icon name="Play" size={24} color="white" />
                    <Text className="text-white font-bold text-lg">Start Workout</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setVoiceEnabled(!voiceEnabled)}
                    className="mt-4 flex-row items-center gap-2"
                >
                    <Icon name={voiceEnabled ? "Volume2" : "VolumeX"} size={20} color={voiceEnabled ? "#2DD4BF" : "#64748B"} />
                    <Text className="text-slate-400 text-sm">
                        Voice {voiceEnabled ? 'ON' : 'OFF'}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="bg-slate-800 rounded-2xl p-6 m-4">
            {loading && (
                <View className="absolute inset-0 bg-black/50 rounded-2xl items-center justify-center z-10">
                    <ActivityIndicator size="large" color="#2DD4BF" />
                </View>
            )}

            {/* Current Exercise */}
            <View className="items-center mb-6">
                <Text className="text-slate-400 text-sm mb-2">
                    {currentExerciseIndex + 1} / {exercises.length}
                </Text>
                <Text className="text-white text-2xl font-bold text-center mb-2">
                    {currentExercise?.name}
                </Text>
                <Text className="text-slate-400 text-sm">
                    {currentExercise?.duration || currentExercise?.reps}
                </Text>
            </View>

            {/* Exercise Animation/GIF */}
            <View className="items-center mb-6">
                <View className="w-48 h-48 bg-slate-700/50 rounded-3xl overflow-hidden border-2 border-teal-500/30 items-center justify-center">
                    {currentExercise && (() => {
                        const animation = getExerciseAnimation(currentExercise.name);
                        const animationKey = `${currentExercise.name}-${animation.type}`;

                        return (
                            <View key={animationKey} style={{ width: '100%', height: '100%' }}>
                                {animation.type === 'lottie' ? (
                                    <View style={{ width: '100%', height: '100%' }}>
                                        <LottieView
                                            source={{ uri: animation.source }}
                                            autoPlay={true}
                                            loop={true}
                                            style={{ width: '100%', height: '100%' }}
                                            resizeMode="contain"
                                        />
                                    </View>
                                ) : (
                                    <Image
                                        source={{ uri: animation.source }}
                                        style={{ width: '100%', height: '100%' }}
                                        resizeMode="contain"
                                    />
                                )}
                            </View>
                        );
                    })()}
                    {/* Subtle overlay */}
                    <View className="absolute inset-0 bg-teal-500/5" />
                </View>
            </View>

            {/* Timer */}
            <View className="items-center mb-6">
                <View className="w-32 h-32 rounded-full border-4 border-teal-500 items-center justify-center mb-4">
                    <Text className="text-white text-4xl font-bold">
                        {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                    </Text>
                </View>

                {/* Progress Bar */}
                <View className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <View
                        className="h-full bg-teal-500 rounded-full"
                        style={{ width: `${progress * 100}%` }}
                    />
                </View>
            </View>

            {/* Controls */}
            <View className="flex-row justify-center gap-4">
                {isPaused ? (
                    <TouchableOpacity
                        onPress={handleResume}
                        className="bg-teal-500 px-6 py-3 rounded-xl flex-row items-center gap-2"
                    >
                        <Icon name="Play" size={20} color="white" />
                        <Text className="text-white font-semibold">Resume</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        onPress={handlePause}
                        className="bg-slate-700 px-6 py-3 rounded-xl flex-row items-center gap-2"
                    >
                        <Icon name="Pause" size={20} color="white" />
                        <Text className="text-white font-semibold">Pause</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    onPress={handleStop}
                    className="bg-red-500 px-6 py-3 rounded-xl flex-row items-center gap-2"
                >
                    <Icon name="Square" size={20} color="white" />
                    <Text className="text-white font-semibold">Stop</Text>
                </TouchableOpacity>
            </View>

            {/* Voice Toggle */}
            <TouchableOpacity
                onPress={() => setVoiceEnabled(!voiceEnabled)}
                className="mt-4 flex-row items-center justify-center gap-2"
            >
                <Icon name={voiceEnabled ? "Volume2" : "VolumeX"} size={18} color={voiceEnabled ? "#2DD4BF" : "#64748B"} />
                <Text className="text-slate-400 text-sm">
                    Voice {voiceEnabled ? 'ON' : 'OFF'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default VoiceGuidedWorkout;
