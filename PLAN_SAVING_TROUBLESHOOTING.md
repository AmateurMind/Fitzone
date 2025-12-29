# Plan Saving Troubleshooting Guide

## How Plan Saving Works

### 1. Plan Generation Flow
```
User clicks "Workout Plan" or "Diet Plan"
    ↓
Answers questions in modal
    ↓
generateCompleteFitnessPlan() or generateDietPlan() called
    ↓
AI generates plan (or uses fallback)
    ↓
saveUserPlan() called inside ai.service.js
    ↓
Plan saved to Firestore collection: user_plans
    ↓
Result returned with {success: true, plan: {...}}
    ↓
Plan displayed in AI Chat with "View My Plans" button
```

### 2. Where Plans Are Saved
- **Service**: `src/services/ai.service.js`
- **Functions**: `generateCompleteFitnessPlan()`, `generateDietPlan()`
- **Database**: Firestore collection `user_plans`
- **User ID**: `demo_user_001` (from auth.service.js)

### 3. Console Logs to Check

Open browser console (F12) and look for:

**When generating a plan:**
```
Generating workout plan with data: {...}
Saving plan to Firestore: {userId: "demo_user_001", ...}
Plan saved successfully with ID: abc123xyz
Workout plan result: {success: true, plan: {...}}
Plan generation complete, saved to Firestore
```

**When viewing plans:**
```
PlansScreen - Loading plans for userId: demo_user_001
Fetching plans for userId: demo_user_001
Fetched plans: 1 [{...}]
PlansScreen - Loaded plans: [{...}]
```

## Testing Steps

### Test 1: Generate a Workout Plan
1. Open AI Chat
2. Click "Workout Plan" quick action
3. Answer all questions:
   - Goal: Build Muscle
   - Level: Intermediate
   - Days: 4-5 days
   - Duration: 45-60 min
   - Equipment: Full Gym Access
4. Wait for plan to generate
5. Check console for save confirmation
6. Click "View My Plans" button in the chat
7. Verify plan appears in My Plans screen

### Test 2: Generate a Diet Plan
1. Open AI Chat
2. Click "Diet Plan" quick action
3. Answer all questions
4. Wait for plan to generate
5. Check console for save confirmation
6. Click "View My Plans" button
7. Verify plan appears in My Plans screen

### Test 3: Refresh Plans List
1. Go to My Plans screen
2. Click the 🔄 refresh button
3. Check console for fetch logs
4. Verify plans load

## Common Issues & Solutions

### Issue 1: Plans Not Appearing
**Symptoms**: AI says "Plan saved!" but nothing in My Plans

**Check:**
```javascript
// In browser console:
// 1. Check if save was attempted
"Saving plan to Firestore: {userId: ...}"

// 2. Check if save succeeded
"Plan saved successfully with ID: ..."

// 3. Check if fetch is working
"Fetching plans for userId: demo_user_001"
"Fetched plans: X"
```

**Solutions:**
- Click 🔄 refresh button in My Plans
- Check Firestore rules allow write to `user_plans`
- Verify userId is consistent: `demo_user_001`
- Check browser console for errors

### Issue 2: Save Fails Silently
**Symptoms**: No "Plan saved successfully" log

**Check:**
- Network tab in DevTools for Firestore errors
- Check API key is valid
- Check OpenRouter API response

**Solutions:**
- Fallback plan should still save even if AI fails
- Check `ai.service.js` error handling
- Verify `saveUserPlan()` is being called

### Issue 3: Wrong User ID
**Symptoms**: Saves but can't fetch

**Check:**
```javascript
// Compare these two:
console.log("Saving with:", userId);  // Should be "demo_user_001"
console.log("Fetching with:", userId); // Should be same
```

**Solution:**
- Both must use `getCurrentUserId()` from auth.service.js
- Should return `demo_user_001`

## Manual Testing via Console

### Save a Test Plan Manually
```javascript
import { saveUserPlan } from './src/services/firestore.service';
import { getCurrentUserId } from './src/services/auth.service';

const userId = getCurrentUserId();
const testPlan = {
    type: 'workout',
    planName: 'Test Plan',
    plan: {
        planName: 'Test Plan',
        summary: 'This is a test',
        weeklySchedule: []
    },
    status: 'active'
};

await saveUserPlan(userId, testPlan);
```

### Fetch Plans Manually
```javascript
import { getUserPlans } from './src/services/firestore.service';
import { getCurrentUserId } from './src/services/auth.service';

const userId = getCurrentUserId();
const plans = await getUserPlans(userId);
console.log('Plans:', plans);
```

## Firebase Console Check

1. Go to Firebase Console
2. Navigate to Firestore Database
3. Look for collection: `user_plans`
4. Check if documents exist with:
   - `userId: "demo_user_001"`
   - `type: "workout"` or `"diet"`
   - `plan: {...}`
   - `createdAt: timestamp`

## Expected Database Structure

```
Firestore
└── user_plans (collection)
    ├── abc123xyz (document)
    │   ├── userId: "demo_user_001"
    │   ├── type: "workout"
    │   ├── planName: "Balanced Fitness Starter"
    │   ├── plan: {
    │   │   planName: "...",
    │   │   summary: "...",
    │   │   weeklySchedule: [...],
    │   │   tips: [...],
    │   │   expectedResults: "..."
    │   │ }
    │   ├── preferences: {...}
    │   ├── status: "active"
    │   ├── createdAt: Timestamp
    │   ├── updatedAt: Timestamp
    │   └── isActive: true
    └── def456uvw (document)
        └── ...
```

## Quick Fixes

### Fix 1: Force Refresh
1. Go to My Plans
2. Click 🔄 button
3. Check console logs

### Fix 2: Clear and Recreate
1. Generate a new plan
2. Immediately click "View My Plans" button
3. Should navigate and show the plan

### Fix 3: Check Network
1. Open DevTools > Network tab
2. Filter for "firestore"
3. Generate a plan
4. Look for POST request to firestore.googleapis.com
5. Check response status (should be 200)

## Success Indicators

✅ Console shows: "Plan saved successfully with ID: xyz"
✅ Console shows: "Fetched plans: 1 [...]"
✅ "View My Plans" button appears in chat
✅ Plan visible in My Plans screen
✅ Firestore has document in user_plans collection
✅ Plan count shows "1 plan created"

## If Still Not Working

1. **Clear browser cache** and reload
2. **Check Firestore rules** - must allow read/write
3. **Verify API keys** - OpenRouter and Firebase
4. **Check browser console** for any errors
5. **Look at Network tab** for failed requests
6. **Try incognito mode** to rule out extensions

