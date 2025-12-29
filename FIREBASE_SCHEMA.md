# FitZone Firebase Data Schema

This document outlines the Firestore data structure for the FitZone application.

## 1. Users Collection (`users`)
Stores user profile, stats, and subscription info.

```json
users
 └── userId (document)
     ├── name: "Rahul Sharma"
     ├── email: "rahul@example.com"
     ├── avatar: "RS"
     ├── membership: "pro" | "elite" | "free"
     ├── createdAt: timestamp
     ├── stats:
     │    ├── workoutsCompleted: 145
     │    ├── caloriesBurned: 4200
     │    ├── streak: 7
     │
     ├── subscription:
     │    ├── plan: "annual"
     │    ├── validTill: "2026-01-15"
     │    ├── active: true
```
✅ Used in: Home screen, Profile screen, Subscription UI

## 2. Workouts Collection (`workouts`)
Catalog of available workouts.

```json
workouts
 └── workoutId
     ├── title: "Full Body HIIT Blast"
     ├── trainer: "Priya Sharma"
     ├── duration: 30
     ├── calories: 350
     ├── difficulty: "Intermediate"
     ├── category: "HIIT"
     ├── isPremium: false
     ├── equipment: ["Mat", "Dumbbells"]
     ├── gradient: "orange-pink"
     ├── exercises:
     │    ├── { name: "Jumping Jacks", duration: "60 sec" }
     │    ├── { name: "Squats", reps: "15 reps" }
```
✅ Used in: Workouts list, Workout detail screen, AI recommendations

## 3. Gyms Collection (`gyms`)
Nearby gyms data.

```json
gyms
 └── gymId
     ├── name: "FitZone Koramangala"
     ├── area: "Koramangala"
     ├── distance: "1.2 km"
     ├── rating: 4.8
     ├── tier: "Elite"
     ├── amenities: ["Parking", "Showers", "Cafe"]
     ├── location:
     │    ├── lat: 12.9352
     │    ├── lng: 77.6245
```
✅ Used in: Gym list, Gym detail, Check-in

## 4. Classes Subcollection (`gyms/{gymId}/classes`)
Class schedule per gym.

```json
gyms
 └── gymId
     └── classes
         └── classId
             ├── name: "Morning Yoga"
             ├── trainer: "Priya S."
             ├── time: "6:00 AM"
             ├── type: "Yoga"
             ├── capacity: 20
             ├── booked: 12
             ├── date: "2025-12-26"
```
✅ Used in: Class booking screen, Gym detail

## 5. Bookings Collection (`bookings`)
User class bookings.

```json
bookings
 └── bookingId
     ├── userId: "user123"
     ├── gymId: "gym456"
     ├── classId: "class789"
     ├── date: "2025-12-26"
     ├── status: "confirmed"
     ├── createdAt: timestamp
```
✅ Used in: Upcoming class, Booking history

## 6. Checkins Collection (`checkins`)
QR & manual check-ins.

```json
checkins
 └── checkinId
     ├── userId: "user123"
     ├── gymId: "gym456"
     ├── gymName: "FitZone Koramangala"
     ├── time: timestamp
     ├── visitNumber: 146
```
✅ Used in: QR check-in success screen, Recent check-ins

## 7. AI Recommendations Collection (`ai_recommendations`)
Store AI-generated results.

```json
ai_recommendations
 └── userId
     ├── goal: "fat_loss"
     ├── recommendedWorkouts: ["HIIT", "Cardio"]
     ├── generatedAt: timestamp
```
✅ Used in: AI workout suggestion feature

## Security Rules
Simple, task-level security rules.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    match /{collection}/{docId} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```
