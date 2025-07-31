# TrailBlaze Backend

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file (see `.env.example`).
3. Start the server:
   ```bash
   node index.js
   ```

## API Endpoints
- `GET /api/trails` – List all MTB trails
- `GET /api/trails/:id` – Get trail by ID
- `POST /api/bookings` – Create a booking
- `POST /api/rentals` – Create a rental
- `GET /api/reviews?trail_id=ID` – Get reviews for a trail
- `POST /api/reviews` – Submit a review
- `GET /api/members` – List all members
- `POST /api/members` – Register a member
- `POST /api/support` – Send support message

## Database Schema
- `trails` (id, name, location, difficulty, description)
- `bookings` (id, user_name, email, trail_id, date, free_shuttle, guide_assigned)
- `rentals` (id, user_name, email, equipment_type, duration)
- `reviews` (id, trail_id, user_name, comment, rating)
- `members` (id, name, email, is_active)
- `support_messages` (id, name, email, message, created_at)

---

# TrailBlaze Frontend

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```

## Features
- Homepage: List of MTB trails
- Booking, Rental, Membership, Contact forms
- Reviews for each trail
- Responsive, Tailwind CSS design
- API proxy to backend

## Environment Variables
- PORT
- DB_HOST
- DB_USER
- DB_PASSWORD
- DB_NAME 