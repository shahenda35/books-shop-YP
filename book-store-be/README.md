# Book Store Backend

Hono + PostgreSQL + Drizzle ORM API for the book store application.

## Stack
- Framework: Hono
- DB/ORM: PostgreSQL + Drizzle
- Auth: JWT (with jti), Argon2id password hashing
- Cache: Redis
- Validation: Zod
- Tests: Vitest

## Quick Start
```bash
pnpm install
pnpm run dev         # start dev server
pnpm run db:generate # generate SQL from schema
pnpm run db:migrate  # apply migrations
pnpm run db:seed     # seed sample data
```

Visit: http://localhost:3000

## Environment (.env)
# Server
PORT=3000

# Database
DATABASE_URL=postgres://user:pass@localhost:5432/bookstore

# JWT
JWT_SECRET=773026b5cce26...
JWT_EXPIRES_IN=1d            
JWT_EXPIRES_IN_SECONDS=604800
```

## Scripts
- `pnpm run dev` - start dev server (tsx watch)
- `pnpm run build` - type-check and emit JS
- `pnpm run start` - run compiled build
- `pnpm run db:generate` - generate SQL migrations
- `pnpm run db:migrate` - run migrations
- `pnpm run db:seed` - seed sample data
- `pnpm run db:reset` - reset + migrate + seed
- `pnpm run test` - run unit tests
- `pnpm run test:coverage` - coverage report
- `pnpm run format` - prettier format

## API Overview
Base URL: `http://localhost:3000/api`

- `POST /auth/register` — register
- `POST /auth/login` — login, returns JWT
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `GET  /profile` — get current profile
- `PATCH /profile` — update profile
- `PATCH /profile/password` — change password
- `GET  /books` — list (filters: search, categoryId, minPrice, maxPrice, sort)
- `GET  /books/:id` — get one
- `POST /books` — create (auth, ownership)
- `PATCH /books/:id` — update own
- `DELETE /books/:id` — delete own
- `GET  /books/me/list` — list my books
- `POST /upload/image` — upload image (auth)

## Data Model (Drizzle)
- users (id, username, email, passwordHash, fullName, phoneNumber)
- authors (id, name, bio)
- categories (id, name, description)
- books (id, title, description, price decimal, thumbnail, authorId, categoryId, userId, createdAt, updatedAt)
- tags, bookTags (many-to-many)

## Uploads
- Local storage: `public/uploads/`
- Endpoint: `POST /api/upload/image` (multipart, auth)
- Returns: `http://localhost:3000/uploads/{filename}`

## Testing
```bash
pnpm test
pnpm test:coverage
```

## Notes
- Price is decimal in DB; backend converts to string on insert/update.
- JWT uses jti; Redis available for session/blacklist if extended.
- Validation via Zod per module (auth, profile, books).
