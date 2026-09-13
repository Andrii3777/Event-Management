# Event Management

## Overview

A REST API for managing events and registrations, with a React/TypeScript client. Users
register, log in, browse and filter events, create/edit/delete the events they organize, and
register or cancel their registration for events organized by others. Registration sends an
asynchronous confirmation email.

## Tech Stack

**Backend:** Python 3.12, Django 5.x, Django REST Framework, PostgreSQL 16,
djangorestframework-simplejwt (+ token blacklist), django-filter, drf-spectacular, Celery, Redis,
gunicorn, whitenoise, pytest, ruff.

**Frontend:** React 18, TypeScript, Vite, React Router, TanStack Query, Axios, React Hook Form,
Zod, Tailwind CSS.

**Infrastructure:** Docker Compose, nginx (serves the frontend build and proxies `/api`,
`/admin`, `/static` to the backend on one origin).

## Features

- Email/password authentication with JWT stored in HttpOnly cookies, refresh rotation, and
  logout blacklisting.
- Event CRUD: any authenticated user can create an event and becomes its organizer; only the
  organizer can update or delete it.
- Registration and cancellation, with a duplicate-registration guard enforced at the database
  level.
- Search, location/date filtering, ordering, and pagination on the events list.
- Async confirmation email on registration (Celery + Redis), sent only after the DB transaction
  commits.
- OpenAPI schema with Swagger UI and ReDoc.
- Responsive UI with loading, error, and empty states throughout.

## Project Structure

```text
backend/
  apps/
    users/          user model, auth, JWT cookies
    events/         event model, CRUD API, filters
    registrations/  registration model, register/cancel service, email task
    common/         shared DRF schema helpers
  config/           settings, root URLs, Celery app, middleware
frontend/
  src/
    api/            axios client, TanStack Query client
    components/      reusable UI (Button, EventCard, EventForm, ...)
    features/        per-domain hooks, API calls, types, schemas
    pages/           route-level pages
    routes/          route guards
docker-compose.yml
```

## Getting Started

Requires Docker and Docker Compose.

```bash
cp .env.example .env
docker compose up --build
```

The app is served at `http://localhost:3000`. The backend is also reachable directly at
`http://localhost:8000` for debugging.

## Environment Variables

All variables are read from `.env` (see `.env.example` for the full list with comments).

| Variable | Purpose |
|---|---|
| `DEBUG` | Django debug mode |
| `SECRET_KEY` | Django secret key |
| `ALLOWED_HOSTS` | Comma-separated allowed hosts |
| `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_HOST`, `POSTGRES_PORT` | Database connection |
| `REDIS_URL` | Celery broker |
| `CSRF_TRUSTED_ORIGINS` | Origins allowed to pass Django's CSRF check |
| `COOKIE_SECURE` | Sets the `Secure` flag on auth cookies (enable in production, HTTPS only) |
| `ACCESS_TOKEN_LIFETIME_MINUTES`, `REFRESH_TOKEN_LIFETIME_DAYS` | JWT lifetimes |
| `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD` | SMTP settings; leave `EMAIL_HOST` empty to print mail to the `celery-worker` log instead |
| `DJANGO_LOG_LEVEL` | Root/Django logger level |
| `DEMO_USER_PASSWORD` | Password set on `seed_demo` users |

`DATABASE_URL` and `CORS_ALLOWED_ORIGINS` are named by the brief but intentionally unused: the
database is configured via the discrete `POSTGRES_*` variables, and there is no cross-origin
traffic to allow (see Architecture Decisions).

## Running with Docker

```bash
docker compose up --build
```

This builds and starts PostgreSQL, Redis, the Django backend (gunicorn, behind whitenoise),
a Celery worker, and the frontend (built and served by nginx, which also proxies `/api`,
`/admin`, and `/static` to the backend). Migrations and `collectstatic` run automatically on
backend startup.

## Database Migrations

```bash
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py makemigrations   # after model changes
```

To load demo data (2 users, 15 events across several cities and dates, some with
registrations):

```bash
docker compose exec backend python manage.py seed_demo
```

The demo user password is `DEMO_USER_PASSWORD` (default `demo12345`); demo emails are
`alice@demo.local` and `bob@demo.local`. The command is idempotent.

## Running Tests

```bash
docker compose exec backend pytest
```

Frontend has no automated tests (see Future Improvements); its checks are type-checking and the
production build:

```bash
cd frontend
npm install
npm run type-check
npm run build
```

## API Documentation

With the stack running:

- OpenAPI schema: `http://localhost:3000/api/schema/`
- Swagger UI: `http://localhost:3000/api/docs/`
- ReDoc: `http://localhost:3000/api/redoc/`

## Authentication

Auth uses JWT access/refresh tokens stored in HttpOnly cookies, not the response body or
`localStorage`. The frontend must call `GET /api/v1/auth/csrf/` once before any unsafe request
(including login) to receive the CSRF cookie, then send its value back as `X-CSRFToken` on every
`POST`/`PATCH`/`DELETE`.

| Endpoint | Method | Notes |
|---|---|---|
| `/api/v1/auth/register/` | POST | Creates a user; no auth cookies set |
| `/api/v1/auth/token/` | POST | Logs in; sets access/refresh cookies, body returns `{"user": ...}` |
| `/api/v1/auth/token/refresh/` | POST | Rotates the refresh token (reads it from its cookie) |
| `/api/v1/auth/logout/` | POST | Blacklists the refresh token, clears cookies |
| `/api/v1/auth/me/` | GET | Current user |
| `/api/v1/auth/csrf/` | GET | Issues the CSRF cookie |

## API Endpoints

| Endpoint | Method | Auth | Notes |
|---|---|---|---|
| `/api/v1/events/` | GET | Public | List, with `search`, `location`, `date_after`, `date_before`, `organizer`, `registered`, `ordering`, `page`, `page_size` |
| `/api/v1/events/` | POST | Required | Creates an event; organizer is the authenticated user |
| `/api/v1/events/{id}/` | GET | Public | Retrieve |
| `/api/v1/events/{id}/` | PATCH | Organizer only | Partial update |
| `/api/v1/events/{id}/` | DELETE | Organizer only | Delete |
| `/api/v1/events/{id}/register/` | POST | Required | Register for the event (409 if already registered, 400 if the event is past) |
| `/api/v1/events/{id}/register/` | DELETE | Required | Cancel the registration (404 if not registered) |

`PUT` is not supported anywhere; `PATCH` covers every write case the frontend needs.

## Frontend

Vite + React + TypeScript. Server state (events, auth) is managed with TanStack Query; forms use
React Hook Form with Zod schemas. Routing is client-side (`react-router-dom`); `/events/create`,
`/events/:id/edit`, and `/my-events` require authentication.

For local development without Docker:

```bash
cd frontend
npm install
npm run dev
```

This starts Vite on `http://localhost:5173` with a dev proxy for `/api` to
`http://localhost:8000`, so cookies keep working across the two dev servers.

## Architecture Decisions

- **JWT in HttpOnly cookies, not `localStorage`.** A token in `localStorage` is readable by any
  script on the page, so one XSS bug means token theft. HttpOnly cookies aren't readable by JS at
  all; the trade-off is needing CSRF protection, which is a well-understood, solved problem.
- **Registration uniqueness enforced by a database constraint, not just serializer
  validation.** A prior `.exists()` check and a later `.create()` are two round trips; two
  concurrent requests can both pass the check before either writes. Only a `UniqueConstraint`
  is atomic under real concurrency.
- **Confirmation email scheduled in `transaction.on_commit`.** Celery can pick up the task
  before the enclosing transaction finishes. Scheduling from `on_commit` guarantees the row
  actually exists — and never fires at all if the transaction rolls back.
- **A service layer for registrations, not for event CRUD.** Registration has real business
  logic: an atomic uniqueness check, a past-event guard, and scheduling a side effect. Event
  CRUD is exactly what DRF's generic views already do; wrapping it in a service would just
  rename `serializer.save()`.
- **One origin instead of CORS.** nginx serves the frontend build and proxies `/api` to the
  backend, so the browser never makes a cross-origin request. That removes an entire class of
  CORS configuration and keeps cookies simple (no `SameSite=None` requirement).
- **No UUIDs, no soft delete.** Neither is needed: primary keys are never exposed as guessable
  enumeration risks in a way that matters here, and nothing in the brief requires recovering a
  deleted event or registration. Adding either would be complexity with no requirement behind it.

## Future Improvements

- A named list of registrants visible to the organizer of an event (currently only a count is
  exposed).
- A configurable capacity limit per event, with registration blocked once it's reached.
- Frontend automated tests (component and integration).
- CI running lint, backend tests, and the frontend build on every push.
