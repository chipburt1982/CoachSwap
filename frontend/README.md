# Frontend README

## Setup

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

## Environment Variables

Update `.env.local`:
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe public key

## Pages

- `/` - Home page
- `/auth/login` - Login page
- `/auth/signup` - Registration page
- `/listings` - Browse all listings
- `/listings/create` - Create new listing
- `/listings/[id]` - Listing details
- `/profile` - User profile
- `/messages` - Message conversations

## Technologies

- Next.js 14
- React 18
- Tailwind CSS
- Axios
- React Hook Form
- Zustand (state management)
