# CoachSwap API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### Users

#### Register
- **POST** `/users/register`
- Request body: `{ email, password, firstName, lastName, phone }`
- Response: `{ userId, token }`

#### Login
- **POST** `/users/login`
- Request body: `{ email, password }`
- Response: `{ userId, token }`

#### Get Profile
- **GET** `/users/:userId`
- Response: User object with profile details

#### Update Profile
- **PUT** `/users/:userId`
- Request body: Updated user fields
- Response: Updated user object

### Products/Equipment

#### Create Listing
- **POST** `/listings`
- Auth Required: Yes
- Request body: `{ title, description, category, condition, price, images, location }`
- Response: Created listing object

#### Get All Listings
- **GET** `/listings?category=&condition=&priceMin=&priceMax=&location=`
- Response: Array of listings

#### Get Listing Details
- **GET** `/listings/:listingId`
- Response: Listing details with seller info

#### Update Listing
- **PUT** `/listings/:listingId`
- Auth Required: Yes (owner only)
- Request body: Updated fields
- Response: Updated listing

#### Delete Listing
- **DELETE** `/listings/:listingId`
- Auth Required: Yes (owner only)
- Response: `{ success: true }`

### Messages

#### Send Message
- **POST** `/messages`
- Auth Required: Yes
- Request body: `{ recipientId, listingId, message }`
- Response: Created message object

#### Get Messages
- **GET** `/messages/:conversationId`
- Auth Required: Yes
- Response: Array of messages

### Reviews

#### Create Review
- **POST** `/reviews`
- Auth Required: Yes
- Request body: `{ reviewedUserId, rating, comment, listingId }`
- Response: Created review object

#### Get User Reviews
- **GET** `/reviews/user/:userId`
- Response: Array of reviews

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error
