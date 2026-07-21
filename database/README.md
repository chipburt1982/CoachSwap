# CoachSwap Database

## Structure

- `migrations/` - SQL files for schema creation (run in order)
- `seeds/` - Sample data for development
- `config/` - Database configuration

## Running Migrations

From backend directory:
```bash
npm run migrate
```

## Tables

- **users** - Coach profiles and auth
- **listings** - Equipment listings for sale/trade
- **listing_images** - Images for listings
- **messages** - Direct messages between coaches
- **reviews** - Ratings and feedback
- **transactions** - Payment records
