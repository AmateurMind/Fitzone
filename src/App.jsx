import React, { useState, useEffect } from 'react';
import { StatusBar, View, Platform, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BottomNav from './components/navigation/BottomNav';
import HomeScreen from './screens/HomeScreen';
import WorkoutsScreen from './screens/WorkoutsScreen';
import WorkoutDetailScreen from './screens/WorkoutDetailScreen';
import ExerciseDetailScreen from './screens/ExerciseDetailScreen';
import GymsScreen from './screens/GymsScreen';
import GymDetailScreen from './screens/GymDetailScreen';
import GymMapScreen from './screens/GymMapScreen';
import ScanQRScreen from './screens/ScanQRScreen';
import ProfileScreen from './screens/ProfileScreen';
import SubscriptionScreen from './screens/SubscriptionScreen';
import AIChatScreen from './screens/AIChatScreen';
import PlansScreen from './screens/PlansScreen';
import PlanDetailScreen from './screens/PlanDetailScreen';
import GroceryListScreen from './screens/GroceryListScreen';
import LoginScreen from './screens/LoginScreen';
import LandingScreen from './screens/LandingScreen';

// Initialize Firebase
import './services/firebase';
// Global styles for web (centering and background)
import '../global.css';

export default function FitZoneApp() {
    // For testing: skip landing screen and go directly to home on web
    const [screen, setScreen] = useState(Platform.OS === 'web' ? 'home' : 'landing');
    const [selectedWorkout, setSelectedWorkout] = useState(null);
    const [selectedGym, setSelectedGym] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [isOffline, setIsOffline] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(true);

    const navigate = (nextScreen) => {
        // Reset detail selections when moving between root tabs
        if (['home', 'workouts', 'gyms', 'profile', 'scan', 'login', 'plans'].includes(nextScreen)) {
            setSelectedWorkout(null);
            setSelectedGym(null);
            setSelectedPlan(null);
            setSelectedExercise(null);
        }
        if (nextScreen === 'profile' && !isAuthenticated) {
            setScreen('login');
            return;
        }
        if (nextScreen === 'login') {
            setIsAuthenticated(false);
        }
        setScreen(nextScreen);
    };


    // Ensure body/html has dark background and mobile-like viewport on web
    useEffect(() => {
        if (Platform.OS === 'web') {
            const applyStyles = () => {
                // Set viewport meta tag
                let viewport = document.querySelector('meta[name="viewport"]');
                if (!viewport) {
                    viewport = document.createElement('meta');
                    viewport.setAttribute('name', 'viewport');
                    document.head.appendChild(viewport);
                }
                viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');

                document.body.style.margin = '0';
                document.body.style.padding = '0';
                document.body.style.backgroundColor = '#020617'; // Extra dark background for side areas
                document.body.style.height = '100vh';
                document.body.style.overflow = 'hidden';
                document.body.style.display = 'flex';
                document.body.style.justifyContent = 'center';
                document.body.style.alignItems = 'center';
                document.body.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

                document.documentElement.style.backgroundColor = '#020617';
                document.documentElement.style.height = '100%';
                document.documentElement.style.overflow = 'hidden';

                const rootDiv = document.getElementById('root') ||
                    document.querySelector('[data-reactroot]') ||
                    document.body.firstElementChild;

                if (rootDiv) {
                    rootDiv.style.width = '100%';
                    rootDiv.style.height = '100%';
                    rootDiv.style.display = 'flex';
                    rootDiv.style.justifyContent = 'center';
                    rootDiv.style.alignItems = 'center';
                }
            };

            applyStyles();
            window.addEventListener('resize', applyStyles);
            return () => window.removeEventListener('resize', applyStyles);
        }
    }, []);

    // Basic offline indicator for web
    useEffect(() => {
        if (Platform.OS !== 'web') return;
        const updateStatus = () => setIsOffline(!navigator.onLine);
        updateStatus();
        window.addEventListener('online', updateStatus);
        window.addEventListener('offline', updateStatus);
        return () => {
            window.removeEventListener('online', updateStatus);
            window.removeEventListener('offline', updateStatus);
        };
    }, []);

    const renderScreen = () => {
        switch (screen) {
            case 'landing':
                return <LandingScreen setScreen={navigate} />;
            case 'home':
                return <HomeScreen setScreen={navigate} setSelectedWorkout={setSelectedWorkout} />;
            case 'workouts':
                return <WorkoutsScreen setScreen={navigate} setSelectedWorkout={setSelectedWorkout} />;
            case 'workout-detail':
                return <WorkoutDetailScreen workout={selectedWorkout} setScreen={navigate} setSelectedExercise={setSelectedExercise} />;
            case 'exercise-detail':
                return <ExerciseDetailScreen exercise={selectedExercise} setScreen={navigate} />;
            case 'gyms':
                return <GymsScreen setScreen={navigate} setSelectedGym={setSelectedGym} />;
            case 'gym-detail':
                return <GymDetailScreen gym={selectedGym} setScreen={navigate} />;
            case 'gym-map':
                return <GymMapScreen setScreen={navigate} setSelectedGym={setSelectedGym} />;
            case 'profile':
                return <ProfileScreen setScreen={navigate} onSignOut={() => setIsAuthenticated(false)} />;
            case 'subscription':
                return <SubscriptionScreen setScreen={navigate} />;
            case 'scan':
                return <ScanQRScreen setScreen={navigate} />;
            case 'ai-chat':
                return <AIChatScreen setScreen={navigate} setSelectedPlan={setSelectedPlan} />;
            case 'plans':
                return <PlansScreen setScreen={navigate} setSelectedPlan={setSelectedPlan} />;
            case 'plan-detail':
                return <PlanDetailScreen plan={selectedPlan} setScreen={navigate} />;
            case 'grocery-list':
                return <GroceryListScreen setScreen={navigate} />;
            case 'login':
                return <LoginScreen setScreen={navigate} onAuthSuccess={() => setIsAuthenticated(true)} />;
            default:
                return <HomeScreen setScreen={navigate} setSelectedWorkout={setSelectedWorkout} />;
        }
    };

    const showBottomNav = !['landing', 'workout-detail', 'exercise-detail', 'gym-detail', 'gym-map', 'subscription', 'scan', 'ai-chat', 'plan-detail', 'grocery-list', 'login'].includes(screen);
    const isWeb = Platform.OS === 'web';

    if (isWeb) {
        return (
            <SafeAreaProvider>
                <View className="flex-1 bg-[#020617] items-center justify-center w-full h-full">
                    {/* Phone Frame for Web */}
                    <View
                        className="bg-slate-900 overflow-hidden relative"
                        style={{
                            width: 414,
                            height: 896,
                            maxHeight: '95vh',
                            borderRadius: 40,
                            borderWidth: 12,
                            borderColor: '#1e293b',
                            ...(Platform.OS === 'web' ? {
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                            } : {
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 10 },
                                shadowOpacity: 0.5,
                                shadowRadius: 25,
                                elevation: 10
                            })
                        }}
                    >
                        {/* Notch Area */}
                        <View className="absolute top-0 left-0 right-0 h-8 bg-[#1e293b] z-50 items-center justify-center">
                            <View className="w-24 h-4 bg-slate-900 rounded-full" />
                        </View>

                        <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
                        {isOffline && (
                            <View className="bg-amber-500 px-3 py-2 items-center">
                                <Text className="text-white text-xs font-bold">You are offline. Some data may be unavailable.</Text>
                            </View>
                        )}
                        <View className="flex-1 mt-8">
                            {renderScreen()}
                        </View>
                        {showBottomNav && (
                            <BottomNav active={screen} setScreen={navigate} />
                        )}
                    </View>

                    {/* Background Glow */}
                    <View className="absolute -z-10 w-[800px] h-[800px] bg-teal-500/10 rounded-full blur-[120px]" />
                </View>
            </SafeAreaProvider>
        );
    }

    return (
        <SafeAreaProvider>
            <View className="flex-1 bg-slate-900">
                <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
                <View className="flex-1">
                    {renderScreen()}
                </View>
                {showBottomNav && <BottomNav active={screen} setScreen={navigate} />}
            </View>
        </SafeAreaProvider>
    );
}
