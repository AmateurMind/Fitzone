# How to Start App on Port 19006 for Testing

## 🚀 Quick Start

### Option 1: Using Terminal (Recommended)

Open a **new terminal/PowerShell window** and run:

```bash
cd F:\Task-FitZone
npx expo start --web --port 19006
```

**What happens:**
- ✅ Expo starts the development server
- ✅ Web version opens on `http://localhost:19006`
- ✅ App becomes accessible for TestSprite

**Wait for this message:**
```
✔ Web is waiting on http://localhost:19006
```

---

### Option 2: Using npm script (if configured)

If you want to add it to package.json:

```json
"scripts": {
  "test:web": "expo start --web --port 19006"
}
```

Then run:
```bash
npm run test:web
```

---

## 📋 Step-by-Step

1. **Open Terminal/PowerShell**
   - Press `Win + X` → Select "Terminal" or "PowerShell"
   - Or open VS Code terminal

2. **Navigate to project**:
   ```bash
   cd F:\Task-FitZone
   ```

3. **Start Expo on port 19006**:
   ```bash
   npx expo start --web --port 19006
   ```

4. **Wait for app to load**:
   - You'll see Metro bundler starting
   - Wait for: `✔ Web is waiting on http://localhost:19006`
   - The app should open in your browser automatically

5. **Keep terminal open**:
   - Don't close this terminal!
   - The app must keep running for tests to work

---

## ✅ Verify It's Running

### Check 1: Terminal Output
You should see:
```
✔ Web is waiting on http://localhost:19006
```

### Check 2: Browser
- Browser should open automatically
- Or manually go to: `http://localhost:19006`
- You should see your FitZone app

### Check 3: Test Connection
Open browser and go to: `http://localhost:19006`
- App should load
- No errors in console

---

## 🎯 Once App is Running

After you see `✔ Web is waiting on http://localhost:19006`, tell me and I'll:
1. ✅ Execute all 15 test cases
2. ✅ Test responsiveness on different screen sizes
3. ✅ Generate detailed test report
4. ✅ Show you all issues found

---

## ⚠️ Troubleshooting

### Port Already in Use?
If you get "port 19006 is already in use":

**Option A**: Use a different port (update config):
```bash
npx expo start --web --port 19007
```
Then update `testsprite_tests/tmp/config.json` with new port.

**Option B**: Kill the process using port 19006:
```powershell
# Find process
netstat -ano | findstr :19006

# Kill it (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### App Not Loading?
- Check if Metro bundler started correctly
- Clear cache: `npx expo start --web --port 19006 --clear`
- Check browser console for errors

---

## 📝 Quick Reference

**Command to start**:
```bash
npx expo start --web --port 19006
```

**What to wait for**:
```
✔ Web is waiting on http://localhost:19006
```

**Then**: Tell me "app is running" and I'll execute the tests! 🚀


