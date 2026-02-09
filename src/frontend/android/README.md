# Mileage Tracker - Android TWA Build

This directory contains the Android Trusted Web Activity (TWA) wrapper for the Mileage Tracker Progressive Web App.

## What is a TWA?

A Trusted Web Activity (TWA) is an Android feature that allows you to package your web application as a native Android app. The app loads your existing web deployment (hosted on the Internet Computer) in a full-screen browser context without any browser UI.

**Important:** This Android app does NOT bundle your web application. It loads the live web app from your Internet Computer canister. Any updates to your web deployment are immediately reflected in the Android app without requiring a new build.

## Prerequisites

Before building the Android app, ensure you have:

1. **Java Development Kit (JDK) 11 or higher**
   - Download from: https://adoptium.net/
   - Verify: `java -version`

2. **Android SDK**
   - Install Android Studio: https://developer.android.com/studio
   - Or install command-line tools: https://developer.android.com/studio#command-tools
   - Set `ANDROID_HOME` environment variable to your SDK location

3. **Gradle** (included via wrapper, no separate install needed)

4. **Your deployed canister URL**
   - You need your production canister ID (e.g., `abc123-cai.icp0.io`)

## Configuration

### 1. Update Canister URL

Replace `YOUR_CANISTER_ID` in the following files with your actual canister ID:

- `bubblewrap.json` - Update `host` and `webManifestUrl`
- `app/src/main/AndroidManifest.xml` - Update `android:host` in intent-filter and meta-data URLs
- `app/src/main/res/values/strings.xml` - Update `host` and `default_url`

Example: If your canister ID is `abc123-cai`, use `abc123-cai.icp0.io`

### 2. Add App Icons and Splash Screen

The build expects the following drawable resources:

- `app/src/main/res/drawable/ic_launcher_foreground.png` - Adaptive icon foreground (432x432px)
- `app/src/main/res/drawable/ic_launcher_background.png` - Adaptive icon background (432x432px)
- `app/src/main/res/drawable/splash_image.png` - Splash screen image (2732x2732px)

These should be copied from the generated assets in `frontend/public/assets/generated/`:
- `android-icon-foreground.dim_432x432.png` → `ic_launcher_foreground.png`
- `android-icon-background.dim_432x432.png` → `ic_launcher_background.png`
- `android-splash.dim_2732x2732.png` → `splash_image.png`

## Building the App

### Debug Build (for testing)

1. Navigate to the android directory:
   ```bash
   cd frontend/android
   ```

2. Build the debug APK:
   ```bash
   ./gradlew assembleDebug
   ```
   (On Windows: `gradlew.bat assembleDebug`)

3. The APK will be generated at:
   ```
   app/build/outputs/apk/debug/app-debug.apk
   ```

### Release Build (for distribution)

1. Create a signing keystore (first time only):
   ```bash
   keytool -genkey -v -keystore android.keystore -alias android -keyalg RSA -keysize 2048 -validity 10000
   ```
   **Important:** Store the keystore password securely. You'll need it for all future builds.

2. Build the release APK:
   ```bash
   ./gradlew assembleRelease
   ```

3. Or build an Android App Bundle (AAB) for Play Store:
   ```bash
   ./gradlew bundleRelease
   ```

4. Outputs:
   - APK: `app/build/outputs/apk/release/app-release.apk`
   - AAB: `app/build/outputs/bundle/release/app-release.aab`

## Installing on Device/Emulator

### Via ADB (Android Debug Bridge)

1. Enable USB debugging on your Android device
2. Connect device via USB
3. Install the APK:
   ```bash
   adb install app/build/outputs/apk/debug/app-debug.apk
   ```

### Via Android Studio

1. Open the `android` directory in Android Studio
2. Select your device/emulator from the device dropdown
3. Click Run (green play button)

## Internet Identity Authentication

### How It Works in Android

When a user taps "Login" in the Android app:

1. The app opens Internet Identity in a Custom Tab (in-app browser)
2. User completes authentication in the Custom Tab
3. Internet Identity redirects back to your canister URL
4. The TWA intercepts the redirect and returns to the app
5. The app is now authenticated

### Testing Authentication

1. Install the debug APK on a device/emulator
2. Open the app - you should see the onboarding screen
3. Tap "Login" - Internet Identity should open
4. Complete authentication
5. You should return to the app in an authenticated state
6. Force-close and reopen the app - you should remain authenticated (delegation is cached)
7. Tap "Logout" - you should return to the onboarding screen

### Troubleshooting Authentication

**Problem:** Browser address bar appears at the top

**Solution:** You need to set up Digital Asset Links to establish trust between your domain and the Android app.

1. Get your app's SHA-256 fingerprint:
   ```bash
   keytool -list -v -keystore android.keystore -alias android
   ```

2. Create `assetlinks.json` in your web app's `public/.well-known/` directory:
   ```json
   [{
     "relation": ["delegate_permission/common.handle_all_urls"],
     "target": {
       "namespace": "android_app",
       "package_name": "com.mileagetracker.twa",
       "sha256_cert_fingerprints": ["YOUR_SHA256_FINGERPRINT_HERE"]
     }
   }]
   ```

3. Deploy your web app so the file is accessible at:
   ```
   https://YOUR_CANISTER_ID.icp0.io/.well-known/assetlinks.json
   ```

4. Uninstall and reinstall the app to trigger verification

**Problem:** Authentication doesn't persist after app restart

**Cause:** This is expected behavior if the delegation has expired. Internet Identity delegations have a time limit (default 30 days).

**Problem:** "User is already authenticated" error

**Solution:** Clear the app data or logout before attempting to login again.

## Common Issues

### Gradle Build Fails

- Ensure `ANDROID_HOME` is set correctly
- Run `./gradlew clean` and try again
- Check that you have Android SDK Platform 33 installed

### App Crashes on Launch

- Verify all `YOUR_CANISTER_ID` placeholders are replaced
- Check that your canister is deployed and accessible
- Review Android logcat: `adb logcat | grep MileageTracker`

### Icons Not Showing

- Ensure drawable resources are in the correct directories
- Verify image files are valid PNG format
- Run `./gradlew clean` and rebuild

## Next Steps

- **Play Store Submission:** See `../ANDROID.md` for Play Store preparation
- **Testing:** Test on multiple Android versions (minimum API 21 / Android 5.0)
- **Updates:** When you update your web app, users automatically get the changes (no app update needed)

## Resources

- [Trusted Web Activities Guide](https://developer.chrome.com/docs/android/trusted-web-activity/)
- [Android Browser Helper Library](https://github.com/GoogleChrome/android-browser-helper)
- [Digital Asset Links](https://developers.google.com/digital-asset-links/v1/getting-started)
