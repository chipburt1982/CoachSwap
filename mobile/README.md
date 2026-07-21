# CoachSwap Mobile App

React Native mobile application built with Expo.

## Installation

```bash
cd mobile
npm install
```

## Setup

1. Copy `.env.example` to `.env`
2. Add your API URL and Stripe key
3. Run `npm start`

## Running

```bash
# Start Expo
npm start

# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## Features

- ✅ User authentication (login/signup)
- ✅ Browse equipment listings
- ✅ Create new listings
- ✅ **Membership dues payments**
- ✅ **Recurring/auto-pay setup**
- ✅ **Payment history & invoices**
- ✅ Messaging between coaches
- ✅ User profiles & reviews
- ✅ Camera & photo uploads
- ✅ Push notifications

## Dues Payment System

The app includes a complete dues payment system:

### Screens
1. **Dues Status** - View current dues and payment status
2. **Payment Options** - Choose one-time or recurring payment
3. **Payment History** - View all past payments
4. **Setup Auto-Pay** - Configure monthly/quarterly/yearly billing

### Features
- View due amount and due date
- One-time payment with Stripe
- Automatic recurring billing
- Payment history with status
- Invoice generation
- Payment reminders (push notifications)

## Architecture

```
mobile/
├── App.js                 # Main entry point
├── navigation/
│   └── RootNavigator.js   # Navigation structure
├── screens/
│   ├── AuthScreens.js     # Login/Signup
│   ├── ListingsScreens.js # Browse/Create listings
│   ├── DuesScreens.js     # Dues payment screens
│   ├── MessagesScreen.js  # Messaging
│   └── ProfileScreen.js   # User profile
├── components/
│   └── UI.js              # Reusable components
├── lib/
│   ├── api.js             # API client
│   └── store.js           # State management
└── assets/                # Images & icons
```

## Technology Stack

- **React Native** - Mobile framework
- **Expo** - Development platform
- **React Navigation** - Routing
- **Zustand** - State management
- **Axios** - HTTP client
- **Stripe** - Payment processing
- **Expo Camera** - Photo capture
- **Expo Notifications** - Push notifications

## API Endpoints Used

### Authentication
- `POST /auth/register`
- `POST /auth/login`

### Listings
- `GET /listings`
- `POST /listings`
- `GET /listings/:id`

### Dues Payment
- `GET /dues/status`
- `POST /dues/payment-intent`
- `POST /dues/confirm-payment`
- `GET /dues/history`
- `POST /dues/recurring`
- `GET /dues/invoices`

### Messages
- `GET /messages`
- `POST /messages`
- `GET /messages/conversation/:userId`

### Users
- `GET /users/:userId`
- `PUT /users/:userId`

## Testing the App

1. Install Expo Go on your phone
2. Run `npm start`
3. Scan QR code with Expo Go
4. Test features in development mode

## Building for Production

```bash
# Build for iOS
expo build:ios

# Build for Android
expo build:android

# Submit to App Store
expot submit:ios

# Submit to Google Play
expo submit:android
```

## Environment Variables

```
EXPO_PUBLIC_API_URL=https://api.coachswap.com/api
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Support

For issues or questions, see the main [README.md](../README.md)
