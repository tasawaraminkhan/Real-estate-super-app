# PropVerse — Google Play readiness

## Store listing (copy)

**Title:** PropVerse — Pakistan Real Estate

**Short description (80 chars):**  
Buy, sell & rent property. Cost estimates, legal checks & leads.

**Full description:**  
PropVerse is a modern real estate super-app built for Pakistan.

• Browse plots, houses, flats and commercial listings  
• Filter by Buy / Rent / Commercial and price bands  
• Construction cost calculator with city rates and breakdown  
• Create listings with flexible area (Marla/Kanal) and price (Lac/Crore/PKR)  
• Legal & fraud shield helpers and society NOC awareness (demo + production path)  
• Escrow-style deal milestones (feature-flagged for compliance)  
• Materials planner and labour/contractor board  
• Leads CRM for agents: call, WhatsApp, status badges  

Designed for Lahore, Karachi, Islamabad and cities nationwide.

**Category:** House & Home / Lifestyle  
**Content rating:** Everyone  
**Contact email:** support@propverse.app  
**Privacy policy URL:** host `docs/PRIVACY_POLICY.md` on a public HTTPS page and paste the URL in Play Console.

## Technical checklist
- [x] Unique package: `com.propverse.app`
- [x] versionName 1.0.0 / versionCode 2
- [x] Single bottom tab bar (no duplicate labels)
- [x] Minimal permissions (no camera/storage until media feature ships)
- [x] Offline demo fallback so APK works without backend
- [ ] Upload privacy policy to HTTPS
- [ ] Play App Signing + release keystore
- [ ] Feature graphic 1024×500 + screenshots (phone)
- [ ] Target API level required by Play (via current Expo / AGP)

## Build release APK/AAB
```bash
cd apps/mobile
npx eas-cli build -p android --profile production
# or GitHub Actions workflow → assembleRelease / bundleRelease
```

## Competing positioning
vs Zameen / Graana: unified cost engine, fraud-shield UX, escrow milestones, materials & labour board in one mobile flow.
