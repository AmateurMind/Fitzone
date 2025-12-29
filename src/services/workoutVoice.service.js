/**
 * Workout Voice Cues
 * Short, motivational voice prompts using Eleven Labs
 * Designed for minimal distraction, maximum motivation
 */

import { textToSpeech } from './voice.service';

// Eleven Labs Voice Settings for workout cues
const WORKOUT_VOICE_SETTINGS = {
    stability: 0.8,        // More consistent
    similarity_boost: 0.7, // Natural sounding
    style: 0.3,            // Slight energy
    volume: 0.4            // Low volume - not intrusive
};

// Cue Categories with variations
const WORKOUT_CUES = {
    // Workout Start
    start: [
        "Let's go.",
        "Time to work.",
        "Let's do this.",
        "Ready. Set. Go."
    ],

    // Exercise Beginning
    exerciseStart: [
        "Go.",
        "Begin.",
        "Start now.",
        "Here we go."
    ],

    // Mid-Exercise Encouragement
    encouragement: [
        "You're doing great.",
        "Keep it up.",
        "Nice work.",
        "Stay strong.",
        "Push through.",
        "Almost there."
    ],

    // Set/Exercise Completed
    setComplete: [
        "Set complete.",
        "Done.",
        "Nice.",
        "Good work.",
        "Excellent."
    ],

    // Rest Period
    rest: [
        "Rest now.",
        "Take a breath.",
        "Recover.",
        "Breathe."
    ],

    // Countdown Cues
    countdown: {
        10: "Ten seconds.",
        5: "Five.",
        3: "Three.",
        2: "Two.",
        1: "One."
    },

    // Halfway Point
    halfway: [
        "Halfway there.",
        "Half done.",
        "Keep going."
    ],

    // Final Push
    finalPush: [
        "Last one.",
        "Final push.",
        "Finish strong.",
        "Give it all."
    ],

    // Workout Complete
    complete: [
        "Workout complete.",
        "You did it.",
        "Great job.",
        "Amazing work."
    ]
};

// Track last played cue to avoid repetition
let lastPlayedCues = {};

/**
 * Get a random cue from a category (avoiding recent repeats)
 */
const getRandomCue = (category) => {
    const cues = WORKOUT_CUES[category];
    if (!cues || !Array.isArray(cues)) return null;

    const lastPlayed = lastPlayedCues[category] || -1;
    let index;

    // Avoid repeating the same cue
    do {
        index = Math.floor(Math.random() * cues.length);
    } while (index === lastPlayed && cues.length > 1);

    lastPlayedCues[category] = index;
    return cues[index];
};

/**
 * Play a workout voice cue
 * @param {string} category - Cue category (start, encouragement, etc.)
 * @param {string} customText - Optional custom text override
 * @returns {Promise<void>}
 */
export const playWorkoutCue = async (category, customText = null) => {
    try {
        const text = customText || getRandomCue(category);
        if (!text) return;

        console.log(`[Voice Cue] ${category}: "${text}"`);

        const result = await textToSpeech(text, WORKOUT_VOICE_SETTINGS);

        // If result is 'completed', it was native TTS and already finished
        if (result === 'completed') {
            // Add a small gap after native speech
            await new Promise(resolve => setTimeout(resolve, 800));
            return;
        }

        // Only try to play if we got a valid audio URL (blob: or http:)
        if (result && typeof window !== 'undefined' &&
            (result.startsWith('blob:') || result.startsWith('http'))) {

            return new Promise((resolve) => {
                const audio = new Audio(result);
                audio.volume = WORKOUT_VOICE_SETTINGS.volume;

                audio.onended = () => {
                    // Small gap after audio finishes
                    setTimeout(resolve, 800);
                };

                audio.onerror = (e) => {
                    console.warn('Audio playback error:', e);
                    resolve();
                };

                audio.play().catch(error => {
                    console.warn('Audio play failed:', error);
                    resolve();
                });
            });
        }
    } catch (error) {
        console.error('Voice cue error:', error);
        // Silently fail - don't interrupt workout
    }
};

/**
 * Play countdown cue
 * @param {number} seconds - Seconds remaining
 */
export const playCountdownCue = async (seconds) => {
    const cue = WORKOUT_CUES.countdown[seconds];
    if (cue) {
        await playWorkoutCue('countdown', cue);
    }
};

/**
 * Workout Voice Controller
 * Manages cue timing and frequency to avoid overwhelming user
 */
class WorkoutVoiceController {
    constructor() {
        this.isEnabled = true;
        this.lastCueTime = 0;
        this.minCueInterval = 8000; // Minimum 8 seconds between cues
        this.exerciseCount = 0;
        this.encouragementCount = 0;
    }

    /**
     * Check if enough time has passed for a new cue
     */
    canPlayCue() {
        if (!this.isEnabled) return false;
        const now = Date.now();
        if (now - this.lastCueTime < this.minCueInterval) return false;
        this.lastCueTime = now;
        return true;
    }

    /**
     * Called when workout starts
     */
    async onWorkoutStart() {
        this.exerciseCount = 0;
        this.encouragementCount = 0;
        await playWorkoutCue('start');
    }

    /**
     * Called when an exercise begins
     */
    async onExerciseStart(exerciseName) {
        this.exerciseCount++;
        // Only announce every 2nd or 3rd exercise to reduce voice fatigue
        if (this.exerciseCount <= 2 || this.exerciseCount % 2 === 0) {
            await playWorkoutCue('exerciseStart');
        }
    }

    /**
     * Called periodically during exercise (e.g., every 15-20 seconds)
     */
    async onMidExercise(progress) {
        if (!this.canPlayCue()) return;

        // Play encouragement sparingly
        this.encouragementCount++;
        if (this.encouragementCount % 3 === 0) {
            await playWorkoutCue('encouragement');
        }
    }

    /**
     * Called when exercise is halfway done
     */
    async onHalfway() {
        if (this.canPlayCue()) {
            await playWorkoutCue('halfway');
        }
    }

    /**
     * Called when exercise/set is completed
     */
    async onSetComplete() {
        await playWorkoutCue('setComplete');
    }

    /**
     * Called when rest period starts
     */
    async onRestStart() {
        await playWorkoutCue('rest');
    }

    /**
     * Called for final push (last 10 seconds or last rep)
     */
    async onFinalPush() {
        await playWorkoutCue('finalPush');
    }

    /**
     * Called when entire workout is complete
     */
    async onWorkoutComplete() {
        await playWorkoutCue('complete');
    }

    /**
     * Countdown cues (10, 5, 3, 2, 1)
     */
    async onCountdown(seconds) {
        if ([10, 5, 3, 2, 1].includes(seconds)) {
            await playCountdownCue(seconds);
        }
    }

    /**
     * Enable/disable voice cues
     */
    setEnabled(enabled) {
        this.isEnabled = enabled;
    }

    /**
     * Reset for new workout
     */
    reset() {
        this.exerciseCount = 0;
        this.encouragementCount = 0;
        this.lastCueTime = 0;
        lastPlayedCues = {};
    }
}

// Export singleton instance
export const workoutVoice = new WorkoutVoiceController();

// Quick access functions
export const voiceCue = {
    start: () => workoutVoice.onWorkoutStart(),
    exerciseStart: (name) => workoutVoice.onExerciseStart(name),
    halfway: () => workoutVoice.onHalfway(),
    setComplete: () => workoutVoice.onSetComplete(),
    rest: () => workoutVoice.onRestStart(),
    finalPush: () => workoutVoice.onFinalPush(),
    complete: () => workoutVoice.onWorkoutComplete(),
    countdown: (s) => workoutVoice.onCountdown(s),
    encourage: (p) => workoutVoice.onMidExercise(p),
    enable: (v) => workoutVoice.setEnabled(v),
    reset: () => workoutVoice.reset()
};

export default workoutVoice;

