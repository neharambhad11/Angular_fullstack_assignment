# Full Stack Application – Coding Assignment

## 1. Project Overview

This project is a full-stack web application developed using Angular 22, Node.js, Express.js, MongoDB and Microsoft SQL Server.

The application provides user authentication, product management, order management and third-party weather API integration.

## 2. Technology Stack

### Frontend
- Angular 22
- TypeScript
- HTML5
- SCSS
- Angular Reactive Forms
- RxJS
- Angular Signals
- Angular Router
- HTTP Interceptors
- Route Guards

### Backend
- Node.js
- Express.js
- TypeScript
- JWT Authentication
- bcrypt
- REST APIs
- express-validator

### Databases
- MongoDB – Product management
- Microsoft SQL Server – User and order management
- TypeORM – SQL database operations

### Testing
- Vitest
- Angular Testing Utilities
- Supertest (backend API testing)

## 3. Features

- User registration and login
- JWT-based authentication
- Protected application routes
- Product CRUD operations
- Order CRUD operations
- MongoDB product storage
- MSSQL user and order storage
- Backend request validation
- Centralized error handling
- Weather API integration
- Responsive Angular dashboard

## 4. Project Setup

### Prerequisites

Install the following:

- Node.js compatible with Angular 22
- npm
- Angular CLI 22
- MongoDB
- Microsoft SQL Server
- Git

### Clone Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd Angular_fullstack_assignment
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file using the provided `.env.example`.

Configure:

- Server port
- MongoDB connection
- MSSQL connection
- JWT secret
- Weather API key

Start backend:

```bash
npm run dev
```

### Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
ng serve
```

Open:

http://localhost:4200

## 5. API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |

### Products

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/products | Get products |
| GET | /api/products/:id | Get product |
| POST | /api/products | Create product |
| PUT | /api/products/:id | Update product |
| DELETE | /api/products/:id | Delete product |

### Orders

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/orders | Get orders |
| GET | /api/orders/:id | Get order |
| POST | /api/orders | Create order |
| PUT | /api/orders/:id | Update order |
| DELETE | /api/orders/:id | Delete order |

### Weather

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/weather?city=Mumbai | Get weather information |

## 6. Testing

Frontend:

```bash
cd frontend
ng test --watch=false
```

Backend:

```bash
cd backend
npm test
```

## 7. Environment Configuration

Never commit actual `.env` files, passwords, JWT secrets or API keys.

Use `.env.example` to document required configuration variables.

## 8. Application URLs

Frontend: http://localhost:4200

Backend: http://localhost:5000

## 9. Author

Neha Raikwar

Full Stack Developer