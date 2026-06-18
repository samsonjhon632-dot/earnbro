# InboxRewards Mobile App Design

## Overview
InboxRewards is a mobile app that allows users to earn cash rewards by completing surveys, offers, and other online tasks. The app follows iOS Human Interface Guidelines for a polished, native feel.

## Screen List

1. **Splash/Onboarding** - Initial app launch screen
2. **Login/Sign Up** - User authentication screen
3. **Dashboard/Home** - Main screen showing available tasks and rewards summary
4. **Surveys** - List of available paid surveys
5. **Offers** - Wall of offers and deals
6. **Games** - Casual games for earning points
7. **Wallet/Rewards** - User's earned cash and redemption options
8. **Profile** - User account settings and preferences
9. **Task Detail** - Detailed view of a survey or offer
10. **Redemption** - Cash out to PayPal or gift cards

## Primary Content and Functionality

### Dashboard/Home Screen
- **Header**: User greeting ("Welcome, [Name]!"), current balance in large, prominent text
- **Quick Stats**: Cards showing total earned today, pending rewards, lifetime earnings
- **Featured Tasks**: Carousel of high-paying surveys and offers
- **Task Categories**: Horizontal scrollable tabs (Surveys, Offers, Games)
- **Recent Activity**: List of recently completed tasks with earnings

### Surveys Screen
- **List View**: Scrollable list of available surveys
- **Survey Card**: Shows survey title, estimated time, reward amount, and completion percentage
- **Filters**: Filter by reward amount, time required, category
- **Search**: Search for specific surveys

### Offers Screen
- **Offer Wall**: Grid or list of available offers
- **Offer Card**: Shows offer title, description, reward, and expiration date
- **Categories**: Filter by offer type (shopping, apps, services)
- **Claim Button**: One-tap to claim an offer

### Wallet/Rewards Screen
- **Balance Display**: Large prominent display of current balance
- **Pending Rewards**: List of tasks awaiting approval or completion
- **Redemption Options**: PayPal, gift cards (Amazon, Walmart, etc.)
- **Redemption History**: Past cash-outs with dates and amounts
- **Minimum Threshold**: Display minimum amount required to cash out

### Profile Screen
- **User Info**: Display name, email, account status
- **Account Settings**: Notification preferences, privacy settings
- **Referral Link**: Share referral code to earn bonuses
- **Support**: Contact support, FAQ, terms
- **Logout**: Sign out button

## Key User Flows

### Flow 1: Complete a Survey
1. User taps "Surveys" tab
2. Browses survey list, taps on a survey
3. Views survey details (time, reward, questions preview)
4. Taps "Start Survey"
5. Completes survey questions
6. Receives confirmation and reward notification
7. Returns to dashboard, balance updates

### Flow 2: Claim an Offer
1. User taps "Offers" tab
2. Browses offer wall
3. Taps on an offer to view details
4. Taps "Claim Offer"
5. Offer is added to active tasks
6. User completes the required action (install app, make purchase, etc.)
7. Reward is credited to account

### Flow 3: Cash Out Rewards
1. User taps "Wallet" tab
2. Views current balance
3. Taps "Cash Out"
4. Selects redemption method (PayPal, gift card)
5. Confirms amount and destination
6. Transaction is processed
7. Confirmation screen with transaction details

## Color Choices

- **Primary Green**: #10B981 - Main action color, represents growth and earning
- **Background**: #FFFFFF (light) / #0F172A (dark) - Clean, minimal aesthetic
- **Surface**: #F3F4F6 (light) / #1E293B (dark) - Cards and elevated surfaces
- **Text Primary**: #111827 (light) / #F1F5F9 (dark) - Main text
- **Text Secondary**: #6B7280 (light) / #94A3B8 (dark) - Secondary text
- **Accent Gold**: #F59E0B - Highlight rewards and achievements
- **Success Green**: #34D399 - Confirmation and completion states
- **Warning Orange**: #FB923C - Time-sensitive offers and alerts

## Layout Principles

- **One-Handed Usage**: All interactive elements positioned within thumb reach
- **Portrait Orientation**: Optimized for 9:16 aspect ratio
- **Clear Hierarchy**: Large, readable text for earnings amounts; secondary info in smaller text
- **Minimal Clutter**: Focus on task cards and earnings display
- **Consistent Navigation**: Tab bar at bottom for main sections
- **Generous Spacing**: Adequate padding and margins for touch targets (minimum 44x44pt)
