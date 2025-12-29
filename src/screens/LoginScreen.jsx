import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ImageBackground, Dimensions, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../components/ui/Icon';
import { auth } from '../services/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = ({ setScreen, onAuthSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Get safe area insets to position top items correctly
    const insets = useSafeAreaInsets();
    const { height } = Dimensions.get('window');

    const handleAuth = async () => {
        setError('');

        // Validation
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        if (isSignUp && password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            if (isSignUp) {
                // Create new account
                await createUserWithEmailAndPassword(auth, email, password);
                console.log('Account created successfully');
            } else {
                // Sign in
                await signInWithEmailAndPassword(auth, email, password);
                console.log('Signed in successfully');
            }

            // Navigate to home on success
            setScreen('home');
            onAuthSuccess && onAuthSuccess();
        } catch (err) {
            console.error('Auth error:', err);

            // User-friendly error messages
            switch (err.code) {
                case 'auth/email-already-in-use':
                    setError('This email is already registered. Try signing in.');
                    break;
                case 'auth/invalid-email':
                    setError('Please enter a valid email address.');
                    break;
                case 'auth/user-not-found':
                    setError('No account found with this email. Try creating one.');
                    break;
                case 'auth/wrong-password':
                    setError('Incorrect password. Please try again.');
                    break;
                case 'auth/weak-password':
                    setError('Password is too weak. Use at least 6 characters.');
                    break;
                case 'auth/network-request-failed':
                    setError('Network error. Check your connection.');
                    break;
                default:
                    setError(err.message || 'Authentication failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGuestContinue = () => {
        // Continue without authentication
        setScreen('home');
        onAuthSuccess && onAuthSuccess();
    };

    return (
        <ImageBackground
            source={require('../assets/images/welcome.png')}
            className="flex-1"
            resizeMode="cover"
        >
            {/* Dark Overlay for Readability */}
            <View className="absolute inset-0 bg-black/60" />

            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />


            {/* Main Container */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <View
                    className="flex-1 px-6 justify-center"
                    style={{
                        paddingTop: insets.top + 20,
                        paddingBottom: insets.bottom + 20
                    }}
                >
                    {/* Back Button */}
                    <TouchableOpacity
                        accessibilityLabel="Back to landing"
                        onPress={() => setScreen('landing')}
                        className="absolute left-6 w-10 h-10 bg-slate-800/50 rounded-full items-center justify-center backdrop-blur-md border border-white/10"
                        style={{ top: insets.top + 20 }}
                    >
                        <Icon name="ArrowLeft" size={20} color="white" />
                    </TouchableOpacity>

                    {/* Content Container - Centered */}
                    <View className="w-full max-w-sm self-center">
                        {/* Header */}
                        <View className="mb-8">
                            <Text className="text-white text-3xl font-extrabold mb-2 tracking-tight">
                                {isSignUp ? 'Create Account' : 'Welcome back'}
                            </Text>
                            <Text className="text-slate-300 text-base">
                                {isSignUp ? 'Sign up to get started' : 'Sign in to continue'}
                            </Text>
                        </View>

                        {/* Error Message */}
                        {error ? (
                            <View className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 mb-4 backdrop-blur-sm">
                                <Text className="text-red-300 text-sm text-center font-medium">{error}</Text>
                            </View>
                        ) : null}

                        {/* Form Inputs */}
                        <View className="gap-4">
                            {/* Email */}
                            <View>
                                <Text className="text-slate-300 text-xs font-bold mb-1.5 uppercase tracking-wide ml-1">Email</Text>
                                <View className="bg-slate-900/60 rounded-2xl border border-white/10 backdrop-blur-md">
                                    <TextInput
                                        placeholder="you@example.com"
                                        placeholderTextColor="#94A3B8"
                                        className="text-white text-base px-4 py-3.5"
                                        style={{ color: 'white' }}
                                        value={email}
                                        onChangeText={(text) => {
                                            setEmail(text);
                                            setError('');
                                        }}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoComplete="email"
                                    />
                                </View>
                            </View>

                            {/* Password */}
                            <View>
                                <Text className="text-slate-300 text-xs font-bold mb-1.5 uppercase tracking-wide ml-1">Password</Text>
                                <View className="bg-slate-900/60 rounded-2xl border border-white/10 backdrop-blur-md">
                                    <TextInput
                                        placeholder="••••••••"
                                        placeholderTextColor="#94A3B8"
                                        className="text-white text-base px-4 py-3.5"
                                        style={{ color: 'white' }}
                                        value={password}
                                        onChangeText={(text) => {
                                            setPassword(text);
                                            setError('');
                                        }}
                                        secureTextEntry
                                        autoComplete="password"
                                    />
                                </View>
                            </View>

                            {/* Confirm Password (only for Sign Up) */}
                            {isSignUp && (
                                <View>
                                    <Text className="text-slate-300 text-xs font-bold mb-1.5 uppercase tracking-wide ml-1">Confirm Password</Text>
                                    <View className="bg-slate-900/60 rounded-2xl border border-white/10 backdrop-blur-md">
                                        <TextInput
                                            placeholder="••••••••"
                                            placeholderTextColor="#94A3B8"
                                            className="text-white text-base px-4 py-3.5"
                                            style={{ color: 'white' }}
                                            value={confirmPassword}
                                            onChangeText={(text) => {
                                                setConfirmPassword(text);
                                                setError('');
                                            }}
                                            secureTextEntry
                                        />
                                    </View>
                                </View>
                            )}
                        </View>

                        {/* Auth Button */}
                        <TouchableOpacity
                            onPress={handleAuth}
                            disabled={loading}
                            accessibilityLabel={isSignUp ? 'Create account' : 'Sign in'}
                            className={`${Platform.OS === 'web' ? 'mt-8' : 'mt-24'} py-4 rounded-2xl items-center flex-row justify-center gap-2 ${loading ? 'bg-teal-500/50' : 'bg-teal-500'
                                }`}
                            style={Platform.OS === 'web' ? {
                                boxShadow: '0 4px 10px rgba(20, 184, 166, 0.3)',
                            } : {
                                shadowColor: '#14B8A6',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 10,
                                elevation: 5,
                            }}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <View className="flex-row items-center gap-2">
                                    <Icon name={isSignUp ? 'User' : 'LogIn'} size={20} color="white" />
                                    <Text className="text-white font-bold text-base tracking-wide">
                                        {isSignUp ? 'Create Account' : 'Sign In'}
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>

                        {/* Toggle Sign Up / Sign In */}
                        <TouchableOpacity
                            onPress={() => {
                                setIsSignUp(!isSignUp);
                                setError('');
                                setConfirmPassword('');
                            }}
                            className="mt-4 py-2 items-center"
                        >
                            <Text className="text-slate-300">
                                {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                                <Text className="text-teal-400 font-bold">
                                    {isSignUp ? 'Sign In' : 'Sign Up'}
                                </Text>
                            </Text>
                        </TouchableOpacity>

                        {/* Divider */}
                        <View className="flex-row items-center my-6 opacity-30">
                            <View className="flex-1 h-px bg-white" />
                            <Text className="text-white/50 px-4 text-xs font-semibold uppercase tracking-wider">or</Text>
                            <View className="flex-1 h-px bg-white" />
                        </View>

                        {/* Guest Button - Compact */}
                        <TouchableOpacity
                            onPress={handleGuestContinue}
                            accessibilityLabel="Continue as guest"
                            className="py-3.5 rounded-2xl items-center border border-white/10 bg-white/5"
                        >
                            <Text className="text-slate-300 font-semibold text-sm">Continue as Guest</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
};

export default LoginScreen;
