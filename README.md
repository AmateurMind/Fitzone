# FitZone - React Native Fitness App

> ## 🔑 API Credentials (IMPORTANT - DO NOT SHARE PUBLICLY)
> | Service | Account | API Key | Credit Remaining |
> |---------|---------|---------|------------------|
> | **Deepgram** (TTS) | suhail17mohammad@gmail.com | `a3e2e9a0ce2c9d1ab9feaf94484bba3163b196d2` | $200 |
>
> ⚠️ **Note:** Move these to a `.env` file before pushing to public repositories!

A comprehensive fitness application built with React Native (Expo), featuring workout tracking, gym finder, class bookings, and AI-powered recommendations.

## 🚀 Features

- **Workout Library**: Browse and filter workouts by category, difficulty, and trainer
- **Gym Finder**: Discover nearby gyms with detailed information and amenities
- **Class Bookings**: Book fitness classes at your preferred gym
- **QR Check-in**: Quick check-in system for gym visits
- **AI Recommendations**: Intelligent workout suggestions based on your goals
- **User Profile**: Track your progress, stats, and subscription
- **Real-time Data**: Powered by Firebase Firestore

## 🛠️ Tech Stack

- **Frontend**: React Native (Expo)
- **Backend**: Firebase (Firestore, Authentication ready)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**: React Hooks
- **Icons**: Lucide React Native

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Firebase project (already configured)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Task-FitZone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Configuration**
   - Firebase is already configured in `src/services/firebase.js`
   - The project uses Firestore for data storage
   - Authentication is set up for demo purposes (can be extended)

4. **Seed the Database**
   
   Option 1: Use the seed utility from the app (recommended for React Native)
   ```javascript
   // Import in any screen or create a dev button
   import { seedDatabase } from '../utils/seedDatabase';
   
   // Call it
   await seedDatabase();
   ```
   
   Option 2: Use the Node.js script (requires Firebase Admin SDK setup)
   ```bash
   node scripts/seedDatabase.js
   ```

## 🗄️ Database Structure

The app uses Firestore with the following collections:

- **users**: User profiles, stats, and subscriptions
- **workouts**: Workout catalog with exercises and details
- **gyms**: Gym information with amenities and location
- **gyms/{gymId}/classes**: Class schedules per gym
- **bookings**: User class bookings
- **checkins**: Gym check-in history
- **ai_recommendations**: AI-generated workout recommendations

See `FIREBASE_SCHEMA.md` for detailed schema documentation.

## 📱 Running the App

```bash
# Start Expo development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on Web
npm run web
```

## 🏗️ Project Structure

```
Task-FitZone/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── cards/          # Card components (WorkoutCard, GymCard)
│   │   ├── navigation/     # Navigation components
│   │   └── ui/             # UI elements (Button, etc.)
│   ├── screens/            # Screen components
│   │   ├── HomeScreen.jsx
│   │   ├── WorkoutsScreen.jsx
│   │   ├── GymsScreen.jsx
│   │   ├── ProfileScreen.jsx
│   │   └── ...
│   ├── services/           # Backend services
│   │   ├── firebase.js     # Firebase initialization
│   │   ├── firestore.service.js  # Firestore CRUD operations
│   │   ├── auth.service.js       # Authentication
│   │   ├── workouts.service.js   # Workout operations
│   │   ├── gyms.service.js       # Gym operations
│   │   ├── bookings.service.js   # Booking operations
│   │   ├── checkins.service.js   # Check-in operations
│   │   └── ai.service.js         # AI features
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── theme/              # Theme configuration
│   └── data/               # Static data (fallback)
├── scripts/                # Utility scripts
├── App.js                  # App entry point
└── app.json                # Expo configuration
```

## 🤖 AI Features

The app includes intelligent AI-powered features:

1. **Workout Recommendations**: Personalized suggestions based on user goals and fitness level
2. **AI Trainer Chat**: Get answers to fitness questions
3. **Content Generation**: Motivational quotes and workout descriptions
4. **Performance Analysis**: Analyze workout performance and provide insights

The AI service can be extended to use real APIs (OpenAI, Gemini) by configuring API keys in `src/services/ai.service.js`.

## 🔐 Authentication

Currently uses a demo user system. To implement real authentication:

1. Install Firebase Auth: `npm install firebase`
2. Update `src/services/auth.service.js` to use Firebase Auth
3. Configure authentication providers in Firebase Console

## 📊 Code Quality Features

- ✅ Proper error handling with try-catch blocks
- ✅ Loading states for async operations
- ✅ Type-safe service layer
- ✅ Reusable components
- ✅ Clean separation of concerns
- ✅ Comprehensive service documentation
- ✅ Consistent code formatting

## 🎨 Styling

The app uses NativeWind (Tailwind CSS for React Native) for styling:
- Dark theme with slate color palette
- Teal accent color for primary actions
- Responsive design patterns
- Consistent spacing and typography

## 🧪 Testing

To test the app:

1. **Seed the database** first (see Installation section)
2. **Run the app** and navigate through screens
3. **Test features**:
   - Browse workouts and filter by category
   - Search for gyms
   - View user profile and stats
   - Test AI recommendations

## 🚀 Deployment

### Expo

```bash
# Build for production
expo build:android
expo build:ios
```

### Firebase

The Firestore database is already configured. Ensure:
- Firestore rules are set correctly (see `firestore.rules`)
- Security rules allow read access for public data
- User data is protected by authentication

## 📝 Environment Variables

Create a `.env` file for API keys (optional):

```
REACT_APP_OPENROUTER_API_KEY=your_key_here
REACT_APP_GEMINI_API_KEY=your_key_here
```

## 🤝 Contributing

1. Follow the existing code structure
2. Add proper error handling
3. Include loading states
4. Document new services/functions
5. Test thoroughly

## 📄 License

This project is created for interview/task purposes.

## 👨‍💻 Developer Notes

- The app uses a demo user system (`demo_user_123`) for development
- All data is stored in Firestore
- Services are designed to be easily extended
- AI features work with intelligent algorithms (can be upgraded to real APIs)
- Code follows React Native best practices

## 🐛 Troubleshooting

**Database not loading?**
- Ensure Firebase is properly configured
- Run the seed script to populate data
- Check Firestore rules

**App not starting?**
- Clear cache: `expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`

**Styling issues?**
- Ensure NativeWind is properly configured
- Check `tailwind.config.js`

---

Built with ❤️ using React Native and Firebase

