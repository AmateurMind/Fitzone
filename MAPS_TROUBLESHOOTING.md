# Google Maps Not Showing - Troubleshooting Guide

## Quick Checks

### 1. Enable Maps JavaScript API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services** → **Library**
4. Search for **"Maps JavaScript API"**
5. Click **Enable**

### 2. Check API Key Restrictions
1. Go to **APIs & Services** → **Credentials**
2. Click on your API key
3. Under **API restrictions**:
   - Select **"Don't restrict key"** (for testing)
   - OR select **"Restrict key"** and choose **"Maps JavaScript API"**

### 3. Check Application Restrictions (for Web)
1. Under **Application restrictions**:
   - For testing: Select **"None"**
   - For production: Add your domain (e.g., `localhost:8089`, `yourdomain.com`)

### 4. Verify Gym Data Has Coordinates
The map needs gyms with `latitude` and `longitude` fields. Check:
- Open browser console (F12)
- Look for: `"Gyms with coordinates: X"` (should be > 0)
- If 0, the gyms in Firestore might not have coordinates

### 5. Check Browser Console
Open browser console (F12) and look for:
- ✅ `"Loaded gyms from service: X"` - Good!
- ✅ `"Gyms with coordinates: X"` - Should be > 0
- ❌ `"Failed to load Google Maps script"` - API not enabled or key invalid
- ❌ `"Map container or Google Maps not ready"` - Script loading issue

## Current Configuration

- **API Key**: `AIzaSyDqDx99GsT5-KQ2EqVaZTqpwVGEJZf8Qjw`
- **Center**: Viman Nagar, Pune (18.5679, 73.9144)
- **Gyms**: Should show 6 locations around Pune

## If Map Still Doesn't Show

1. **Clear browser cache** and reload
2. **Check API quota** - Free tier gives $200/month credit
3. **Try in incognito mode** - Rules out extension issues
4. **Check network tab** - See if the Maps API script is loading (status 200)

## Fallback Data

If Firestore doesn't have gym coordinates, the app will use fallback data from `src/data/gyms.js` which has all the Pune locations with coordinates.

