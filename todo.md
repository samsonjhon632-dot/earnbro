# EarnBro App - TODO

## Core Features

### Authentication & Onboarding
- [x] Splash screen with app branding
- [x] Onboarding/welcome screen
- [x] Sign up flow (email, password, profile)
- [x] Login flow
- [x] Logout functionality
- [x] Session persistence
- [x] Password reset flow
- [x] Auth context and state management
- [x] Protected routes (tabs require login)

### Dashboard/Home Screen
- [x] Display user balance prominently
- [x] Show quick stats (earned today, pending, lifetime)
- [x] Recent activity list
- [x] Pull-to-refresh functionality

### Refer Page
- [x] Referral code display
- [x] Share referral functionality
- [x] Referral stats display
- [x] How it works section

### Wallet/Rewards Screen
- [x] Display current balance
- [x] Show pending rewards
- [x] Redemption options (PayPal, gift cards)
- [x] Recent activity/transactions
- [x] Settings quick access
- [x] Logout button

### Settings Screen
- [x] Account information display
- [x] Notification preferences with toggles
- [x] Appearance settings (dark mode, sound, haptics)
- [x] App customization options
- [x] Support & legal links
- [x] Logout functionality

### Surveys Screen
- [x] Fetch and display available surveys
- [x] Survey card UI with title, time, reward
- [x] Filter surveys by reward amount
- [x] Search surveys
- [x] Sort surveys (highest reward, quickest, etc.)
- [x] Category filtering
- [ ] Survey detail screen
- [ ] Start survey flow
- [ ] Survey completion tracking

### Offers Screen
- [x] Fetch and display available offers
- [x] Offer card UI with title, description, reward
- [x] Offer categories/filtering
- [x] Search offers
- [x] Sort offers (reward, expiring soon)
- [x] Expiry countdown display
- [ ] Claim offer functionality
- [ ] Offer detail screen
- [ ] Track claimed offers

### Games Screen
- [ ] Display available games
- [ ] Simple game implementation (e.g., scratch-off, daily trivia)
- [ ] Track game earnings
- [ ] Game completion rewards

### Notifications
- [ ] Push notification setup
- [ ] Notify on new high-paying surveys
- [ ] Notify on offer expiration
- [ ] Notify on reward approval

## UI/UX Polish
- [x] Custom app icon and branding (EarnBro neon logo)
- [x] Consistent color scheme and typography (futuristic neon dark theme)
- [x] Dark mode support
- [ ] Loading states for all async operations
- [ ] Error handling and user feedback
- [ ] Haptic feedback on interactions
- [ ] Responsive layout for different screen sizes

## Data & Backend
- [x] User context and state management
- [ ] User authentication system
- [ ] Database schema for users, surveys, offers, rewards
- [ ] API endpoints for fetching tasks
- [ ] Reward tracking and calculation
- [ ] Transaction history storage
- [ ] Local caching of task data

## Testing
- [ ] Unit tests for core functions
- [ ] Integration tests for user flows
- [ ] End-to-end testing of main features

## Deployment
- [ ] Generate APK for Android
- [ ] Generate IPA for iOS
- [ ] App store submission preparation
