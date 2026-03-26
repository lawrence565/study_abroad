# StudyAbroad Hub

StudyAbroad Hub is a minimal Next.js MVP for study-abroad planning. The current web surface is a dashboard that links the delivered routes and keeps the remaining product areas explicitly deferred.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start the local app:

```bash
npm run dev
```

3. Open the app at the local Next.js URL printed by the dev server.

## Verification

Run the targeted landing-page integration test:

```bash
npm test -- src/app/page.integration.test.tsx
```

Run the full test suite:

```bash
npm test
```

Build the app:

```bash
npm run build
```

## Delivered Routes

- `/` - landing dashboard
- `/explorer` - School Explorer
- `/profile-match` - Profile Match
- `/verification` - Verification
- `/sign-in` - demo role switcher

## Deferred Modules

- Area Guide
- Marketplace
- Events

## Demo Session

The app uses a cookie-backed demo session instead of Firebase Auth for the MVP closure. The current role is read from the `demo_role` cookie, and the sign-in route lets you switch between the demo roles without a real backend.

Firebase Auth and Firestore are the planned replacement when the production auth/data stack is introduced.
