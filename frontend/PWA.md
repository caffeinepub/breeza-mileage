# PWA Installation & Testing Guide

This document describes how to verify that the Mileage Tracker app is installable as a Progressive Web App (PWA) and how to test its offline capabilities.

## Prerequisites

- A modern browser (Chrome, Edge, Safari, or Firefox)
- For Android testing: Android device with Chrome browser
- HTTPS connection (required for service workers; localhost is also supported)

## Verifying PWA Installability

### 1. Check Manifest Detection

**In Chrome/Edge DevTools:**
1. Open DevTools (F12 or right-click → Inspect)
2. Go to the **Application** tab
3. In the left sidebar, click **Manifest**
4. Verify that:
   - The manifest loads without errors
   - Name: "Mileage Tracker"
   - Display mode: "standalone"
   - Icons are present (192x192 and 512x512)
   - Theme color: #8B6F47
   - Background color: #FBF8F3

### 2. Check Service Worker Registration

**In Chrome/Edge DevTools:**
1. Open DevTools → **Application** tab
2. In the left sidebar, click **Service Workers**
3. Verify that:
   - A service worker is registered for the app's origin
   - Status shows "activated and is running"
   - Source: `/sw.js`

**In the browser console:**
