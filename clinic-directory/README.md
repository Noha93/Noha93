# دليل العيادات - Clinic Directory App

A complete bilingual (Arabic/English) mobile app for finding clinics, doctors, and medical centers.

## Tech Stack
- **React Native** with **Expo SDK 51**
- **TypeScript**
- **React Navigation v6** (Stack + Bottom Tabs)
- **Expo Linear Gradient** for beautiful gradients
- **AsyncStorage** for local persistence
- **Context API** for state management

## Design System
- **Primary Color**: Deep Vintage Blue `#1B4F8A`
- **Accent**: Vintage Gold `#C9A84C`
- **Background**: Warm Cream `#F5ECD7`
- Supports RTL (Arabic) and LTR (English) layouts

## Features

### Patient App
- Browse doctors by specialization
- Search doctors by name, area, or specialty  
- View nearby doctors on map
- See weekly schedule and availability
- Book appointments with time slot selection
- View clinic photos and videos
- Read & write patient reviews and ratings
- Browse hospitals and medical centers
- View doctor details, education, and certificates

### Doctor Portal
- Full statistics dashboard with charts
- Manage clinic open/close status in real-time
- View and manage appointments
- Edit profile (bio, contact, address, schedule)
- Upload documents and licenses (verification)
- Subscription management (Free/Basic/Premium/Enterprise)
- Create and manage advertisements
- Add clinic photos and videos

## Setup & Installation

```bash
# Clone and navigate
cd clinic-directory

# Install dependencies
npm install

# Start Expo development server
npx expo start

# Run on specific platform
npx expo start --android
npx expo start --ios
```

## Project Structure

```
src/
├── constants/          # Design system (colors, typography, spacing, theme)
├── i18n/               # Arabic & English translations
├── types/              # TypeScript type definitions
├── data/               # Mock data (doctors, hospitals, appointments)
├── context/            # Auth & Language context providers
├── navigation/         # App, User & Doctor navigators
├── components/
│   ├── common/         # Button, Card, Input, Rating, Badge
│   ├── doctors/        # DoctorCard
│   └── hospitals/      # HospitalCard
└── screens/
    ├── Onboarding/     # Splash, Language, Onboarding slides
    ├── Auth/           # User & Doctor login/register
    ├── User/           # Home, Search, Nearby, DoctorDetail, Booking, etc.
    └── Doctor/         # Dashboard, Appointments, Profile, Documents, Subscription, Ads
```

## Demo Credentials
Any email and password work in demo mode.

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Blue | `#1B4F8A` | Main actions, headers |
| Dark Navy | `#0D2E52` | Header gradients |
| Light Blue | `#2980B9` | Accents, links |
| Vintage Gold | `#C9A84C` | Secondary actions, doctor portal |
| Warm Cream | `#F5ECD7` | Backgrounds |
| Success | `#27AE60` | Open status, verified |
| Error | `#E74C3C` | Closed status, warnings |
