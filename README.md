# FitZone — AI-Powered Fitness Ecosystem 🚀

FitZone is a high-performance React Native (Expo) application designed to bridge the gap between physical fitness and artificial intelligence. Built for professional-grade performance and scalability, it features real-time workout tracking, an intelligent gym finder, and a personalized AI trainer.

## 📱 Core Features

### 🤖 Intelligent AI Trainer (FitBot)
- **Personalized Planning**: Generates 7-day workout and diet plans using the **OpenRouter (mimo-v2-flash)** model.
- **Smart Recommendations**: Analyzes user goals (fat loss, muscle gain) to recommend specific high-intensity interval training (HIIT) or strength sessions.
- **Contextual Support**: A real-time chat interface for fitness advice, nutrition tips, and form correction.

### 🏋️ Seamless Gym Experience
- **Interactive Finder**: Integrated Google Maps for locating nearby fitness centers.
- **Dynamic Booking**: Real-time class availability and booking system.
- **Hybrid Data Architecture**: Uses Firebase Firestore for production data with localized fallback mechanisms for high availability.

### 🎙️ Immersive Voice Coaching
- **Aura Voice Integration**: Powered by **Deepgram TTS** to provide real-time motivational cues and countdowns during workouts.
- **Interactive Audio**: Real-time voice feedback and professional sound effects triggered on button presses and UI interactions.
- **Dynamic Soundscapes**: Professional audio feedback for countdowns, completions, and navigation.

---

## 🏗️ Technical Architecture

### **Tech Stack**
- **Frontend**: React Native (Expo SDK 51/52)
- **Backend/DB**: Firebase Firestore
- **Styling**: NativeWind (Tailwind CSS) for responsive, multi-platform UI
- **AI Engine**: OpenRouter API (Accessing cutting-edge LLMs)
- **Audio/Voice**: Deepgram Aura TTS & Expo Audio
- **Maps**: Google Maps Platform (JavaScript API for Web)

### **Key Design Patterns**
- **Service-Oriented Architecture**: Clean separation between UI and business logic (Firestore, AI, Voice, and Workout services).
- **Environment Security**: Robust secret management using `.env` for all API credentials.
- **Responsive Theme Engine**: Custom color tokens in `tailwind.config.js` for a premium dark-mode aesthetic.

---

## 🔧 Installation & Setup

1. **Clone & Install**
   ```bash
   git clone https://github.com/AmateurMind/Fitzone.git
   cd Fitzone
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root with your credentials:
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=...
   EXPO_PUBLIC_OPENROUTER_API_KEY=...
   EXPO_PUBLIC_DEEPGRAM_API_KEY=...
   EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=...
   ```

3. **Launch**
   ```bash
   npm start
   # or
   npx expo start
   ```

## 👨‍💻 Author
Developed by **AmateurMind** for professional internship evaluation. Focused on clean code, security best practices, and innovative AI integration.
