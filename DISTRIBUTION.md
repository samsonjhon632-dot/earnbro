# EarnBro - Distribution & Setup Guide

## Overview

EarnBro is a mobile rewards app that allows users to earn real money by completing surveys, claiming offers, and playing games. This guide explains how to distribute and deploy the app.

## Distribution Methods

### 1. **Expo Go (Easiest - Testing Only)**

Users can test the app instantly without installation:

1. Download **Expo Go** from App Store or Google Play
2. Scan the QR code from the dev server
3. App opens instantly in Expo Go

**Pros:** No build required, instant testing
**Cons:** Not suitable for production, requires Expo Go app

### 2. **Direct APK Download (Android)**

Generate a standalone APK for direct installation:

```bash
# Build APK
eas build --platform android --local

# Or use web preview
npm run dev
```

Users can:
- Download APK directly from your server
- Tap to install on Android devices
- No app store required

**Pros:** Direct distribution, full control
**Cons:** Users must enable "Unknown Sources", no auto-updates

### 3. **Web Version (Browser)**

Deploy to web for browser access:

```bash
# Build web version
npm run build

# Deploy to hosting (Vercel, Netlify, etc.)
```

**Pros:** No installation needed, works on any device
**Cons:** Limited native features

### 4. **App Store & Play Store (Production)**

For official distribution:

```bash
# iOS
eas build --platform ios

# Android
eas build --platform android
```

Then submit to:
- **Apple App Store**: Requires Apple Developer account ($99/year)
- **Google Play Store**: Requires Google Developer account ($25 one-time)

## Current Setup

EarnBro is configured for:
- ✅ Expo Go testing
- ✅ Web browser access
- ✅ Direct APK distribution
- ✅ Real backend with database
- ✅ Payment processing (Stripe/PayPal ready)
- ✅ Email notifications (SendGrid ready)

## Quick Start for Users

### Via Expo Go (Recommended for Testing)

1. Install Expo Go app
2. Scan QR code: `exps://8081-ivhkypw04qp9o7kcb25rc-3c768382.sg1.manus.computer`
3. App loads instantly

### Via Web Browser

1. Visit: `https://8081-ivhkypw04qp9o7kcb25rc-3c768382.sg1.manus.computer`
2. Use in browser (limited features)

### Via APK (Android Only)

1. Download APK file
2. Enable "Unknown Sources" in Settings
3. Tap APK to install
4. Open EarnBro app

## Backend Configuration

### Database Setup

The app uses MySQL with these tables:
- `users` - User accounts
- `wallets` - User balance tracking
- `surveys` - Available surveys
- `offers` - Active offers
- `games` - Playable games
- `referrals` - Referral tracking
- `transactions` - Earnings history
- `withdrawals` - Withdrawal requests

### Payment Processing

**For Real Payments:**

1. Get Stripe API keys:
   - Visit https://dashboard.stripe.com
   - Copy Secret Key and Publishable Key

2. Get PayPal credentials:
   - Visit https://developer.paypal.com
   - Create app and copy Client ID/Secret

3. Set environment variables:
   ```
   STRIPE_SECRET_KEY=sk_...
   STRIPE_PUBLISHABLE_KEY=pk_...
   PAYPAL_CLIENT_ID=...
   PAYPAL_CLIENT_SECRET=...
   ```

### Email Notifications

**For Real Emails:**

1. Get SendGrid API key:
   - Visit https://sendgrid.com
   - Create account and get API key

2. Set environment variable:
   ```
   SENDGRID_API_KEY=SG...
   ```

## Deployment Options

### Option 1: Manus Platform (Recommended)

The app is already set up on Manus with:
- Automatic database provisioning
- Built-in payment processing
- Email service integration
- Auto-scaling infrastructure

**To publish:**
1. Click "Publish" button in Manus UI
2. App builds automatically
3. Get download link for APK

### Option 2: Self-Hosted

Deploy to your own server:

```bash
# Build server
npm run build

# Start server
npm start
```

Requires:
- Node.js server
- MySQL database
- Stripe/PayPal accounts
- SendGrid account

### Option 3: Cloud Platforms

Deploy to:
- **Vercel** (web version)
- **Firebase** (backend + database)
- **AWS** (full stack)
- **DigitalOcean** (VPS)

## Testing Checklist

Before distribution, test:

- [ ] User signup and login
- [ ] Survey completion and rewards
- [ ] Offer claiming
- [ ] Game playing
- [ ] Referral system
- [ ] Wallet balance updates
- [ ] Withdrawal requests
- [ ] Email notifications
- [ ] Payment processing

## Security Considerations

⚠️ **Before going live:**

1. **API Security**
   - Use HTTPS only
   - Validate all inputs
   - Implement rate limiting
   - Use API keys securely

2. **Database Security**
   - Enable SSL connections
   - Use strong passwords
   - Regular backups
   - Encrypt sensitive data

3. **Payment Security**
   - Never store card data
   - Use Stripe/PayPal for processing
   - PCI compliance
   - Fraud detection

4. **User Privacy**
   - Privacy policy
   - Data encryption
   - GDPR compliance
   - User consent

## Support & Troubleshooting

### App won't load

1. Check internet connection
2. Clear app cache
3. Restart device
4. Reinstall app

### Payments not working

1. Verify Stripe/PayPal credentials
2. Check payment method details
3. Ensure minimum withdrawal ($5)
4. Contact payment provider

### Emails not sending

1. Verify SendGrid API key
2. Check email address format
3. Review SendGrid logs
4. Check spam folder

## Next Steps

1. **Test the app** - Use Expo Go or web version
2. **Set up payments** - Add Stripe/PayPal credentials
3. **Configure emails** - Add SendGrid API key
4. **Build APK** - Generate standalone app
5. **Distribute** - Share download link with users
6. **Monitor** - Track earnings, withdrawals, user feedback

## Support

For issues or questions:
- Check logs: `.manus-logs/devserver.log`
- Review database: Management UI → Database
- Test endpoints: API at `https://3000-...`

---

**EarnBro v1.0** - Ready for distribution! 🚀
