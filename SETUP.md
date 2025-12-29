# Setup Guide - FitZone

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Seed the Database

The database needs to be seeded with initial data. You have two options:

#### Option A: Using the Dev Utility (Recommended)

1. Open the app in development mode
2. Navigate to Profile screen
3. Look for a "Seed Database" button (if added) OR
4. Import and call the seed function from any screen:

```javascript
import { seedDatabase } from '../utils/seedDatabase';

// Call this once to populate the database
await seedDatabase();
```

#### Option B: Create a Dev Screen

Create a temporary dev screen to seed the database:

```javascript
// src/screens/DevScreen.jsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { seedDatabase } from '../utils/seedDatabase';

export default function DevScreen() {
    const handleSeed = async () => {
        try {
            const result = await seedDatabase();
            alert(`Database seeded! ${result.workouts} workouts, ${result.gyms} gyms`);
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    return (
        <View className="flex-1 bg-slate-900 items-center justify-center p-5">
            <Text className="text-white text-xl mb-4">Dev Tools</Text>
            <TouchableOpacity 
                onPress={handleSeed}
                className="bg-teal-500 px-6 py-3 rounded-lg"
            >
                <Text className="text-white font-bold">Seed Database</Text>
            </TouchableOpacity>
        </View>
    );
}
```

Then add it to your App.jsx navigation temporarily.

### 3. Run the App

```bash
npm start
```

Then press:
- `i` for iOS simulator
- `a` for Android emulator
- `w` for web browser

## What Gets Seeded?

- ✅ 6 Workouts (HIIT, Yoga, Strength, Cardio, etc.)
- ✅ 4 Gyms (Koramangala, Indiranagar, HSR, Whitefield)
- ✅ 35 Classes per gym (7 days × 5 class types)
- ✅ 1 Demo User (Rahul Sharma)
- ✅ 1 Sample Booking
- ✅ 5 Sample Check-ins

## Verify Database

After seeding, you should see:
- Workouts in the Workouts screen
- Gyms in the Gyms screen
- User stats in Home and Profile screens
- Upcoming booking in Home screen

## Troubleshooting

**"No workouts found"**
- Make sure you've seeded the database
- Check Firebase connection in `src/services/firebase.js`
- Verify Firestore rules allow read access

**"Error seeding database"**
- Check Firebase project ID is correct
- Ensure you have write permissions
- Check console for detailed error messages

**"Loading forever"**
- Check network connection
- Verify Firebase configuration
- Check Firestore rules

## Next Steps

1. ✅ Seed the database
2. ✅ Test all screens
3. ✅ Verify data loads correctly
4. ✅ Test AI recommendations
5. ✅ Test booking flow (if implemented)

## Production Notes

Before deploying:
- Update Firestore security rules
- Implement proper authentication
- Remove dev utilities
- Add environment variables for API keys
- Set up proper error logging

