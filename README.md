# Travel Guru

Travel Guru is a portfolio-ready travel booking web app built with React, Vite, Tailwind CSS, React Router, and Firebase. It started as a travel-themed UI and evolved into a fuller product-style demo with authentication, protected routes, booking history, search filtering, stay details, content pages, and an admin dashboard.

## Project Highlights

- Destination discovery flow across multiple Bangladesh travel moods
- Booking form with route, guest count, and date selection
- Booking confirmation and matching stay results
- Search filters for rating, guest fit, flexible stays, and sorting
- Stay detail pages with trip snapshot and booking context
- Email/password auth, Google sign-in, password reset, and protected routes
- Saved bookings and cancellation request flow for signed-in users
- Admin dashboard for booking moderation and contact inbox review
- Blog and news content with dedicated detail pages
- Firebase Auth + Firestore integration with rules and index setup

## Tech Stack

- React 19
- Vite 8
- React Router 7
- Tailwind CSS 4
- Firebase Authentication
- Firestore
- ESLint 9

## Main User Flow

1. Browse destinations from the homepage or destination page
2. Open a destination booking form
3. Enter route, date range, and guest count
4. View booking confirmation
5. Open matching stays and filter the result list
6. Review stay details
7. Save bookings to an authenticated account
8. Review saved trips in My Bookings

## Admin Flow

1. Sign in with a Firebase user that has an `admin: true` custom claim
2. Open the admin dashboard
3. Review bookings across all travelers
4. Update booking status
5. Review contact messages sent from the public contact page

## Key Features

### Traveler Features

- Destination-first browsing experience
- Dynamic booking flow with confirmation state
- Search results with sorting and filtering
- Stay detail page for selected results
- Saved booking history
- Booking cancellation request flow
- Profile overview page

### Content Features

- Blog listing page
- Blog detail pages
- News listing page
- News detail pages

### Admin Features

- Admin route protection
- Booking moderation tools
- Destination and keyword filtering
- Contact inbox review

## Security Notes

- Firestore rules restrict booking reads and updates by ownership/admin claim
- Contact messages are readable only by admins
- Frontend admin access is based on Firebase custom claims, not a client-side email list
- Service account JSON files should stay outside the repo or in ignored local paths

Included files:

- [firestore.rules](./firestore.rules)
- [firestore.indexes.json](./firestore.indexes.json)
- [firebase.json](./firebase.json)
- [scripts/set-admin-claim.mjs](./scripts/set-admin-claim.mjs)

## Screenshots

Available local screenshots:

- [`screenshot/1 Home.png`](./screenshot/1%20Home.png)
- [`screenshot/2 Booking.png`](./screenshot/2%20Booking.png)
- [`screenshot/3Login.png`](./screenshot/3Login.png)
- [`screenshot/4 Create account.png`](./screenshot/4%20Create%20account.png)
- [`screenshot/5Search.png`](./screenshot/5Search.png)

## Local Development

1. Install dependencies

```bash
npm install
```

2. Start the development server

```bash
npm run dev
```

3. Build for production

```bash
npm run build
```

4. Run lint checks

```bash
npm run lint
```

## Firebase Setup

1. Copy `.env.example` to `.env`
2. Add your Firebase web app credentials
3. Enable Email/Password sign-in in Firebase Authentication
4. Create a Firestore database
5. Deploy Firestore rules

```bash
firebase deploy --only firestore:rules
```

6. Deploy Firestore indexes

```bash
firebase deploy --only firestore:indexes
```

7. Grant an admin custom claim when you want dashboard moderation access

```bash
npm install firebase-admin
npm run grant-admin -- --email you@example.com --serviceAccount ./service-account.json --projectId your-project-id
```

Important:

- without Firebase config, protected booking and contact features remain in demo mode
- without a Firebase `admin: true` custom claim, admin dashboard access stays locked
- if a user signs in with multiple providers linked to the same Firebase account, the same admin claim will apply to that identity

## Project Structure

- `src/pages` route-level screens
- `src/components` shared UI components
- `src/hooks` reusable hooks
- `src/services` Firebase and domain helpers
- `src/context` auth and toast providers
- `src/data` destination, stay, blog, and news content
- `src/assets` optimized local assets
- `images` original visual assets

## Current Status

This project is portfolio-ready and demonstrates:

- multi-route app architecture
- authenticated and protected flows
- admin tooling
- Firestore-backed booking logic
- content pages with detail routes
- search/filter UI
- reusable service and data layers

## Recommended Final Portfolio Steps

- add a live deployment link
- add a short demo video or GIF
- add automated tests for routes and service logic
- continue final responsive/header polish
- replace static stay content with backend-driven data if you want a stronger production-style case study
