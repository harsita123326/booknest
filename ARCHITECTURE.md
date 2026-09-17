# Architecture

The browser communicates only with the Nest REST API under `/api`. Next.js keeps UI state client-side (the JWT is retained in local storage and supplied as a Bearer token). The backend validation pipe strips unknown fields and validates all DTOs.

Nest organizes capability controllers for Auth, Books, Categories, Cart, Orders, and Admin. `JwtGuard` establishes identity; `RolesGuard` enforces `ADMIN` endpoints. Prisma is the persistence boundary. Checkout is a database transaction: it loads the user's cart, validates stock, calculates price from database values, creates order/items, decrements stock, then clears cart.

PostgreSQL owns all durable records. Prisma relations provide cascade deletion only where cart data can safely disappear; historical orders retain their referenced books/users.
