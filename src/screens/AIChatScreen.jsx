import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Animated, Modal, BlurView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '../components/ui/Icon';
import { chatWithAITrainer, generateCompleteFitnessPlan, generateDietPlan, getGymRecommendations } from '../services/ai.service';
import { startNativeRecognition, speechToText } from '../services/voice.service';
import { saveAIChatMessage, getAIChatHistory, clearAIChatHistory } from '../services/firestore.service';
import { getCurrentUserId } from '../services/auth.service';

const AIChatScreen = ({ setScreen, setSelectedPlan }) => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [isRecording, setIsRecording] = useState(false);
    const [showPlanModal, setShowPlanModal] = useState(false);
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [planType, setPlanType] = useState(null);
    const [planStep, setPlanStep] = useState(0);
    const [planData, setPlanData] = useState({});
    const scrollViewRef = useRef(null);
    const recognitionRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const pulseAnim = useRef(new Animated.Value(1)).current;

    // Load chat history on mount
    useEffect(() => {
        loadChatHistory();
    }, []);

    const loadChatHistory = async () => {
        try {
            setLoadingHistory(true);
            const userId = getCurrentUserId();
            if (userId) {
                const history = await getAIChatHistory(userId);
                if (history.length > 0) {
                    setMessages(history);
                } else {
                    setMessages([{
                        id: 'welcome',
                        fromUser: false,
                        content: "Hi! I'm your AI Trainer. 💪\n\nI can create personalized workout plans, design diet schedules, find local gyms, or answer any fitness questions.\n\nHow can I help you today?",
                        timestamp: new Date(),
                        type: 'welcome'
                    }]);
                }
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
            setMessages([{
                id: 'welcome',
                fromUser: false,
                content: "Hi! I'm your AI Trainer. 💪\n\nHow can I help you with your fitness journey today?",
                timestamp: new Date(),
                type: 'welcome'
            }]);
        } finally {
            setLoadingHistory(false);
        }
    };

    const handleClearHistory = async () => {
        try {
            const userId = getCurrentUserId();
            if (userId) {
                await clearAIChatHistory(userId);
                setMessages([{
                    id: 'welcome',
                    fromUser: false,
                    content: "Chat cleared! Ready for a fresh start. 💪",
                    timestamp: new Date(),
                    type: 'welcome'
                }]);
                setShowClearConfirm(false);
            }
        } catch (error) {
            console.error('Error clearing history:', error);
        }
    };

    const saveMessage = async (message) => {
        try {
            const userId = getCurrentUserId();
            if (userId && message.id !== 'welcome') {
                await saveAIChatMessage(userId, message);
            }
        } catch (error) {
            console.error('Error saving message:', error);
        }
    };

    const workoutQuestions = [
        { key: 'goal', question: "What's your main fitness goal?", options: ['Lose Weight', 'Build Muscle', 'Get Fit', 'Increase Endurance', 'Flexibility'] },
        { key: 'fitnessLevel', question: "What's your current fitness level?", options: ['Beginner', 'Intermediate', 'Advanced'] },
        { key: 'daysPerWeek', question: "How many days per week can you workout?", options: ['3 days', '4 days', '5 days', '6 days'] },
        { key: 'duration', question: "Preferred workout duration?", options: ['20 min', '30 min', '45 min', '60 min'] },
        { key: 'equipment', question: "What equipment do you have access to?", options: ['Full Gym', 'Home Gym', 'Dumbbells Only', 'No Equipment'] },
    ];

    const dietQuestions = [
        { key: 'goal', question: "What's your diet goal?", options: ['Lose Weight', 'Gain Muscle', 'Maintain', 'Eat Healthier'] },
        { key: 'dietType', question: "Any dietary preference?", options: ['No Preference', 'Vegetarian', 'Vegan', 'Keto', 'High Protein'] },
        { key: 'mealsPerDay', question: "How many meals per day?", options: ['3 meals', '4 meals', '5 meals', '6 small meals'] },
        { key: 'cookingTime', question: "How much time for meal prep?", options: ['Minimal (15 min)', 'Moderate (30 min)', 'Flexible (1 hour+)'] },
        { key: 'budget', question: "Weekly food budget?", options: ['Budget-friendly', 'Moderate', 'No limit'] },
    ];

    const gymQuestions = [
        { key: 'budget', question: "What's your monthly budget?", options: ['$20-40', '$40-80', '$80-150', 'No limit'] },
        { key: 'schedule', question: "When do you usually workout?", options: ['Early Morning', 'Morning', 'Afternoon', 'Evening', 'Late Night'] },
        { key: 'priority', question: "What's most important to you?", options: ['Equipment Variety', 'Classes', 'Location', 'Price', '24/7 Access'] },
    ];

    const getQuestions = () => {
        if (planType === 'workout') return workoutQuestions;
        if (planType === 'diet') return dietQuestions;
        if (planType === 'gym') return gymQuestions;
        return [];
    };

    useEffect(() => {
        let animation;
        if (isRecording) {
            animation = Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, { toValue: 1.2, duration: 600, useNativeDriver: Platform.OS !== 'web' }),
                    Animated.timing(pulseAnim, { toValue: 1.0, duration: 600, useNativeDriver: Platform.OS !== 'web' }),
                ])
            );
            animation.start();
        } else {
            pulseAnim.setValue(1);
        }
        return () => animation?.stop();
    }, [isRecording]);

    const startRecording = async () => {
        if (isRecording) {
            stopRecording();
            return;
        }

        setInputText('');

        try {
            setIsRecording(true);

            const rec = startNativeRecognition(
                (transcript, isFinal) => {
                    setInputText(transcript);
                },
                (error) => {
                    console.error('STT Error:', error);
                    setIsRecording(false);
                }
            );
            recognitionRef.current = rec;

            if (typeof window !== 'undefined' && navigator.mediaDevices) {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/ogg';
                mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
                audioChunksRef.current = [];

                mediaRecorderRef.current.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        audioChunksRef.current.push(event.data);
                    }
                };

                mediaRecorderRef.current.onstop = async () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

                    if (inputText.length < 5) {
                        try {
                            setLoading(true);
                            const text = await speechToText(audioBlob);
                            if (text) setInputText(text);
                        } catch (err) {
                            console.error('Eleven Labs transcription failed:', err);
                        } finally {
                            setLoading(false);
                        }
                    }
                    stream.getTracks().forEach(track => track.stop());
                };

                mediaRecorderRef.current.start();
            }
        } catch (error) {
            console.error('Microphone access denied:', error);
            setIsRecording(false);
        }
    };

    const stopRecording = () => {
        if (recognitionRef.current) recognitionRef.current.stop();
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
    };

    useEffect(() => {
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    }, [messages, loading]);

    const handleSend = async () => {
        if (isRecording) stopRecording();
        if (!inputText.trim() || loading) return;

        const userMessage = {
            id: Date.now().toString(),
            fromUser: true,
            content: inputText.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setLoading(true);

        await saveMessage(userMessage);

        try {
            const history = messages
                .filter(m => m.id !== 'welcome')
                .map(m => ({
                    role: m.fromUser ? 'user' : 'assistant',
                    content: m.content
                }));

            const aiResponse = await chatWithAITrainer(userMessage.content, history);

            const aiMessage = {
                id: (Date.now() + 1).toString(),
                fromUser: false,
                content: aiResponse,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMessage]);

            await saveMessage(aiMessage);
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage = {
                id: (Date.now() + 1).toString(),
                fromUser: false,
                content: "Sorry, I'm having trouble connecting. Please try again!",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
            await saveMessage(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const startPlanGeneration = (type) => {
        setPlanType(type);
        setPlanStep(0);
        setPlanData({});
        setShowPlanModal(true);
    };

    const handlePlanAnswer = async (answer) => {
        const questions = getQuestions();
        const currentQ = questions[planStep];

        const newData = { ...planData, [currentQ.key]: answer };
        setPlanData(newData);

        if (planStep < questions.length - 1) {
            setPlanStep(planStep + 1);
        } else {
            setShowPlanModal(false);
            setLoading(true);

            const planNames = { workout: 'workout plan', diet: 'diet plan', gym: 'gym recommendations' };
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                fromUser: true,
                content: `Create a personalized ${planNames[planType]} for me`,
                timestamp: new Date()
            }]);

            try {
                let result;
                if (planType === 'workout') {
                    result = await generateCompleteFitnessPlan(newData);
                } else if (planType === 'diet') {
                    result = await generateDietPlan(newData);
                } else if (planType === 'gym') {
                    result = await getGymRecommendations(newData);
                }

                if (!result || !result.success) {
                    throw new Error('Plan generation failed');
                }

                const formattedContent = formatPlanResult(planType, result);

                const planMessage = {
                    id: (Date.now() + 1).toString(),
                    fromUser: false,
                    content: formattedContent + '\n\n✅ Plan saved! Tap below to view details.',
                    timestamp: new Date(),
                    type: 'plan',
                    planData: result
                };

                setMessages(prev => [...prev, planMessage]);
                await saveMessage(planMessage);

            } catch (error) {
                console.error('Plan generation error:', error);
                setMessages(prev => [...prev, {
                    id: (Date.now() + 1).toString(),
                    fromUser: false,
                    content: "Sorry, I couldn't generate your plan right now. Please try again!",
                    timestamp: new Date()
                }]);
            } finally {
                setLoading(false);
            }
        }
    };

    const formatPlanResult = (type, result) => {
        if (!result || !result.success) return "Plan generation failed.";

        if (type === 'workout') {
            const plan = result.plan;
            let text = `🏋️ **${plan.planName}**\n\n`;
            text += `${plan.summary}\n\n`;
            text += `📅 **Weekly Schedule:**\n`;
            plan.weeklySchedule?.forEach(day => {
                text += `• ${day.day}: ${day.workout} (${day.duration} min)\n`;
            });
            return text;
        }

        if (type === 'diet') {
            const plan = result.plan;
            let text = `🥗 **${plan.planName}**\n\n`;
            text += `Daily: ${plan.dailyCalories} kcal • ${plan.macros?.protein}P / ${plan.macros?.carbs}C / ${plan.macros?.fat}F\n\n`;
            text += `🍽️ **Daily Meals:**\n`;
            plan.meals?.forEach(meal => {
                text += `• ${meal.meal}: ${meal.foods?.join(', ')}\n`;
            });
            return text;
        }

        if (type === 'gym') {
            const rec = result.recommendations;
            let text = `🏢 **Gym Recommendation**\n\n`;
            text += `🥇 **Top Pick: ${rec.topPick}**\n`;
            text += `${rec.reason}\n`;
            return text;
        }

        return "Plan generated!";
    };

    const questions = getQuestions();
    const currentQuestion = questions[planStep];

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        try {
            const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
            return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        } catch (e) {
            return '';
        }
    };

    if (loadingHistory) {
        return (
            <SafeAreaView className="flex-1 bg-black">
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#14B8A6" />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-black">
            {/* Header */}
            <View className="px-5 pt-4 pb-4 flex-row items-center border-b border-white/5 bg-black/80">
                <TouchableOpacity
                    onPress={() => setScreen('home')}
                    className="w-10 h-10 items-center justify-center"
                >
                    <Icon name="ArrowLeft" size={24} color="white" />
                </TouchableOpacity>
                <View className="flex-1 items-center">
                    <Text className="text-white text-lg font-bold">AI Trainer</Text>
                    <Text className="text-slate-500 text-[10px] tracking-widest uppercase mt-0.5">
                        {isRecording ? '🔴 Listening...' : 'Fitness Assistant'}
                    </Text>
                </View>
                <View className="flex-row gap-2">
                    <TouchableOpacity
                        onPress={() => setShowClearConfirm(true)}
                        className="w-8 h-8 rounded-full bg-white/5 items-center justify-center"
                    >
                        <Icon name="Trash" size={16} color="#94A3B8" />
                    </TouchableOpacity>
                    <TouchableOpacity className="w-8 h-8 rounded-full bg-teal-500/10 items-center justify-center">
                        <Icon name="Zap" size={16} color="#14B8A6" />
                    </TouchableOpacity>
                </View>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                {/* Chat Area */}
                <ScrollView
                    ref={scrollViewRef}
                    className="flex-1 px-5 pt-6"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 150 }}
                >
                    {messages.map((message) => (
                        <View
                            key={message.id}
                            className={`mb-6 ${message.fromUser ? 'items-end' : 'items-start'}`}
                        >
                            <View
                                className={`max-w-[85%] rounded-[20px] px-4 py-3 ${message.fromUser
                                    ? 'bg-[#2C2C2E]'
                                    : 'bg-[#1C1C1E]'
                                    }`}
                            >
                                <Text className="text-white text-[15px] leading-6">
                                    {message.content}
                                </Text>

                                {message.type === 'plan' && (
                                    <TouchableOpacity
                                        onPress={() => setScreen('plans')}
                                        className="mt-4 bg-[#14B8A6] px-4 py-2.5 rounded-full flex-row items-center justify-center gap-2"
                                    >
                                        <Icon name="Clipboard" size={16} color="white" />
                                        <Text className="text-white font-bold text-sm">View Details</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                            <Text className="text-slate-600 text-[10px] mt-1.5 font-medium uppercase tracking-tighter">
                                {formatTime(message.timestamp)}
                            </Text>
                        </View>
                    ))}

                    {loading && (
                        <View className="mb-6 items-start">
                            <View className="bg-[#1C1C1E] rounded-[20px] px-4 py-3 border border-white/5">
                                <View className="flex-row items-center gap-2.5">
                                    <View className="flex-row gap-1">
                                        {[0, 1, 2].map(i => (
                                            <Animated.View
                                                key={i}
                                                // Simplified typing indicator
                                                className="w-1.5 h-1.5 bg-teal-500 rounded-full opacity-50"
                                            />
                                        ))}
                                    </View>
                                    <Text className="text-slate-400 text-xs font-medium">Assistant is thinking...</Text>
                                </View>
                            </View>
                        </View>
                    )}
                </ScrollView>

                {/* Floating Input Area */}
                <View className="px-5 pb-8 pt-4 bg-black/80 border-t border-white/5">
                    {/* Quick Actions Scroll */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="mb-4"
                        contentContainerStyle={{ gap: 8, paddingBottom: 4 }}
                    >
                        {[
                            { id: 'workout', label: 'Make Plan', icon: 'Dumbbell', color: '#14B8A6' },
                            { id: 'diet', label: 'Diet Plan', icon: 'Heart', color: '#FB923C' },
                            { id: 'gym', label: 'Find Gym', icon: 'Map', color: '#A855F7' },
                            { id: 'fatburn', label: 'Fat Burn', icon: 'Flame', color: '#EF4444' }
                        ].map(action => (
                            <TouchableOpacity
                                key={action.id}
                                onPress={() => action.id === 'fatburn' ? setInputText('How to burn fat effectively?') : startPlanGeneration(action.id)}
                                className="bg-[#1C1C1E] px-4 py-2.5 rounded-full border border-white/5 flex-row items-center gap-2"
                            >
                                <Icon name={action.icon} size={14} color={action.color} />
                                <Text className="text-slate-300 text-xs font-semibold">{action.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Input Field */}
                    <View className="flex-row gap-3 items-center">
                        <View className="flex-1 flex-row items-center bg-[#1C1C1E] rounded-[24px] px-4 border border-white/5">
                            <TextInput
                                placeholder={isRecording ? "Listening..." : "Ask me anything..."}
                                placeholderTextColor="#64748B"
                                value={inputText}
                                onChangeText={setInputText}
                                onSubmitEditing={handleSend}
                                multiline
                                className="flex-1 text-white text-[15px] py-3 max-h-24"
                                style={{ minHeight: 48 }}
                            />
                            <TouchableOpacity
                                onPress={startRecording}
                                className="w-10 h-10 items-center justify-center"
                            >
                                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                                    <Icon name="Mic" size={20} color={isRecording ? '#EF4444' : '#64748B'} />
                                </Animated.View>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            onPress={handleSend}
                            disabled={loading || !inputText.trim()}
                            className={`w-12 h-12 rounded-full items-center justify-center ${inputText.trim() ? 'bg-[#14B8A6]' : 'bg-[#1C1C1E] opacity-50'
                                }`}
                        >
                            <Icon name="Send" size={20} color="white" />
                        </TouchableOpacity>
                    </View>

                    {/* Bottom Home Link */}
                    <View className="mt-4 items-center">
                        <TouchableOpacity
                            onPress={() => setScreen('home')}
                            className="bg-white/5 px-6 py-2 rounded-full"
                        >
                            <Text className="text-slate-500 text-xs font-semibold">Back to Home</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>

            {/* Modal Components (Simplified Styles) */}
            <Modal visible={showPlanModal} transparent animationType="slide">
                <View className="flex-1 bg-black/80 justify-end">
                    <View className="bg-[#1C1C1E] rounded-t-[32px] p-6 pb-12">
                        <View className="w-12 h-1 bg-white/10 rounded-full self-center mb-8" />
                        <Text className="text-white text-xl font-bold text-center mb-1">
                            {planType === 'workout' ? 'Workout Assistant' : planType === 'diet' ? 'Diet Assistant' : 'Gym Finder'}
                        </Text>
                        <Text className="text-slate-500 text-[10px] text-center font-bold tracking-widest uppercase mb-8">
                            Step {planStep + 1} of {questions.length}
                        </Text>

                        <Text className="text-white text-lg font-medium text-center mb-8">{currentQuestion?.question}</Text>

                        <View className="gap-3">
                            {currentQuestion?.options.map((option, idx) => (
                                <TouchableOpacity
                                    key={idx}
                                    onPress={() => handlePlanAnswer(option)}
                                    className="bg-white/5 border border-white/5 p-4 rounded-2xl items-center"
                                >
                                    <Text className="text-white font-semibold">{option}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TouchableOpacity onPress={() => setShowPlanModal(false)} className="mt-8 items-center">
                            <Text className="text-slate-500 font-semibold">Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal animationType="fade" transparent={true} visible={showClearConfirm}>
                <View className="flex-1 justify-center items-center bg-black/80 px-10">
                    <View className="bg-[#1C1C1E] rounded-3xl p-6 w-full border border-white/5">
                        <Text className="text-white text-lg font-bold mb-2">Clear History?</Text>
                        <Text className="text-slate-400 text-sm mb-6">This will permanently delete this conversation.</Text>
                        <View className="flex-row gap-3">
                            <TouchableOpacity onPress={() => setShowClearConfirm(false)} className="flex-1 bg-white/5 py-3 rounded-xl items-center">
                                <Text className="text-white font-bold">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleClearHistory} className="flex-1 bg-red-600 py-3 rounded-xl items-center">
                                <Text className="text-white font-bold">Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default AIChatScreen;
