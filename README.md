# E-Commerce Backend API

Welcome to the **E-Commerce Backend API**! This project is a robust backend solution for an e-commerce application, built using modern technologies such as **Node.js**, **Express**, **TypeScript**, and **Prisma** ORM. It provides comprehensive functionalities for user management, product handling, shopping cart operations, order processing, and product reviews.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Users](#users)
  - [Products](#products)
  - [Cart](#cart)
  - [Orders](#orders)
  - [Reviews](#reviews)
- [Testing](#testing)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- **User Management**: Register, login, update, and delete users with role-based access control (Admin, User, Moderator).
- **Product Management**: CRUD operations for products, including inventory management.
- **Shopping Cart**: Add, update, and remove products from the user's shopping cart.
- **Order Processing**: Create, update, and manage orders with status tracking.
- **Product Reviews**: Users can create, update, and delete reviews for products.
- **Authentication & Authorization**: Secure JWT-based authentication with role-based authorization.
- **Logging**: Comprehensive logging for monitoring and debugging.
- **TypeScript**: Strongly-typed codebase for enhanced reliability and maintainability.

## Technologies Used

- **Node.js**: JavaScript runtime environment.
- **Express**: Web framework for building APIs.
- **TypeScript**: Superset of JavaScript for static typing.
- **Prisma**: ORM for database interactions.
- **PostgreSQL**: Relational database management system.
- **JWT**: JSON Web Tokens for authentication.
- **bcryptjs**: Library for hashing passwords.
- **dotenv**: Module to load environment variables.
- **Jest & Supertest**: Testing frameworks for unit and integration tests.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: Install the latest LTS version from [nodejs.org](https://nodejs.org/).
- **npm**: Comes with Node.js. Verify installation with `npm -v`.
- **PostgreSQL**: Install PostgreSQL from [postgresql.org](https://www.postgresql.org/).
- **Git**: Version control system. Install from [git-scm.com](https://git-scm.com/).

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/ecommerce-backend.git
   cd ecommerce-backend
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

## Configuration

1. **Environment Variables**

   Create a `.env` file in the root directory and configure the following variables:

   ```env
   # Database Configuration
   DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce?schema=public"

   # JWT Configuration
   JWT_SECRET="your_jwt_secret_key"
   REFRESH_SECRET="your_refresh_token_secret_key"

   # Server Configuration
   PORT=5000
   FRONTEND_URL="http://localhost:3000"
   ```

   **Note**: Replace `username`, `password`, and other placeholders with your actual database credentials and secrets. Ensure that `.env` is added to `.gitignore` to prevent sensitive information from being exposed.

2. **Prisma Configuration**

   Prisma uses the `DATABASE_URL` from the `.env` file to connect to your database. Ensure that the URL is correctly formatted.

## Database Setup

1. **Run Prisma Migrations**

   Apply the database schema defined in `schema.prisma` to your PostgreSQL database.

   ```bash
   npx prisma migrate dev --name init
   ```

   **Explanation:**

   - `migrate dev`: Creates and applies migrations based on changes in `schema.prisma`.
   - `--name init`: Name of the migration. You can use more descriptive names for future migrations.

2. **Generate Prisma Client**

   Generate the Prisma Client to enable type-safe database queries.

   ```bash
   npx prisma generate
   ```

3. **Seed the Database (Optional)**

   Populate the database with initial data for testing.

   ```bash
   npm run seed
   ```

   **Note**: Ensure you have a seed script defined in `prisma/seed.ts`.

## Running the Application

Start the development server with hot-reloading.

```bash
npm run dev
```

**Available Scripts:**

- `npm run dev`: Runs the application in development mode using `ts-node` or `nodemon`.
- `npm run build`: Compiles TypeScript to JavaScript.
- `npm start`: Runs the compiled JavaScript using Node.js.
- `npm run seed`: Seeds the database with initial data.
- `npm test`: Runs the test suites.

## API Endpoints

### Authentication

- **Register User**

  ```
  POST /api/auth/register
  ```

  **Body:**

  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword",
    "role": "USER" // Optional, defaults to USER
  }
  ```

- **Login User**

  ```
  POST /api/auth/login
  ```

  **Body:**

  ```json
  {
    "email": "john@example.com",
    "password": "securepassword"
  }
  ```

- **Refresh Token**

  ```
  POST /api/auth/refresh
  ```

### Users

- **Get All Users** _(Admin Only)_

  ```
  GET /api/users
  ```

- **Get User by ID**

  ```
  GET /api/users/:id
  ```

- **Update User**

  ```
  PUT /api/users/:id
  ```

  **Body:**

  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "newpassword", // Optional
    "role": "ADMIN" // Optional
  }
  ```

- **Delete User** _(Admin Only)_

  ```
  DELETE /api/users/:id
  ```

### Products

_(Assuming you have product-related endpoints)_

### Cart

- **Get Cart**

  ```
  GET /api/cart
  ```

- **Add to Cart**

  ```
  POST /api/cart
  ```

  **Body:**

  ```json
  {
    "productId": 1,
    "quantity": 2
  }
  ```

- **Update Cart Item**

  ```
  PUT /api/cart/:itemId
  ```

  **Body:**

  ```json
  {
    "quantity": 3
  }
  ```

- **Remove from Cart**

  ```
  DELETE /api/cart/:itemId
  ```

### Orders

- **Get All Orders**

  ```
  GET /api/orders
  ```

- **Get Order by ID**

  ```
  GET /api/orders/:id
  ```

- **Create Order**

  ```
  POST /api/orders
  ```

  **Body:**

  ```json
  {
    "items": [
      {
        "productId": 1,
        "quantity": 2
      },
      {
        "productId": 2,
        "quantity": 1
      }
    ]
  }
  ```

- **Update Order Status**

  ```
  PUT /api/orders/:id/status
  ```

  **Body:**

  ```json
  {
    "status": "COMPLETED" // Options: PENDING, PROCESSING, COMPLETED, CANCELLED
  }
  ```

- **Delete Order**

  ```
  DELETE /api/orders/:id
  ```

### Reviews

- **Get Reviews by Product**

  ```
  GET /api/reviews/product/:productId
  ```

- **Create Review**

  ```
  POST /api/reviews
  ```

  **Body:**

  ```json
  {
    "productId": 1,
    "rating": 5,
    "comment": "Great product!"
  }
  ```

- **Update Review**

  ```
  PUT /api/reviews/:id
  ```

  **Body:**

  ```json
  {
    "rating": 4,
    "comment": "Good product."
  }
  ```

- **Delete Review**

  ```
  DELETE /api/reviews/:id
  ```

## Testing

The project uses **Jest** and **Supertest** for unit and integration testing.

1. **Run Tests**

   ```bash
   npm test
   ```

2. **Test Coverage**

   To generate a test coverage report:

   ```bash
   npm test -- --coverage
   ```

**Note**: Ensure you have defined your test scripts and test files appropriately in the `src/__tests__/` directory.

## Folder Structure

```
backend/
├── src/
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── cartController.ts
│   │   ├── orderController.ts
│   │   ├── productController.ts
│   │   ├── reviewController.ts
│   │   └── userController.ts
│   ├── middleware/
│   │   ├── authMiddleware.ts
│   │   ├── errorMiddleware.ts
│   │   └── loggerMiddleware.ts
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── cartRoutes.ts
│   │   ├── orderRoutes.ts
│   │   ├── productRoutes.ts
│   │   ├── reviewRoutes.ts
│   │   └── userRoutes.ts
│   ├── services/
│   │   └── authService.ts
│   ├── utils/
│   │   ├── logger.ts
│   │   └── prisma.ts
│   ├── types/
│   │   └── express/
│   │       └── index.d.ts
│   ├── app.ts
│   └── server.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── tests/
│   ├── authController.test.ts
│   ├── userController.test.ts
│   └── ...
├── logs/
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. **Fork the Repository**

2. **Create a Feature Branch**

   ```bash
   git checkout -b feature/YourFeature
   ```

3. **Commit Your Changes**

   ```bash
   git commit -m "Add some feature"
   ```

4. **Push to the Branch**

   ```bash
   git push origin feature/YourFeature
   ```

5. **Open a Pull Request**

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

If you have any questions or feedback, feel free to reach out:

- **Email**: your.email@example.com
- **GitHub**: [yourusername](https://github.com/yourusername)

---

**Happy Coding!** 🚀
