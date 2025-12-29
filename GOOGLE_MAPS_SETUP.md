# Google Maps Setup Guide

## Free Tier Information
Google Maps offers **$200 free credit per month**, which is enough for:
- ~28,000 map loads
- ~100,000 static map requests
- ~40,000 directions requests

## Enable Maps JavaScript API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create one)
3. Go to **APIs & Services** → **Library**
4. Search for **"Maps JavaScript API"**
5. Click **Enable**

## API Key Restrictions (Recommended for Production)

1. Go to **APIs & Services** → **Credentials**
2. Click on your API key
3. Under **Application restrictions**:
   - Select **HTTP referrers (web sites)**
   - Add your domain (e.g., `localhost:8089`, `yourdomain.com`)
4. Under **API restrictions**:
   - Select **Restrict key**
   - Choose **Maps JavaScript API**
5. Click **Save**

## Current Setup

Your API key is already configured in:
- `app.json` (for iOS/Android)
- `src/screens/GymMapScreen.jsx` (for web)

The map will automatically show all gym locations with markers when you open the Map view!

## Testing

1. Open the app on web
2. Go to **Gyms** tab
3. Click **"Map"** button
4. You should see an interactive Google Map with all gym locations marked!


