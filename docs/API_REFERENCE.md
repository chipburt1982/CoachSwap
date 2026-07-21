# CoachSwap API Reference

## Overview

CoachSwap API provides RESTful endpoints for managing coaches, equipment listings, messages, reviews, and transactions.

## Base URL

```
https://api.coachswap.com/api  (Production)
http://localhost:5000/api       (Development)
```

## Authentication

All protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Response Format

All responses are JSON. Success responses return 200-201, errors return 400-500.

```json
{
  "data": {},
  "error": null,
  "message": "Success"
}
```

---

## 🔐 Authentication Endpoints

### POST /auth/register

Register a new coach account.

**Request Body:**
```json
{
  "email": "coach@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1-555-0001"
}
```

**Response (201):**
```json
{
  "userId": 1,
  "email": "coach@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "User registered successfully"
}
```

**Validation:**
- Email must be valid and unique
- Password must be 8+ characters
- First/Last name required
- Phone optional

---

### POST /auth/login

Authenticate and receive JWT token.

**Request Body:**
```json
{
  "email": "coach@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "userId": 1,
  "email": "coach@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login successful"
}
```

---

## 👤 User Endpoints

### GET /users/:userId

Get coach profile information.

**Response (200):**
```json
{
  "id": 1,
  "email": "coach@example.com",
  "first_name": "John",
  "last_name": "Smith",
  "phone": "+1-555-0001",
  "bio": "High school football coach",
  "profile_image_url": "https://...",
  "location": "Dallas, TX",
  "verified": true,
  "average_rating": 4.8,
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

### PUT /users/:userId

**Protected Endpoint** - Update profile information.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1-555-0001",
  "bio": "Updated bio",
  "location": "Austin, TX",
  "profileImageUrl": "https://..."
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": { ... }
}
```

---

### GET /users/:userId/reviews

Get reviews for a coach.

**Query Parameters:**
- `page` (default: 1) - Page number
- `limit` (default: 10) - Results per page

**Response (200):**
```json
{
  "reviews": [
    {
      "id": 1,
      "rating": 5,
      "comment": "Great seller!",
      "first_name": "Sarah",
      "last_name": "Johnson",
      "profile_image_url": "https://...",
      "created_at": "2024-01-10T15:45:00Z"
    }
  ],
  "total": 42,
  "page": 1,
  "limit": 10
}
```

---

## 📦 Listing Endpoints

### POST /listings

**Protected Endpoint** - Create new equipment listing.

**Request Body:**
```json
{
  "title": "Riddell Speedflex Helmet",
  "description": "Adult helmet worn for one season. Excellent condition.",
  "category": "Helmets",
  "condition": "Good",
  "price": 149.99,
  "location": "Dallas, TX",
  "forTrade": false,
  "images": [
    "https://s3.amazonaws.com/...",
    "https://s3.amazonaws.com/..."
  ]
}
```

**Response (201):**
```json
{
  "id": 1,
  "message": "Listing created successfully"
}
```

**Validation:**
- Title: 1-255 characters
- Description: 10+ characters
- Price: Positive number
- Category/Condition: Must be valid

---

### GET /listings

Browse all active listings with filtering.

**Query Parameters:**
```
?category=Helmets
&condition=Good
&priceMin=50
&priceMax=200
&location=Dallas
&page=1
&limit=20
```

**Response (200):**
```json
{
  "listings": [
    {
      "id": 1,
      "user_id": 1,
      "title": "Riddell Speedflex Helmet",
      "category": "Helmets",
      "condition": "Good",
      "price": 149.99,
      "location": "Dallas, TX",
      "status": "active",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 234,
  "page": 1,
  "limit": 20
}
```

---

### GET /listings/:listingId

Get detailed listing information.

**Response (200):**
```json
{
  "id": 1,
  "user_id": 1,
  "title": "Riddell Speedflex Helmet",
  "description": "Adult helmet...",
  "category": "Helmets",
  "condition": "Good",
  "price": 149.99,
  "location": "Dallas, TX",
  "status": "active",
  "first_name": "John",
  "last_name": "Smith",
  "profile_image_url": "https://...",
  "average_rating": 4.8,
  "images": [
    "https://s3.amazonaws.com/..."
  ],
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

### PUT /listings/:listingId

**Protected Endpoint** - Update listing (owner only).

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "condition": "Fair",
  "price": 129.99,
  "location": "Austin, TX",
  "status": "active"
}
```

---

### DELETE /listings/:listingId

**Protected Endpoint** - Delete listing (owner only).

**Response (200):**
```json
{
  "message": "Listing deleted successfully"
}
```

---

## 💬 Message Endpoints

### POST /messages

**Protected Endpoint** - Send message to another coach.

**Request Body:**
```json
{
  "recipientId": 2,
  "listingId": 1,
  "message": "Is this helmet still available?"
}
```

**Response (201):**
```json
{
  "message": "Message sent successfully",
  "data": {
    "id": 42,
    "sender_id": 1,
    "recipient_id": 2,
    "listing_id": 1,
    "message": "Is this helmet still available?",
    "read": false,
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

---

### GET /messages

**Protected Endpoint** - Get all conversations for logged-in user.

**Response (200):**
```json
[
  {
    "user_id": 2,
    "last_message": "Yes, it's still available!",
    "last_message_at": "2024-01-15T10:30:00Z"
  }
]
```

---

### GET /messages/conversation/:userId

**Protected Endpoint** - Get conversation with specific user.

**Response (200):**
```json
[
  {
    "id": 1,
    "sender_id": 1,
    "recipient_id": 2,
    "message": "Is this available?",
    "read": true,
    "created_at": "2024-01-15T10:25:00Z",
    "first_name": "John",
    "last_name": "Smith",
    "profile_image_url": "https://..."
  },
  {
    "id": 2,
    "sender_id": 2,
    "recipient_id": 1,
    "message": "Yes, still available!",
    "read": true,
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

---

## ⭐ Review Endpoints

### POST /reviews

**Protected Endpoint** - Leave review for another coach.

**Request Body:**
```json
{
  "reviewedUserId": 2,
  "rating": 5,
  "comment": "Great seller, fast shipping!",
  "listingId": 1
}
```

**Validation:**
- Rating: 1-5 stars
- Comment: Max 1000 characters
- Cannot review yourself

**Response (201):**
```json
{
  "message": "Review created successfully",
  "review": {
    "id": 1,
    "reviewer_id": 1,
    "reviewed_user_id": 2,
    "rating": 5,
    "comment": "Great seller!",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

---

### GET /reviews/user/:userId

Get reviews for a coach.

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)

---

## 💳 Transaction Endpoints

### POST /transactions/payment-intent

**Protected Endpoint** - Create Stripe payment intent.

**Request Body:**
```json
{
  "listingId": 1,
  "amount": 149.99
}
```

**Response (200):**
```json
{
  "clientSecret": "pi_1234_secret_5678",
  "transactionId": 42
}
```

---

### POST /transactions/confirm-payment

**Protected Endpoint** - Confirm payment after Stripe submission.

**Request Body:**
```json
{
  "transactionId": 42,
  "paymentIntentId": "pi_1234"
}
```

**Response (200):**
```json
{
  "message": "Payment confirmed successfully",
  "status": "completed"
}
```

---

### GET /transactions

**Protected Endpoint** - Get transactions for logged-in user.

**Query Parameters:**
- `type` (all/bought/sold) - Filter transaction type

**Response (200):**
```json
[
  {
    "id": 1,
    "listing_id": 1,
    "buyer_id": 1,
    "seller_id": 2,
    "amount": 149.99,
    "status": "completed",
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation failed",
  "errors": [
    {
      "param": "email",
      "message": "Invalid email address"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Access token required"
}
```

### 403 Forbidden
```json
{
  "error": "Unauthorized to perform this action"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

API endpoints are rate limited to 100 requests per minute per IP address.

## Pagination

List endpoints support pagination:
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 20, max: 100)

## Sorting

List endpoints sorted by `created_at DESC` by default.

---

For more details, see [DEPLOYMENT.md](./DEPLOYMENT.md)
