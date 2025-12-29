# Exercise Detail Feature - Implementation Plan

## 🎯 Goal
Make exercise items clickable and create a detailed exercise page with YouTube videos or AI-generated images using Gemini Nano.

## 📋 Current State
- Exercises are displayed as non-clickable list items in `WorkoutDetailScreen.jsx`
- Exercises shown: Warm Up, Jumping Jacks, Squats, Push Ups, Burpees, Plank Hold, Cool Down
- Currently just text with duration/reps, no interactivity

## 🚀 Implementation Plan

### Phase 1: Make Exercises Clickable ✅
**File:** `src/screens/WorkoutDetailScreen.jsx`
- Convert exercise `View` components to `TouchableOpacity`
- Add `onPress` handler to navigate to exercise detail screen
- Pass exercise data to detail screen

### Phase 2: Create Exercise Detail Screen ✅
**New File:** `src/screens/ExerciseDetailScreen.jsx`

**Features:**
1. **Header Section**
   - Exercise name (large, bold)
   - Exercise type badge (Cardio/Strength/Core/Warmup/Cooldown)
   - Back button

2. **Media Section**
   - YouTube video embed (primary)
   - Fallback: AI-generated image using Gemini Nano
   - Loading state while fetching

3. **Exercise Information**
   - Duration/Reps
   - Target muscles
   - Equipment needed
   - Difficulty level
   - Calories burned estimate

4. **Instructions Section**
   - Step-by-step instructions
   - Form tips
   - Common mistakes to avoid

5. **Action Buttons**
   - "Watch on YouTube" (opens external link)
   - "Start Exercise" (if part of active workout)
   - "Add to Favorites"

### Phase 3: YouTube Integration ✅
**New File:** `src/services/youtube.service.js`

**Functions:**
- `searchExerciseVideo(exerciseName)` - Search YouTube API for exercise videos
- `getBestVideo(exerciseName)` - Get top-rated/relevant video
- Store video IDs in cache/localStorage

**YouTube Data API v3:**
- Search endpoint: `https://www.googleapis.com/youtube/v3/search`
- Query format: `"{exerciseName} exercise tutorial form"`
- Filter: video type, relevance, duration
- Return: video ID, title, thumbnail, duration

### Phase 4: Gemini Nano Image Generation ✅
**New File:** `src/services/gemini.service.js`

**Functions:**
- `generateExerciseImage(exerciseName, instructions)` - Generate image using Gemini Nano
- Fallback when YouTube unavailable
- Cache generated images

**Gemini Nano Integration:**
- Use Google Gemini API for image generation
- Prompt: "Generate a clear, instructional image showing proper form for {exerciseName}"
- Store image URLs in cache

### Phase 5: Exercise Data Service ✅
**New File:** `src/services/exercises.service.js`

**Exercise Database:**
```javascript
const exerciseDatabase = {
  "Jumping Jacks": {
    muscles: ["Full Body", "Cardio"],
    equipment: ["None"],
    difficulty: "Beginner",
    instructions: [...],
    youtubeQuery: "jumping jacks exercise tutorial",
    caloriesPerMinute: 8
  },
  "Squats": {
    muscles: ["Quadriceps", "Glutes", "Hamstrings"],
    equipment: ["None", "Dumbbells (optional)"],
    difficulty: "Beginner",
    instructions: [...],
    youtubeQuery: "squats exercise form tutorial",
    caloriesPerMinute: 5
  },
  // ... more exercises
}
```

### Phase 6: Navigation Integration ✅
**File:** `src/App.jsx`
- Add `exercise-detail` screen route
- Add `selectedExercise` state
- Update navigation flow

### Phase 7: UI/UX Enhancements ✅
- Smooth transitions
- Loading skeletons
- Error handling (no video/image found)
- Offline support (cached images/videos)

## 📁 Files to Create/Modify

### New Files:
1. `src/screens/ExerciseDetailScreen.jsx` - Main exercise detail page
2. `src/services/youtube.service.js` - YouTube API integration
3. `src/services/gemini.service.js` - Gemini Nano image generation
4. `src/services/exercises.service.js` - Exercise database & metadata

### Files to Modify:
1. `src/screens/WorkoutDetailScreen.jsx` - Make exercises clickable
2. `src/App.jsx` - Add navigation route
3. `src/components/ui/Icon.jsx` - Add YouTube icon if needed

## 🔧 Technical Details

### YouTube API Setup:
- API Key: Get from Google Cloud Console
- Enable YouTube Data API v3
- Search query: `{exerciseName} exercise tutorial proper form`
- Filter: maxResults: 1, type: 'video', videoDuration: 'short'

### Gemini Nano Setup:
- API Key: Get from Google AI Studio
- Model: `gemini-pro-vision` or `gemini-1.5-flash`
- Image generation via text-to-image
- Cache images locally

### Exercise Data Structure:
```javascript
{
  name: "Jumping Jacks",
  type: "cardio",
  duration: "60 sec",
  reps: null,
  muscles: ["Full Body"],
  equipment: ["None"],
  difficulty: "Beginner",
  instructions: [
    "Stand with feet together and arms at sides",
    "Jump up, spreading legs shoulder-width apart",
    "Simultaneously raise arms overhead",
    "Jump back to starting position",
    "Repeat for duration"
  ],
  tips: [
    "Keep core engaged",
    "Land softly on balls of feet",
    "Maintain steady breathing"
  ],
  youtubeVideoId: "abc123xyz",
  imageUrl: "https://..."
}
```

## 🎨 UI Design Mockup

```
┌─────────────────────────┐
│  ←  Jumping Jacks       │
│     [Cardio]            │
├─────────────────────────┤
│                         │
│   [YouTube Video]       │
│   or [AI Image]         │
│                         │
├─────────────────────────┤
│ Duration: 60 sec        │
│ Muscles: Full Body      │
│ Equipment: None         │
├─────────────────────────┤
│ Instructions:           │
│ 1. Stand with feet...   │
│ 2. Jump up spreading... │
│                         │
├─────────────────────────┤
│ [Watch on YouTube]      │
│ [Start Exercise]        │
└─────────────────────────┘
```

## ✅ Implementation Checklist

- [ ] Phase 1: Make exercises clickable
- [ ] Phase 2: Create ExerciseDetailScreen  
- [ ] Phase 3: YouTube integration
- [ ] Phase 4: Gemini Nano integration
- [ ] Phase 5: Exercise data service
- [ ] Phase 6: Navigation setup
- [ ] Phase 7: UI polish & error handling
- [ ] Testing: All exercises clickable
- [ ] Testing: Videos/images load correctly
- [ ] Testing: Fallback mechanisms work

## 🚦 Ready to Start?
When you're ready, I'll implement this feature step by step. Just say "start" or "implement" and I'll begin!

