# GitHub Releases Distribution Guide for EarnBro

Complete guide to distribute your EarnBro APK via GitHub Releases.

---

## Step 1: Create a GitHub Repository

### 1.1 Create a new repository on GitHub

1. Go to https://github.com/new
2. Fill in the details:
   - **Repository name:** `earnbro` (or your preferred name)
   - **Description:** "EarnBro - Earn money through offers, games, and referrals"
   - **Public** (so anyone can download)
   - **Initialize with README** (optional)
3. Click **Create repository**

### 1.2 Clone the repository locally

```bash
git clone https://github.com/YOUR_USERNAME/earnbro.git
cd earnbro
```

---

## Step 2: Push Your Project to GitHub

### 2.1 Initialize git in your project (if not already done)

```bash
cd /home/ubuntu/inbox-rewards-app
git init
git add .
git commit -m "Initial commit: EarnBro app"
```

### 2.2 Add remote and push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/earnbro.git
git branch -M main
git push -u origin main
```

**Note:** You'll need to authenticate. Use a Personal Access Token:
1. Go to https://github.com/settings/tokens
2. Click "Generate new token"
3. Select scopes: `repo`, `write:packages`
4. Copy the token and use it as your password when prompted

---

## Step 3: Build the APK

### 3.1 Install Expo CLI

```bash
npm install -g expo-cli
```

### 3.2 Build the APK

```bash
cd /home/ubuntu/inbox-rewards-app
expo build:android
```

**Follow the prompts:**
- Choose "APK" (not AAB)
- Create a new keystore or use existing
- Wait for build to complete (usually 10-15 minutes)

### 3.3 Download the APK

Once the build completes, you'll get a download link. Download the APK file:
```bash
# Example (your link will be different)
wget https://expo-builds.s3.amazonaws.com/...../earnbro.apk
```

Save it as: `earnbro.apk`

---

## Step 4: Create a GitHub Release

### 4.1 Create a new release on GitHub

1. Go to your repository: `https://github.com/YOUR_USERNAME/earnbro`
2. Click on **Releases** (right sidebar)
3. Click **Create a new release**

### 4.2 Fill in release details

**Tag version:**
```
v1.0.0
```

**Release title:**
```
EarnBro v1.0.0 - Initial Release
```

**Description:**
```markdown
# EarnBro v1.0.0

🎉 Initial release of EarnBro - Earn money through offers, games, and referrals!

## Features
- 🔐 Google Sign-In authentication
- 💰 Real wallet with balance tracking
- 🎮 Interactive games (Scratch, Spin, Trivia)
- 📱 Offers and tasks to complete
- 💳 Crypto withdrawals (Bitcoin, Ethereum, USDC, Litecoin)
- 🔗 Blockchain explorer links
- 👥 Referral program with tiers
- 📊 Transaction history

## Installation

1. Download `earnbro.apk` from the assets below
2. Enable "Unknown Sources" in Settings → Security
3. Install the APK
4. Open EarnBro and sign in with Google
5. Start earning!

## Requirements
- Android 6.0+
- 50 MB free storage
- Internet connection

## Support
- Report issues: [GitHub Issues](https://github.com/YOUR_USERNAME/earnbro/issues)
- Contact: support@earnbro.com

## What's New
- Initial release
- Full authentication system
- Wallet and transaction tracking
- Crypto withdrawal support
- Referral program
- Game mechanics

---

**Download the APK below to get started!**
```

### 4.3 Upload the APK

1. Scroll down to **Attach binaries**
2. Drag and drop `earnbro.apk` or click to browse
3. Wait for upload to complete

### 4.4 Publish the release

1. Click **Publish release**
2. Your release is now live!

---

## Step 5: Share Your Release

### 5.1 Get the download link

Your APK is now available at:
```
https://github.com/YOUR_USERNAME/earnbro/releases/download/v1.0.0/earnbro.apk
```

### 5.2 Share with users

**Direct link:**
```
https://github.com/YOUR_USERNAME/earnbro/releases/download/v1.0.0/earnbro.apk
```

**Release page:**
```
https://github.com/YOUR_USERNAME/earnbro/releases/tag/v1.0.0
```

**QR Code:** Generate a QR code pointing to the direct link:
- Use https://qr-code-generator.com
- Enter the direct APK link
- Generate and share the QR code

### 5.3 Share on social media

**Twitter/X:**
```
🎉 EarnBro v1.0.0 is now available!

Earn money through offers, games, and referrals with crypto withdrawals.

📥 Download: https://github.com/YOUR_USERNAME/earnbro/releases

#EarnBro #CryptoRewards #Android
```

**Reddit:**
```
[Release] EarnBro v1.0.0 - Earn Money App with Crypto Withdrawals

I just released EarnBro, a mobile app where you can earn real money through:
- Completing offers
- Playing games
- Watching videos
- Referring friends

Withdraw your earnings to Bitcoin, Ethereum, USDC, or Litecoin.

Download: https://github.com/YOUR_USERNAME/earnbro/releases
```

**Discord/Telegram:**
```
🚀 EarnBro v1.0.0 Released!

Download now: https://github.com/YOUR_USERNAME/earnbro/releases

Features:
✅ Google Sign-In
✅ Real wallet
✅ Games & offers
✅ Crypto withdrawals
✅ Referral program

Start earning today!
```

---

## Step 6: Update Your Repository

### 6.1 Add important files

Create these files in your repository:

**README.md** (if not already created):
```markdown
# EarnBro

Earn money through offers, games, and referrals with crypto withdrawals.

## Download

[Download Latest Release](https://github.com/YOUR_USERNAME/earnbro/releases)

## Features

- 🔐 Google Sign-In
- 💰 Real wallet
- 🎮 Games & offers
- 💳 Crypto withdrawals
- 👥 Referral program

## Installation

1. Download the APK from [Releases](https://github.com/YOUR_USERNAME/earnbro/releases)
2. Enable "Unknown Sources" in Settings
3. Install and open EarnBro
4. Sign in with Google
5. Start earning!

## Requirements

- Android 6.0+
- 50 MB storage
- Internet connection

## Support

[Report Issues](https://github.com/YOUR_USERNAME/earnbro/issues)
```

**LICENSE** (add MIT license):
```
MIT License

Copyright (c) 2026 EarnBro

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, and merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

### 6.2 Commit and push

```bash
git add README.md LICENSE
git commit -m "Add README and LICENSE"
git push origin main
```

---

## Step 7: Manage Future Releases

### 7.1 Build a new version

When you make updates:

```bash
# Update version in app.config.ts
# Make your changes
# Commit changes
git add .
git commit -m "v1.1.0: Add new features"
git push origin main

# Build new APK
expo build:android

# Download the new APK
```

### 7.2 Create a new release

1. Go to **Releases**
2. Click **Create a new release**
3. Use new version tag: `v1.1.0`
4. Update description with new features
5. Upload the new APK
6. Publish

### 7.3 Update release notes

**Example v1.1.0 release notes:**
```markdown
# EarnBro v1.1.0 - New Features

## What's New
- ✨ Added push notifications
- 🎮 New daily bonus game
- 🐛 Fixed wallet balance display
- ⚡ Improved app performance

## Bug Fixes
- Fixed crash on startup
- Fixed referral code copying
- Improved transaction loading

## Download
[earnbro.apk](https://github.com/YOUR_USERNAME/earnbro/releases/download/v1.1.0/earnbro.apk)
```

---

## Best Practices

### 1. Version Numbering

Use semantic versioning:
- **v1.0.0** - Initial release
- **v1.0.1** - Bug fix
- **v1.1.0** - New features
- **v2.0.0** - Major changes

### 2. Release Notes

Always include:
- What's new
- Bug fixes
- Known issues
- Installation instructions
- Requirements

### 3. Testing

Before releasing:
```bash
# Test on Android device or emulator
expo start --android

# Test all features:
# - Sign in with Google
# - Complete an offer
# - Play a game
# - View wallet
# - Check referral code
```

### 4. Keep README Updated

Keep your README current with:
- Latest version number
- Download link
- Feature list
- Installation steps
- Support information

---

## Troubleshooting

### "APK won't download"
- Check file size (should be 50-100 MB)
- Try a different browser
- Check your internet connection
- Verify the release is published

### "Installation fails"
- Enable "Unknown Sources" in Settings
- Ensure you have enough storage
- Try clearing app cache
- Restart your phone

### "Can't find release"
- Make sure repository is public
- Check the release is published (not draft)
- Verify the tag is correct
- Try direct APK link

### "Need to update APK"
- Create a new release with new version tag
- Upload the new APK
- Publish the release
- Users can download the new version

---

## Advanced: Automate Releases

### Use GitHub Actions to auto-build APK

Create `.github/workflows/build.yml`:

```yaml
name: Build APK

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install -g expo-cli
      - run: npm install
      - run: expo build:android
      - uses: softprops/action-gh-release@v1
        with:
          files: earnbro.apk
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Then releases auto-build when you push a tag:
```bash
git tag v1.1.0
git push origin v1.1.0
```

---

## Summary

✅ Create GitHub repository  
✅ Push your code  
✅ Build APK with Expo  
✅ Create release on GitHub  
✅ Upload APK to release  
✅ Share download link  
✅ Update for new versions  

**Your app is now distributed via GitHub!** 🚀

Users can download directly from your releases page and stay updated with the latest versions.

---

## Support

Need help?
- GitHub Issues: Report bugs and feature requests
- GitHub Discussions: Ask questions
- Email: support@earnbro.com
- Twitter: @earnbro

Happy releasing! 🎉
