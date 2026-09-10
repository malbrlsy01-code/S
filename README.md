# Sana Tower Backend

Backend API for the Sana Tower website using **Node.js + Express + MongoDB + JWT**.

## Features

- Admin login with JWT
- Password hashing with bcrypt
- Protected admin endpoints
- Leads / العملاء
- Units / الوحدات with availability status
- CRUD API for units
- CRUD API for leads
- Public endpoint to submit a lead from the website
- `.env.example`
- Helmet, CORS and login rate limiting

## Requirements

- Node.js 18+
- MongoDB local or MongoDB Atlas

## Setup

```bash
npm install
copy .env.example .env
```

On macOS/Linux:

```bash
cp .env.example .env
```

Edit `.env` and set at least:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/sana_tower
JWT_SECRET=use_a_long_random_secret
ADMIN_EMAIL=admin@sana-tower.local
ADMIN_PASSWORD=ChangeMe123!
```

Create the first admin:

```bash
npm run seed:admin
```

Start development server:

```bash
npm run dev
```

Production:

```bash
npm start
```

API base URL: `http://localhost:5000/api`

## API

### Auth

`POST /api/auth/login`

```json
{
  "email": "admin@sana-tower.local",
  "password": "ChangeMe123!"
}
```

Returns a JWT. Send it for protected routes:

```http
Authorization: Bearer YOUR_TOKEN
```

`GET /api/auth/me` — protected.

### Units

- `GET /api/units` — public; optional `?type=Commercial&status=available`
- `GET /api/units/:id` — public
- `POST /api/units` — admin
- `PATCH /api/units/:id` — admin
- `DELETE /api/units/:id` — admin

Example unit:

```json
{
  "code": "SANA-C-001",
  "type": "Commercial",
  "title": "Commercial Unit",
  "description": "Ground-floor unit",
  "floor": "Ground",
  "area": 85,
  "price": 2500000,
  "status": "available",
  "view": "Sea view"
}
```

Allowed statuses: `available`, `reserved`, `sold`.

### Leads

`POST /api/leads` is public so the website contact form can submit customers.

```json
{
  "name": "Ahmed Ali",
  "phone": "01000000000",
  "email": "ahmed@example.com",
  "unitType": "Commercial",
  "message": "I want more details"
}
```

Admin endpoints:

- `GET /api/leads?page=1&limit=20&status=new`
- `GET /api/leads/:id`
- `PATCH /api/leads/:id`
- `DELETE /api/leads/:id`

Lead statuses: `new`, `contacted`, `qualified`, `closed`.

## Connecting the current Sana Tower frontend

Replace the current EmailJS submission in `index.html` with a `fetch` request to:

```text
POST http://localhost:5000/api/leads
```

Map the existing form fields as follows:

- `name` → name
- `phone` → phone
- `email` → email
- `unit` → unitType

For production, change `CORS_ORIGIN` to the real frontend domain and use HTTPS.

## Suggested next step

Build an Admin Dashboard that uses these endpoints to:

1. Login
2. View leads
3. Change lead status
4. Add/edit/delete units
5. Change unit availability
6. Search/filter leads and units

## Front-end integration
The Sana Tower contact form now sends leads to `POST /api/leads` instead of EmailJS.
Run the front-end with a local server such as VS Code Live Server on port 5500, and keep `CORS_ORIGIN=http://localhost:5500` in `.env`.

## Admin dashboard
After starting the API, open `http://localhost:5000/admin/` and log in with the admin credentials from `.env` (after running `npm run seed:admin`).
