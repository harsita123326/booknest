# BookNest – Online Book Store

BookNest is a full-stack bookstore monorepo: a Next.js 15 App Router storefront backed by a NestJS REST API, PostgreSQL, and Prisma.

## Features

- Customer registration/login with JWT, secure bcrypt hashes, profile, cart, mock checkout and order history.
- Searchable and filterable book catalogue with category, price/rating/newest sorting and book pages.
- Admin-protected book/category API, inventory support, users/orders listings, order status updates and dashboard totals.
- Validated request DTOs, Swagger, CORS, server-side totals, stock validation, and transaction-based checkout.

## Prerequisites and setup

Install Node.js 20+ and PostgreSQL 15+. Create a `booknest` database, copy `.env.example` to `.env` in the repository root, and replace `YOUR_PASSWORD`. The API reads this root environment file when started from `apps/api`; alternatively place the same file at `apps/api/.env`.

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

The storefront runs at http://localhost:3000, API at http://localhost:4000/api, and Swagger at http://localhost:4000/api/docs.

Run `npm run dev:web` or `npm run dev:api` to run either app. `npm run build`, `npm run lint`, and `npm test` run from the root. The migration command will prompt for a migration name. If Prisma cannot connect, ensure PostgreSQL is running and `DATABASE_URL` contains the correct credentials.

## Default users

| Role     | Email               | Password     |
| -------- | ------------------- | ------------ |
| Admin    | admin@booknest.dev  | Password123! |
| Customer | reader@booknest.dev | Password123! |

## Layout

`apps/api` contains the Nest controllers/services, guards, Prisma schema and seed. `apps/web` contains the Next.js UI. Root npm workspaces coordinate both projects.
