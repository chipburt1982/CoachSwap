# CoachSwap Setup Guide

## Prerequisites

- Node.js v18+
- PostgreSQL 14+
- npm or yarn
- Git

## Environment Variables

Create `.env` files in both frontend and backend directories:

### Backend (.env)

```
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/coachswap
JWT_SECRET=your_jwt_secret_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_S3_BUCKET=coachswap-images
AWS_REGION=us-east-1
NODE_ENV=development
```

### Frontend (.env.local)

```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_publishable_key
```

## Installation

### Backend Setup

```bash
cd backend
npm install
npm run migrate
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Database Setup

```bash
# Create database
creatdb coachswap

# Run migrations
cd backend
npm run migrate
```

## Running the Application

```bash
# From root directory
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Running Tests

```bash
npm test
```

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure database exists

### Port Already in Use
- Change PORT in .env files
- Or kill existing process: `lsof -ti :5000 | xargs kill -9`

## Next Steps

See the main README.md for feature documentation and architecture details.
