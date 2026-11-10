# Google Maps setup (PropVerse mobile)

1. Create a key in [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials.
2. Enable **Maps SDK for Android** and **Maps SDK for iOS**.
3. Restrict the key to your package `com.propverse.app`.
4. Replace `YOUR_GOOGLE_MAPS_API_KEY` in:
   - `apps/mobile/app.json` (android.config.googleMaps.apiKey, ios.config.googleMapsApiKey, plugins, extra)
5. Rebuild the APK (`eas build` or GitHub Actions `build-apk`).

Without a valid key, the Map tab may show a blank/grey map on Android release builds. Demo plot markers and live listing markers still work once the map tiles load.

## Listing publish fix

User-created listings are stored in a local `listingsStore` and merged into Home + Map even when the Nest API is offline (standalone APK demo mode). After **Submit listing**, open **Home** — the new card appears at the top.
