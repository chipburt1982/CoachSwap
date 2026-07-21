# CoachSwap - Complete Setup & Deployment Guide

## 🚀 Quick Start (Development)

### Prerequisites
- Node.js v18+
- PostgreSQL 14+
- npm or yarn
- Git
- Stripe account (for payments)
- AWS account (for S3 image storage - optional)

### Step 1: Clone & Install

```bash
# Clone the repository
git clone https://github.com/chipburt1982/CoachSwap.git
cd CoachSwap

# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Step 2: Environment Setup

#### Backend Configuration

Create `backend/.env`:

```bash
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/coachswap

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_in_production

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# AWS S3 (Optional)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET=coachswap-images
AWS_REGION=us-east-1
```

#### Frontend Configuration

Create `frontend/.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
```

### Step 3: Database Setup

```bash
# Create PostgreSQL database
creatdb coachswap

# Run migrations from backend directory
cd backend
npm run migrate

# (Optional) Load sample data
psql -U postgres -d coachswap -f ../database/seeds/sample-data.sql
cd ..
```

### Step 4: Run Application

**Option A: Concurrent Mode (Recommended)**

```bash
# From root directory - runs both frontend and backend
npm run dev
```

Access the app:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

**Option B: Separate Terminals**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

---

## 🏗️ Project Structure

```
CoachSwap/
├── backend/
│   ├── server.js              # Express app entry point
│   ├── config/                # Configuration files
│   ├── middleware/            # Auth, validation middleware
│   ├── routes/                # API route handlers
│   ├── package.json
│   └── .env
├── frontend/
│   ├── pages/                 # Next.js pages/routes
│   ├── components/            # React components
│   ├── lib/                   # API client, state management
│   ├── styles/                # Global styles
│   ├── package.json
│   └── .env.local
├── database/
│   ├── migrations/            # SQL migration files
│   ├── seeds/                 # Sample data
│   ├── config/                # Database config
│   └── scripts/               # Migration runner
├── docs/                      # Documentation
├── package.json               # Root package.json
└── README.md
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "coach@example.com",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1-555-0000"
}

Response:
{
  "userId": 1,
  "email": "coach@example.com",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "message": "User registered successfully"
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "coach@example.com",
  "password": "securepassword123"
}

Response:
{
  "userId": 1,
  "email": "coach@example.com",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "message": "Login successful"
}
```

### Listing Endpoints

#### Create Listing
```http
POST /listings
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Riddell Speedflex Helmet",
  "description": "Adult helmet in excellent condition",
  "category": "Helmets",
  "condition": "Good",
  "price": 149.99,
  "location": "Dallas, TX",
  "forTrade": false
}
```

#### Get All Listings
```http
GET /listings?category=Helmets&condition=Good&priceMin=100&priceMax=200&location=Dallas&page=1
```

#### Get Listing Details
```http
GET /listings/:listingId
```

### Message Endpoints

#### Send Message
```http
POST /messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "recipientId": 2,
  "listingId": 1,
  "message": "Is this helmet still available?"
}
```

#### Get Conversations
```http
GET /messages
Authorization: Bearer <token>
```

#### Get Conversation with User
```http
GET /messages/conversation/:userId
Authorization: Bearer <token>
```

### Review Endpoints

#### Create Review
```http
POST /reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "reviewedUserId": 2,
  "rating": 5,
  "comment": "Great seller, fast shipping!",
  "listingId": 1
}
```

#### Get User Reviews
```http
GET /reviews/user/:userId?page=1&limit=10
```

---

## 💳 Stripe Integration

### Create Payment Intent
```http
POST /transactions/payment-intent
Authorization: Bearer <token>
Content-Type: application/json

{
  "listingId": 1,
  "amount": 149.99
}

Response:
{
  "clientSecret": "pi_1234_secret_5678",
  "transactionId": 42
}
```

### Confirm Payment
```http
POST /transactions/confirm-payment
Authorization: Bearer <token>
Content-Type: application/json

{
  "transactionId": 42,
  "paymentIntentId": "pi_1234"
}
```

---

## 🔐 Security Best Practices

1. **Environment Variables**
   - Never commit `.env` files
   - Use `.env.example` as template
   - Rotate secrets regularly

2. **JWT Tokens**
   - Tokens expire after 7 days
   - Always send with `Authorization: Bearer <token>` header
   - Never store sensitive data in token payload

3. **Database**
   - Use prepared statements (already implemented)
   - Passwords hashed with bcryptjs
   - SQL injection protection built-in

4. **CORS**
   - Frontend and backend must be on same domain in production
   - CORS headers configured in Express

---

## 🚢 Production Deployment

### Backend (Heroku/Railway/Render)

1. Set environment variables on platform
2. Create PostgreSQL database on platform
3. Run migrations: `npm run migrate`
4. Deploy: `git push heroku main`

### Frontend (Vercel/Netlify)

1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Database (AWS RDS)

1. Create RDS PostgreSQL instance
2. Update `DATABASE_URL` in backend `.env`
3. Run migrations

---

## 🧪 Testing

### Run Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Manual API Testing

Use Postman or cURL:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

## 📊 Database Schema

### Users Table
- `id` - Primary key
- `email` - Unique email address
- `password` - Bcrypt hashed password
- `first_name`, `last_name` - Coach name
- `phone` - Contact number
- `bio` - Coach bio
- `profile_image_url` - AWS S3 image URL
- `location` - City/State
- `verified` - Email verification status
- `average_rating` - Calculated from reviews
- `created_at`, `updated_at` - Timestamps

### Listings Table
- `id` - Primary key
- `user_id` - Foreign key to users (seller)
- `title` - Equipment title
- `description` - Detailed description
- `category` - Equipment type
- `condition` - Item condition
- `price` - Sale price
- `for_trade` - Open to trades?
- `location` - Sale location
- `status` - active/sold/removed
- `created_at`, `updated_at` - Timestamps

### Transactions Table
- `id` - Primary key
- `listing_id` - Foreign key to listings
- `buyer_id` - Foreign key to users (buyer)
- `seller_id` - Foreign key to users (seller)
- `transaction_type` - sale/trade
- `amount` - Transaction amount
- `stripe_payment_id` - Stripe payment intent ID
- `status` - pending/completed/failed
- `created_at`, `updated_at` - Timestamps

---

## 🐛 Troubleshooting

### Database Connection Error
```
Error: ECONNREFUSED 127.0.0.1:5432
```
**Solution:** Make sure PostgreSQL is running and `DATABASE_URL` is correct.

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Kill existing process or change PORT in `.env`

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** Ensure backend CORS is configured correctly. Check frontend API URL matches backend origin.

### JWT Token Expired
```
Error: Invalid or expired token
```
**Solution:** User needs to login again. Tokens expire after 7 days.

---

## 📞 Support

For issues or questions:
1. Check the documentation in `/docs`
2. Review API examples above
3. Check GitHub issues
4. Contact development team

---

## 📝 License

MIT License - See LICENSE file for details
