# 🎯 How to Add Lottie Animations to FitZone

## 📥 Step 1: Download Lottie Files

You've provided this URL for Bicycle Crunches:
```
https://lottie.host/1a63f847-7efc-4954-8521-f35c5aa1cb5b/lEMwiFmpxa.lottie
```

### To download:
1. Open the URL in your browser
2. The `.lottie` file will download automatically
3. If it's a `.lottie` file, you may need to convert it to `.json`:
   - Go to https://lottiefiles.com/
   - Upload the `.lottie` file
   - Download as `.json` format

OR you can use the Lottie URL directly in the code (see Step 3).

## 📁 Step 2: Save the Files

Save your downloaded JSON files in:
```
src/assets/animations/
```

Naming convention:
- `bicycle-crunches.json` ✅
- `jumping-jacks.json` ✅
- `burpees.json` ✅

## 🔧 Step 3: Install Lottie Package (if not already installed)

Run this command:
```bash
npm install lottie-react-native
```

For Expo projects:
```bash
npx expo install lottie-react-native
```

## 💻 Step 4: Update the Animation Mapping

Open `src/data/exerciseAnimations.js` and update the exercise:

### Option A: Using Downloaded JSON File
```javascript
import bicycleCrunchesAnimation from '../assets/animations/bicycle-crunches.json';

export const exerciseAnimations = {
    'Bicycle Crunches': {
        type: 'lottie',
        source: bicycleCrunchesAnimation,
    },
    // ... other exercises
};
```

### Option B: Using Lottie URL Directly (Recommended for now)
```javascript
export const exerciseAnimations = {
    'Bicycle Crunches': {
        type: 'lottie',
        source: 'https://lottie.host/1a63f847-7efc-4954-8521-f35c5aa1cb5b/lEMwiFmpxa.lottie',
    },
    // ... other exercises
};
```

## 🎨 Step 5: Update WorkoutPreview Component

The component needs to support both GIFs and Lottie animations.

Update the `ExerciseRow` component in `src/components/workout/WorkoutPreview.jsx`:

```javascript
import LottieView from 'lottie-react-native';
import { getExerciseAnimation } from '../../data/exerciseAnimations';

const ExerciseRow = ({ name, subtitle }) => {
    const animation = getExerciseAnimation(name);
    
    return (
        <View className="flex-row items-center bg-slate-800/40 border border-white/5 p-3 rounded-3xl mb-4">
            <View className="w-20 h-20 bg-slate-700 rounded-2xl overflow-hidden border border-teal-500/20">
                {animation.type === 'lottie' ? (
                    <LottieView
                        source={animation.source}
                        autoPlay
                        loop
                        style={{ width: '100%', height: '100%' }}
                    />
                ) : (
                    <Image 
                        source={{ uri: animation.source }} 
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                )}
                <View className="absolute inset-0 bg-teal-500/10" />
            </View>
            
            <View className="ml-4 flex-1">
                <Text className="text-white text-lg font-bold">{name}</Text>
                <Text className="text-slate-400 text-sm">{subtitle}</Text>
            </View>
            
            <View className="mr-2">
                <Icon name="Info" size={20} color="#64748B" />
            </View>
        </View>
    );
};
```

## 📋 Quick Reference: Your Lottie URLs

Add these to `exerciseAnimations.js`:

```javascript
export const exerciseAnimations = {
    // CORE EXERCISES
    'Bicycle Crunches': {
        type: 'lottie',
        source: 'https://lottie.host/1a63f847-7efc-4954-8521-f35c5aa1cb5b/lEMwiFmpxa.lottie',
    },
    
    // Add more as you find them:
    // 'Plank Hold': {
    //     type: 'lottie',
    //     source: 'YOUR_LOTTIE_URL_HERE',
    // },
    
    // ... rest of exercises
};
```

## 🔍 Where to Find More Lottie Animations

1. **LottieFiles**: https://lottiefiles.com/search?q=fitness
2. **IconScout**: https://iconscout.com/lottie-animations/fitness
3. **Free Fitness Animations**: 
   - Search "workout animation lottie"
   - Search "exercise animation lottie"
   - Search "fitness icon lottie"

## ✅ Testing

1. Add the Lottie URL to `exerciseAnimations.js`
2. Navigate to a workout that has "Bicycle Crunches"
3. The animation should play automatically in the exercise list!

## 🐛 Troubleshooting

**Animation not showing?**
- Check if `lottie-react-native` is installed
- Verify the URL is accessible
- Check console for errors
- Try downloading the JSON and importing locally

**Animation too big/small?**
- Adjust the `style` prop in LottieView
- Use `width` and `height` properties

**Animation not looping?**
- Ensure `loop={true}` is set
- Check if `autoPlay={true}` is set
