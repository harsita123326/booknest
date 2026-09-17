# API documentation

Interactive OpenAPI documentation is available at `http://localhost:4000/api/docs` while the API runs. Send `Authorization: Bearer <accessToken>` for protected routes.

| Area      | Endpoints                                                                                 |
| --------- | ----------------------------------------------------------------------------------------- |
| Auth      | `POST /auth/register`, `POST /auth/login`, `GET /auth/profile`                            |
| Catalogue | `GET /books`, `GET /books/:id`, CRUD `/books`, CRUD `/categories`                         |
| Cart      | `GET /cart`, `POST /cart/items`, `PATCH`/`DELETE /cart/items/:bookId`, `DELETE /cart`     |
| Orders    | `POST /orders`, `GET /orders`, `GET /orders/:id`                                          |
| Admin     | `GET /admin/dashboard`, `/admin/users`, `/admin/orders`, `PATCH /admin/orders/:id/status` |

`GET /books` accepts `page`, `limit`, `search`, `categoryId`, `sort` (`newest`, `price`, `rating`), and `order` (`asc`, `desc`). All mutation errors use Nest HTTP error responses with a `message` field.
