# Android Build & Deployment Guide

This guide covers building and deploying the Mileage Tracker app as an Android application using Trusted Web Activity (TWA).

## Quick Start

### Prerequisites
- Node.js and npm/pnpm installed
- Java Development Kit (JDK) 11 or higher
- Android SDK (via Android Studio or command-line tools)
- Bubblewrap CLI: `npm install -g @bubblewrap/cli`

### Initial Setup

1. **Configure the TWA:**
   ```bash
   cd frontend/android
   # Edit bubblewrap.json with your canister URL and app details
   ```

2. **Build the Android app:**
   ```bash
   bubblewrap build
   ```

3. **Install on device:**
   ```bash
   bubblewrap install
   ```

## Internet Identity Authentication

The Android app is configured to handle Internet Identity authentication flows:

- **Deep linking:** The app intercepts `https://<canister-id>.ic0.app` URLs
- **Redirect handling:** After II authentication, users are redirected back to the app
- **Manifest configuration:** `AndroidManifest.xml` includes intent filters for II flows

### Testing Authentication

1. Launch the app on an Android device
2. Tap "Login" to initiate Internet Identity flow
3. Complete authentication in the II interface
4. Verify you're redirected back to the app and logged in

## Release Builds

### Generate a Signing Key

