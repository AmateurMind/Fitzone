import { playSoundEffect } from './soundEffects.service';

/**
 * Voice Service
 * AI-powered voice features using Deepgram Aura TTS API
 * Provides text-to-speech, sound effects, and voice coaching
 */

let soundEffectsEnabled = true;

export const isSoundEffectsEnabled = () => soundEffectsEnabled;
export const setSoundEffectsEnabled = (enabled) => {
    soundEffectsEnabled = enabled;
};

// Deepgram API Configuration
// Get your API key from: https://deepgram.com/
const DEEPGRAM_API_KEY = process.env.EXPO_PUBLIC_DEEPGRAM_API_KEY;
const DEEPGRAM_TTS_URL = 'https://api.deepgram.com/v1/speak';
// Available Aura voices: aura-asteria-en (female), aura-luna-en (female), aura-stella-en (female),
// aura-athena-en (female), aura-hera-en (female), aura-orion-en (male), aura-arcas-en (male),
// aura-perseus-en (male), aura-angus-en (male - Scottish), aura-orpheus-en (male)
const DEEPGRAM_VOICE = 'aura-perseus-en'; // Clear male voice
const USE_DEEPGRAM = DEEPGRAM_API_KEY && DEEPGRAM_API_KEY !== 'YOUR_DEEPGRAM_API_KEY';

/**
 * Generate text-to-speech audio using Deepgram Aura
 * @param {string} text - Text to convert to speech
 * @param {Object} options - Voice options
 * @returns {Promise<string>} Audio URL or blob
 */
export const textToSpeech = async (text, options = {}) => {
    // Use Deepgram if API key is configured
    if (USE_DEEPGRAM) {
        try {
            const voice = options.voice || DEEPGRAM_VOICE;

            const response = await fetch(
                `${DEEPGRAM_TTS_URL}?model=${voice}`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Token ${DEEPGRAM_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        text: text
                    })
                }
            );

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    console.warn('Deepgram API Key unauthorized. Falling back to native TTS.');
                    throw new Error('Unauthorized');
                }
                throw new Error(`Deepgram API error: ${response.status}`);
            }

            // Return audio blob URL
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            return audioUrl;
        } catch (error) {
            console.warn('Deepgram TTS failed, using fallback:', error.message);
            // Fall through to fallback
            return fallbackTextToSpeech(text);
        }
    }

    // Fallback to Web Speech API
    return fallbackTextToSpeech(text);
};

/**
 * Fallback to Web Speech API (browser native)
 * Returns a promise that resolves when speech completes
 */
const fallbackTextToSpeech = (text) => {
    return new Promise((resolve, reject) => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9; // Slightly slower for better clarity
            utterance.pitch = 1.0;
            utterance.volume = 1.0;

            utterance.onend = () => resolve('completed');
            utterance.onerror = (error) => {
                console.error('Speech synthesis error:', error);
                resolve('completed'); // Resolve anyway to not block
            };

            window.speechSynthesis.speak(utterance);
        } else {
            // If speech synthesis not available, just resolve
            console.warn('Speech synthesis not available, skipping audio');
            resolve('completed');
        }
    });
};

/**
 * Generate workout instruction audio
 * @param {string} instruction - Workout instruction text
 * @param {string} type - 'countdown' | 'exercise' | 'rest' | 'complete'
 * @returns {Promise<string>} Audio URL
 */
export const generateWorkoutInstruction = async (instruction, type = 'exercise') => {
    try {
        let enhancedText = instruction;

        // Enhance text based on type
        switch (type) {
            case 'countdown':
                enhancedText = `Get ready! ${instruction}`;
                break;
            case 'exercise':
                enhancedText = `Next exercise: ${instruction}. Let's do this!`;
                break;
            case 'rest':
                enhancedText = `Great work! ${instruction}. Take a moment to breathe.`;
                break;
            case 'complete':
                enhancedText = `Amazing! ${instruction}. You crushed it!`;
                break;
        }

        return await textToSpeech(enhancedText);
    } catch (error) {
        console.error('Error generating workout instruction:', error);
        throw error;
    }
};

/**
 * Generate AI-powered motivational message
 */
export const generateMotivationalAudio = async (context = {}) => {
    try {
        const { progress = 0, timeRemaining = 0, exerciseName = '' } = context;

        let message = '';

        const exerciseBoost = exerciseName ? `Let's nail ${exerciseName}!` : "You've got this!";
        const encouragement = exerciseName ? `Great work on ${exerciseName}!` : 'Stay strong!';
        const finalPush = timeRemaining > 0 ? `Just ${Math.ceil(timeRemaining)} more seconds!` : 'One more push!';

        if (progress < 0.3) {
            message = `You're just getting started! ${exerciseBoost}`;
        } else if (progress < 0.7) {
            message = `You're halfway there! Keep pushing! ${encouragement}`;
        } else if (progress < 0.9) {
            message = `Almost there! You're crushing it! ${finalPush}`;
        } else {
            message = `Final push! Give it everything you've got! You're almost done!`;
        }

        return await textToSpeech(message);
    } catch (error) {
        console.error('Error generating motivational audio:', error);
        throw error;
    }
};

/**
 * Generate countdown audio
 */
export const generateCountdownAudio = async (seconds = 3) => {
    try {
        const audioPromises = [];

        for (let i = seconds; i > 0; i--) {
            const text = i === 1 ? 'Go!' : i.toString();
            audioPromises.push(textToSpeech(text));
        }

        return await Promise.all(audioPromises);
    } catch (error) {
        console.error('Error generating countdown audio:', error);
        throw error;
    }
};

/**
 * Generate workout completion audio
 */
export const generateCompletionAudio = async (workoutData) => {
    try {
        const { duration, calories, workoutName } = workoutData;

        let message = `Congratulations! You completed ${workoutName || 'your workout'}! `;
        message += `You worked out for ${duration} minutes and burned approximately ${calories} calories. `;
        message += `That's incredible! Take a moment to celebrate your achievement. You're getting stronger every day!`;

        return await textToSpeech(message);
    } catch (error) {
        console.error('Error generating completion audio:', error);
        throw error;
    }
};

/**
 * UI Click Sound Placeholder
 */
export const playUIClick = async () => {
    if (soundEffectsEnabled) {
        // Use a short, high-pitched beep for UI clicks
        await playSoundEffect('countdown1', 0.5);
    }
};

/**
 * Soothing Sound Placeholder
 */
export const playSoothingSound = async () => {
    // Already handled in soundEffects service
    return Promise.resolve();
};

/**
 * Start browser native speech recognition
 */
export const startNativeRecognition = (onResult, onError) => {
    if (typeof window === 'undefined') return null;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        if (onError) onError(new Error('Speech recognition not supported in this browser.'));
        return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');

        if (onResult) onResult(transcript, event.results[0].isFinal);
    };

    recognition.onerror = (event) => {
        console.error('Native STT Error:', event.error);
        if (onError) onError(event.error);
    };

    recognition.start();
    return recognition;
};

