# FitZone - Product Requirements Document (PRD)

## 1. Product Overview

### 1.1 Product Name
**FitZone** - AI-Powered Fitness & Gym Management Mobile Application

### 1.2 Product Vision
FitZone is a comprehensive fitness application that connects users with gyms, provides AI-powered workout recommendations, and enables seamless gym booking and check-in experiences. The app focuses on the Viman Nagar, Pune area with real gym locations and intelligent fitness guidance.

### 1.3 Target Audience
- Fitness enthusiasts in Viman Nagar, Pune
- Users seeking personalized workout recommendations
- People looking for nearby gyms with booking capabilities
- Beginners to advanced fitness levels

---

## 2. Technical Stack

### 2.1 Frontend
- **Framework**: React Native with Expo
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Platform Support**: iOS, Android, Web
- **State Management**: React Hooks

### 2.2 Backend
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth (Demo user system)
- **API Integration**: 
  - OpenRouter API (AI features)
  - Google Maps API (Location services)

### 2.3 Key Libraries
- `react-native-maps` - Map integration
- `react-native-safe-area-context` - Safe area handling
- `firebase` - Backend services
- `nativewind` - Styling

---

## 3. Core Features

### 3.1 Home Screen
**Priority**: High

**Requirements**:
- Display user greeting with personalized name
- Show user statistics (Workouts completed, Calories burned, Streak)
- Quick action buttons (Start Workout, Book Class)
- Continue workout section with progress indicator
- Featured workouts carousel
- **AI Recommendation Card** - Personalized workout suggestions
- Upcoming class booking display

**User Stories**:
- As a user, I want to see my fitness stats at a glance
- As a user, I want quick access to start a workout
- As a user, I want AI-recommended workouts based on my goals

**Acceptance Criteria**:
- Stats load from Firestore
- AI recommendations appear within 3 seconds
- All buttons are clickable and navigate correctly
- Responsive design on all screen sizes

---

### 3.2 Workouts Screen
**Priority**: High

**Requirements**:
- Display all available workouts
- Search functionality (by name, category)
- Filter by:
  - Category (HIIT, Yoga, Strength, Cardio)
  - Difficulty (Beginner, Intermediate, Advanced)
  - Duration
- Workout cards showing:
  - Title, Trainer, Duration
  - Calories, Difficulty
  - Category badge
  - Gradient background

**User Stories**:
- As a user, I want to browse all available workouts
- As a user, I want to search for specific workouts
- As a user, I want to filter workouts by my preferences

**Acceptance Criteria**:
- All workouts load from Firestore
- Search works in real-time
- Filters apply correctly
- Cards are responsive and clickable

---

### 3.3 Workout Detail Screen
**Priority**: High

**Requirements**:
- Full workout information
- Exercise list with:
  - Exercise name
  - Duration/Reps
  - Exercise type
- Start workout button
- Back navigation

**User Stories**:
- As a user, I want to see detailed workout information
- As a user, I want to know what exercises are included

**Acceptance Criteria**:
- All workout details display correctly
- Exercise list is scrollable
- Navigation works properly

---

### 3.4 Gyms Screen
**Priority**: High

**Requirements**:
- List all gyms in Viman Nagar, Pune
- Search functionality
- Filter by:
  - Tier (Elite, Pro)
  - Amenities (Parking, Pool, etc.)
- Gym cards showing:
  - Name, Location, Distance
  - Rating, Tier badge
  - Amenities list
- "View Map" button

**User Stories**:
- As a user, I want to find gyms near me
- As a user, I want to see gym details and amenities
- As a user, I want to view gyms on a map

**Acceptance Criteria**:
- All 10 Viman Nagar gyms are displayed
- Search filters gyms correctly
- Map button navigates to map view
- Cards are responsive

---

### 3.5 Gym Map Screen
**Priority**: High

**Requirements**:
- Interactive Google Maps view
- Show all gym locations with markers
- Center on Viman Nagar, Pune (18.5679, 73.9144)
- Clickable markers with gym info
- List view below map
- Back navigation

**User Stories**:
- As a user, I want to see gym locations on a map
- As a user, I want to click markers to see gym details
- As a user, I want to navigate to gym detail from map

**Acceptance Criteria**:
- Map loads and displays all gyms
- Markers are clickable
- Map centers correctly on Viman Nagar
- Works on both web and mobile
- Responsive layout

---

### 3.6 Gym Detail Screen
**Priority**: Medium

**Requirements**:
- Full gym information
- Address, Phone, Hours
- Amenities list
- Rating and tier
- Class schedule
- Book class button

**User Stories**:
- As a user, I want to see complete gym information
- As a user, I want to book a class at a gym

**Acceptance Criteria**:
- All gym details display correctly
- Class schedule is visible
- Booking functionality works

---

### 3.7 AI Chat Screen
**Priority**: High

**Requirements**:
- Chat interface with AI fitness trainer
- Real-time AI responses using OpenRouter API
- Message history
- Input field with send button
- Loading indicators
- Error handling

**User Stories**:
- As a user, I want to ask fitness questions
- As a user, I want AI-powered fitness advice
- As a user, I want conversation history

**Acceptance Criteria**:
- Chat interface is responsive
- AI responses are generated within 5 seconds
- Messages display correctly
- Error messages are user-friendly
- Works on all platforms

---

### 3.8 AI Workout Recommendations
**Priority**: High

**Requirements**:
- AI-powered workout recommendations
- Based on user goals and fitness level
- Display on Home screen
- Personalized reasoning
- Tips and suggestions
- Clickable to view workout details

**User Stories**:
- As a user, I want personalized workout recommendations
- As a user, I want to understand why a workout is recommended

**Acceptance Criteria**:
- Recommendations load within 3 seconds
- Recommendations are relevant to user profile
- Card is clickable and navigates correctly
- Fallback if AI fails

---

### 3.9 Profile Screen
**Priority**: Medium

**Requirements**:
- User profile information
- Fitness statistics
- Subscription status
- Settings options
- Logout functionality

**User Stories**:
- As a user, I want to see my profile
- As a user, I want to view my fitness progress

**Acceptance Criteria**:
- Profile data loads from Firestore
- Stats are accurate
- Navigation works

---

### 3.10 QR Code Scanner
**Priority**: Medium

**Requirements**:
- QR code scanning for gym check-in
- Camera access
- Check-in confirmation
- History tracking

**User Stories**:
- As a user, I want to check in at gyms using QR codes

**Acceptance Criteria**:
- Camera opens correctly
- QR codes are scanned accurately
- Check-in is recorded in Firestore

---

## 4. Non-Functional Requirements

### 4.1 Performance
- App should load within 3 seconds
- API responses should be under 5 seconds
- Smooth scrolling and navigation
- No lag on low-end devices

### 4.2 Responsiveness
- **Critical**: All screens must be responsive
- Support multiple screen sizes
- Proper safe area handling on mobile
- Web version should be fully functional
- Touch targets minimum 44x44px

### 4.3 Accessibility
- Proper contrast ratios
- Readable font sizes
- Touch-friendly buttons
- Screen reader support (where applicable)

### 4.4 Error Handling
- Graceful error messages
- Fallback UI for failed API calls
- Loading states for all async operations
- Network error handling

### 4.5 Data Management
- All data stored in Firestore
- Offline support (cached data)
- Real-time updates where applicable
- Data seeding utility available

---

## 5. Design Requirements

### 5.1 Theme
- **Primary Color**: Teal (#14B8A6, #2DD4BF)
- **Background**: Dark slate (#0F172A, #1E293B)
- **Text**: White with slate variants
- **Accents**: Amber for Elite tier, Teal for Pro tier

### 5.2 Typography
- Headings: Bold, 18-24px
- Body: Regular, 14-16px
- Small text: 12px

### 5.3 Components
- Rounded corners (12-16px)
- Consistent spacing (4px grid)
- Card-based layouts
- Gradient backgrounds for workout cards

### 5.4 Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

---

## 6. API Requirements

### 6.1 OpenRouter API
- **Endpoint**: https://openrouter.ai/api/v1/chat/completions
- **Model**: xiaomi/mimo-v2-flash:free
- **Use Cases**:
  - Workout recommendations
  - AI chat responses
  - Content generation
  - Performance analysis

### 6.2 Google Maps API
- **Endpoint**: Google Maps JavaScript API
- **Use Cases**:
  - Display gym locations
  - Interactive map view
  - Marker display

### 6.3 Firebase Firestore
- **Collections**:
  - users
  - workouts
  - gyms
  - bookings
  - checkins
  - ai_recommendations

---

## 7. Testing Requirements

### 7.1 Functional Testing
- All screens render correctly
- Navigation works between screens
- Search and filter functionality
- API integrations work
- Data persistence

### 7.2 Responsive Testing
- **Critical**: Test on multiple screen sizes
- Mobile (iPhone, Android)
- Tablet
- Web browser (different viewport sizes)
- Safe area handling on mobile

### 7.3 Integration Testing
- Firebase connection
- OpenRouter API calls
- Google Maps integration
- Data flow between services

### 7.4 User Acceptance Testing
- User can complete full workflows
- All features are accessible
- Performance is acceptable
- No critical bugs

---

## 8. Known Issues & Improvements

### 8.1 Current Issues
- Some components may not be fully responsive
- Need comprehensive testing across devices
- Performance optimization needed

### 8.2 Future Enhancements
- Real Firebase Authentication
- Push notifications
- Social features
- Workout tracking
- Progress charts
- Payment integration

---

## 9. Success Metrics

### 9.1 Technical Metrics
- App load time < 3 seconds
- API response time < 5 seconds
- Zero critical bugs
- 100% responsive on all target devices

### 9.2 User Experience Metrics
- All features accessible
- Smooth navigation
- Clear error messages
- Intuitive UI

---

## 10. Project Information

### 10.1 Project Name
FitZone

### 10.2 Version
1.0.0

### 10.3 Location Focus
Viman Nagar, Pune, India (18.5679° N, 73.9144° E)

### 10.4 Key Technologies
- React Native
- Expo
- Firebase
- OpenRouter AI
- Google Maps

---

## 11. Testing Checklist

### 11.1 Responsiveness Testing
- [ ] Home screen responsive on all devices
- [ ] Workouts screen responsive
- [ ] Gyms screen responsive
- [ ] Map screen responsive
- [ ] AI Chat screen responsive
- [ ] Profile screen responsive
- [ ] Bottom navigation doesn't overlap system UI
- [ ] Safe area handling works correctly
- [ ] Text readable on all screen sizes
- [ ] Buttons are touch-friendly

### 11.2 Functional Testing
- [ ] All screens load correctly
- [ ] Navigation works
- [ ] Search functionality works
- [ ] Filters work correctly
- [ ] AI recommendations appear
- [ ] AI chat responds
- [ ] Map displays gyms
- [ ] Data loads from Firestore
- [ ] Error handling works

### 11.3 Cross-Platform Testing
- [ ] Works on iOS
- [ ] Works on Android
- [ ] Works on Web
- [ ] Consistent experience across platforms

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Status**: Ready for Review

