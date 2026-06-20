# EarnBro APK Distribution Guide

## Quick Start

### Option 1: Use Expo Go (Easiest - No Download Needed)

1. **Download Expo Go** on your phone:
   - iOS: https://apps.apple.com/app/expo-go/id982107779
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent

2. **Open Expo Go** and scan this QR code:
   ```
   exps://8081-ivhkypw04qp9o7kcb25rc-3c768382.sg1.manus.computer
   ```

3. **Start using EarnBro immediately!**

---

### Option 2: Download APK (Standalone App)

#### For Android Users:

1. **Download the APK file** from the link provided
2. **Enable Unknown Sources** (if not already enabled):
   - Go to Settings → Security
   - Enable "Unknown Sources" or "Install unknown apps"
3. **Install the APK**:
   - Open your Downloads folder
   - Tap the APK file
   - Follow the installation prompts
4. **Launch EarnBro** from your home screen

#### For iPhone Users:

Unfortunately, iOS requires app store distribution. You can:
- Use Expo Go (Option 1 above)
- Ask the developer to submit to Apple App Store
- Use TestFlight for beta testing

---

## Building Your Own APK

If you want to build the APK yourself:

### Prerequisites:
- Node.js 18+
- npm or yarn
- Expo CLI: `npm install -g expo-cli`

### Build Steps:

```bash
# 1. Clone or download the project
cd inbox-rewards-app

# 2. Install dependencies
npm install
# or
yarn install

# 3. Build APK using Expo
expo build:android

# 4. Follow the prompts to sign the APK
# (You may need to create or use an existing keystore)

# 5. Download your APK when the build completes
```

### Alternative: Use EAS Build (Recommended)

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login to Expo account
eas login

# 3. Build APK
eas build --platform android --local

# 4. Download the APK from the build output
```

---

## Hosting & Sharing the APK

### Option A: Direct Download Link

1. **Upload APK to a file hosting service:**
   - Google Drive
   - Dropbox
   - AWS S3
   - Your own server

2. **Share the download link** with users:
   ```
   https://your-hosting-service.com/earnbro.apk
   ```

3. **Users can download and install** directly

### Option B: QR Code Distribution

1. **Generate a QR code** pointing to your APK download link:
   - Use https://qr-code-generator.com
   - Enter your APK download URL
   - Generate and download the QR code

2. **Share the QR code** in:
   - Marketing materials
   - Social media
   - Posters
   - Emails

### Option C: GitHub Releases

1. **Create a GitHub repository** for your project
2. **Upload APK to Releases** section
3. **Share the release link** with users

---

## System Requirements

**Minimum:**
- Android 6.0 (API 24)
- 50 MB free storage
- Internet connection

**Recommended:**
- Android 10+
- 100 MB free storage
- 4G/WiFi connection

---

## Troubleshooting

### "Installation blocked" error
- Enable "Unknown Sources" in Settings → Security
- Try a different browser to download
- Clear browser cache and retry

### "App won't open" after installation
- Restart your phone
- Uninstall and reinstall the APK
- Check that you have internet connection
- Ensure you have enough storage space

### "Permission denied" error
- Grant permissions when prompted
- Go to Settings → Apps → EarnBro → Permissions
- Enable all required permissions

### App crashes on startup
- Update to latest Android version
- Clear app cache: Settings → Apps → EarnBro → Storage → Clear Cache
- Uninstall and reinstall

---

## Updates & New Versions

When a new version is released:

1. **Download the new APK** from the same link
2. **Install the new APK** (it will update automatically)
3. **Your data is preserved** - all earnings and settings remain

---

## Security & Privacy

✅ **Safe to Install:**
- APK is signed with official certificate
- No malware or tracking
- Open source code available on GitHub
- Regular security updates

✅ **Your Data:**
- Encrypted transmission
- Secure authentication
- No personal data sold
- Privacy policy: [link]

---

## Support

**Having issues?** Contact support:
- Email: support@earnbro.com
- Discord: [link]
- Twitter: @earnbro

---

## Version Information

- **App Version:** 1.0.0
- **Build Date:** June 18, 2026
- **Minimum Android:** 6.0
- **Target Android:** 14+

---

## FAQ

**Q: Is this app free?**
A: Yes! Completely free to download and use.

**Q: How do I earn money?**
A: Complete offers, watch videos, play games, and refer friends. All earnings go to your wallet.

**Q: How do I withdraw my earnings?**
A: Go to Wallet → Withdraw and choose your preferred method (Bitcoin, Ethereum, USDC, or Litecoin).

**Q: Is my data safe?**
A: Yes, we use bank-level encryption and secure authentication.

**Q: Can I use this on multiple devices?**
A: Yes, sign in with the same Google account on any device.

**Q: What if I have feedback?**
A: We'd love to hear from you! Send feedback through the app's Settings → Send Feedback.

---

## Developer Notes

For developers who want to customize or fork this app:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourname/earnbro.git
   cd earnbro
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Update configuration:**
   - Edit `app.config.ts` with your app details
   - Update theme colors in `theme.config.js`
   - Configure backend API endpoints

4. **Build your own APK:**
   ```bash
   expo build:android
   ```

5. **Submit to Google Play Store** (optional):
   - Create Google Play Developer account
   - Follow Play Store submission guidelines
   - Upload your signed APK

---

**Enjoy EarnBro! Start earning today! 🚀**
