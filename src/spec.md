# Specification

## Summary
**Goal:** Add the missing PWA and Android TWA icon/splash image assets and wire them into the Android wrapper resources so install icons and splash screens render correctly.

**Planned changes:**
- Add the generated PWA app icon PNGs under `frontend/public/assets/generated/` using the existing manifest/favicon filenames: `app-icon.dim_192x192.png` and `app-icon.dim_512x512.png`.
- Add the generated Android TWA icon/splash PNGs under `frontend/public/assets/generated/`: `android-icon-foreground.dim_432x432.png`, `android-icon-background.dim_432x432.png`, and `android-splash.dim_2732x2732.png`.
- Update the Android TWA wrapper drawable resources by copying/replacing `ic_launcher_foreground.png`, `ic_launcher_background.png`, and `splash_image.png` with the corresponding generated PNGs so the launcher icon and splash screen references resolve without missing-resource errors.

**User-visible outcome:** When installing the PWA or running the Android TWA build, the app shows the correct app icon and splash screen instead of missing or placeholder assets.
