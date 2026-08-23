# Integration Test API

A small, production-style Node.js backend that follows a clear layered architecture (routes → controllers → validators → services → repositories) using Express, SQLite, Zod, and Docker‑free local development.

## Table of Contents
- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Example Usage](#example-usage)
- [Running Tests](#running-tests)
- [Linting and Formatting](#linting-and-formatting)
- [Folder Structure](#folder-structure)

## Project Overview
This backend is designed to be a starting point for integration tests and future extensions (e.g., adding Stripe payments). It uses:
- **Express** for the web framework
- **SQLite3** for the database (file-based, stored in `data/dev.db`)
- **Zod** for request validation
- **Jest** and **Supertest** for testing
- **ESLint** and **Prettier** for code quality

## Architecture
The code follows a layered architecture:
```
routes → controllers → validators → services → repositories
```
- **Routes**: Define the API endpoints and attach middleware (validators, controllers).
- **Controllers**: Handle the request and response, calling services.
- **Validators**: Validate request bodies using Zod schemas.
- **Services**: Contain business logic, coordinate between repositories, and manage transactions.
- **Repositories**: Handle direct database interactions with parameterized queries.

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm (comes with Node.js)

### Installation
1. Clone the repository (or copy the files).
2. Navigate to the project directory.
3. Install dependencies:
   ```bash
   npm install
   ```

### Environment Variables
Create a `.env` file in the root directory (based on `.env.example`):
   ```bash
   cp .env.example .env
   ```
   Adjust the values if necessary (e.g., port, database path).

### Database Setup
Run the migration script to create the database tables:
   ```bash
   npm run migrate
   ```
   This will create the `data/dev.db` SQLite file and run the migration script.

### Running the Server
For development (with auto-restart):
   ```bash
   npm run dev
   ```
   For production:
   ```bash
   npm start
   ```
   The server will run on the port specified in `.env` (default: 3000).

## API Documentation
### Base URL
`http://localhost:3000/api`

### Endpoints

#### Users
- `GET /api/users` - Retrieve all users
- `GET /api/users/:id` - Retrieve a user by ID
- `POST /api/users` - Create a new user
  - Body: `{ "name": string, "email": string }`
- `PUT /api/users/:id` - Update a user by ID
  - Body: `{ "name": string, "email": string }`
- `DELETE /api/users/:id` - Delete a user by ID

#### Products
- `GET /api/products` - Retrieve all products
- `GET /api/products/:id` - Retrieve a product by ID
- `POST /api/products` - Create a new product
  - Body: `{ "name": string, "price": number (positive) }`
- `PUT /api/products/:id` - Update a product by ID
  - Body: `{ "name": string, "price": number (positive) }`
- `DELETE /api/products/:id` - Delete a product by ID

#### Orders
- `GET /api/orders` - Retrieve all orders
- `GET /api/orders/:id` - Retrieve an order by ID (with order items)
- `POST /api/orders` - Create a new order
  - Body: `{ "userId": number, "items": [{ "productId": number, "quantity": number (positive) }] }`
- `PUT /api/orders/:id` - Update an order by ID (replace entire order)
  - Body: `{ "userId": number, "items": [{ "productId": number, "quantity": number (positive) }] }`
- `DELETE /api/orders/:id` - Delete an order by ID

## Example Usage
```bash
# Create a user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'

# Create a product
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Laptop", "price": 999.99}'

# Create an order
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "items": [{"productId": 1, "quantity": 2}]}'
```

## Running Tests
To run the test suite:
   ```bash
   npm test
   ```
   The tests use a temporary SQLite file and run against the same API endpoints.

## Linting and Formatting
- To lint the code: `npm run lint`
- To format the code: `npm run format`

## Folder Structure
```
integration-test-api/
├── src/
│   ├── config/
│   │   └── env.js
│   ├── db/
│   │   ├── database.js
│   │   ├── migrate.js
│   │   └── migrations/
│   │       └── 001_initial.sql
│   ├── middleware/
│   │   ├── error.middleware.js
│   │   └── not-found.middleware.js
│   ├── routes/
│   │   ├── user.routes.js
│   │   ├── product.routes.js
│   │   └── order.routes.js
│   ├── controllers/
│   │   ├── user.controller.js
│   │   ├── product.controller.js
│   │   └── order.controller.js
│   ├── validators/
│   │   ├── user.validator.js
│   │   ├── product.validator.js
│   │   └── order.validator.js
│   ├── services/
│   │   ├── user.service.js
│   │   ├── product.service.js
│   │   └── order.service.js
│   └── repositories/
│       ├── user.repository.js
│       ├── product.repository.js
│       └── order.repository.js
├── tests/
│   ├── health.test.js
│   ├── users.test.js
│   ├── products.test.js
│   └── orders.test.js
├── .env.example
├── .gitignore
├── eslint.config.js
├── package.json
├── prettier.config.js
└── README.md
```

## License
This project is open source and available under the MIT License.