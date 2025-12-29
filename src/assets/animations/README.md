# Exercise Lottie Animations

This folder contains Lottie animation files (.json) for exercise previews in the FitZone app.

## 📁 Structure

Place your Lottie animation JSON files here with descriptive names:

```
animations/
├── jumping-jacks.json
├── burpees.json
├── mountain-climbers.json
├── squats.json
├── push-ups.json
├── plank-hold.json
├── bicycle-crunches.json
├── russian-twists.json
├── leg-raises.json
├── high-knees.json
├── lunges.json
├── tricep-dips.json
├── bicep-curls.json
├── shoulder-press.json
├── dumbbell-press.json
└── ... (add more as needed)
```

## 🎨 Where to Find Lottie Animations

1. **LottieFiles** - https://lottiefiles.com/
   - Search for "fitness", "workout", "exercise"
   - Download as JSON

2. **Free Resources**:
   - https://lottiefiles.com/featured
   - https://iconscout.com/lottie-animations
   - https://lordicon.com/

## 💡 Usage in Code

Once you add the JSON files here, import them like this:

```javascript
import jumpingJacksAnimation from '../../assets/animations/jumping-jacks.json';
import LottieView from 'lottie-react-native';

// In your component:
<LottieView
    source={jumpingJacksAnimation}
    autoPlay
    loop
    style={{ width: 80, height: 80 }}
/>
```

## 📝 Naming Convention

- Use **lowercase** with **hyphens** (kebab-case)
- Be descriptive: `exercise-name.json`
- Examples:
  - ✅ `jumping-jacks.json`
  - ✅ `bicycle-crunches.json`
  - ❌ `JumpingJacks.json`
  - ❌ `jj.json`

## 🚀 Next Steps

1. Download Lottie animations from LottieFiles
2. Place them in this folder
3. Update the exercise mapping in `exerciseAnimations.js`
4. The animations will automatically appear in WorkoutPreview!
