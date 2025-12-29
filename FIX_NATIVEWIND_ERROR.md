# Fix NativeWind PostCSS Async Error

## The Error
```
ERROR  Error: Use process(css).then(cb) to work with async plugins
```

This error occurs because NativeWind v2's babel plugin is trying to process CSS synchronously, but PostCSS plugins are async.

## Solution

### Step 1: Clear Cache and Restart

Stop the current Expo server (Ctrl+C) and run:

```bash
# Clear Metro bundler cache
npx expo start --clear

# Or if that doesn't work:
rm -rf node_modules/.cache
npx expo start --clear
```

### Step 2: Verify Configuration Files

Make sure these files exist and are correct:

**postcss.config.js** (should exist):
```js
module.exports = {
  plugins: {
    tailwindcss: {},
  },
};
```

**babel.config.js**:
```js
module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: ["nativewind/babel"],
    };
};
```

**metro.config.js** (should exist):
```js
const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);
module.exports = config;
```

### Step 3: If Still Not Working - Try Alternative

If the error persists, try downgrading NativeWind to v1 or updating to the latest v2:

```bash
# Option 1: Try latest NativeWind v2
npm install nativewind@latest

# Option 2: Or use v1 (more stable)
npm uninstall nativewind
npm install nativewind@^1.3.0
```

If using v1, update `babel.config.js`:
```js
plugins: [require("nativewind/babel")],
```

### Step 4: Nuclear Option - Reinstall

If nothing works:

```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install

# Clear all caches
npx expo start --clear
```

## Quick Fix Command

Run this in PowerShell (Windows):

```powershell
cd F:\Task-FitZone
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
npx expo start --clear
```

Or in Command Prompt:

```cmd
cd F:\Task-FitZone
rmdir /s /q node_modules\.cache 2>nul
npx expo start --clear
```

## Why This Happens

NativeWind v2 uses PostCSS to process Tailwind CSS classes. The babel plugin transforms these classes during build time, but sometimes PostCSS tries to use async operations which conflicts with the synchronous babel transform.

The `--clear` flag clears Metro's cache, which often resolves the issue.

