# Backend Summary - Nexa Project

## Overview
This backend is built using Express.js with ES module syntax. It provides user authentication functionality with MongoDB as the database. The backend uses JWT tokens for session management and bcrypt for password hashing.

## Project Structure
- **index.js**: Main entry point that sets up the Express server, middleware, routes, and connects to MongoDB.
- **config/db.js**: Contains the MongoDB connection logic using Mongoose.
- **config/token.js**: Utility to generate JWT tokens with a 7-day expiration.
- **models/user.model.js**: Mongoose schema and model for User data.
- **controllers/auth.controllers.js**: Contains signup, login, and logout controller functions.
- **routes/auth.router.js**: Defines authentication-related API routes.

## Detailed Components

### Server Setup (index.js)
- Loads environment variables using `dotenv`.
- Connects to MongoDB on server start.
- Uses `express.json()`, `cookie-parser`, and `cors` middleware.
- CORS configured to allow requests from `http://localhost:5173` with credentials.
- Mounts authentication routes under `/api/auth`.
- Listens on a configurable port (default 5000).

### User Model (models/user.model.js)
- Fields:
  - `name` (String, required)
  - `email` (String, required, unique)
  - `password` (String, required)
  - `assistantName` (String, optional)
  - `assistantImage` (String, optional)
  - `history` (Array of Strings)
- Includes timestamps for creation and updates.

### Authentication Controllers (controllers/auth.controllers.js)
- **signUp**:
  - Checks if email already exists.
  - Validates password length (minimum 6 characters).
  - Hashes password with bcrypt.
  - Creates new user document.
  - Generates JWT token and sets it as an HTTP-only cookie.
- **Login**:
  - Finds user by email.
  - Compares password with hashed password.
  - Generates JWT token and sets cookie.
- **logOut**:
  - Clears the authentication token cookie.

### Routes (routes/auth.router.js)
- POST `/signup` → signUp controller
- POST `/signin` → Login controller
- GET `/logout` → logOut controller

### Token Generation (config/token.js)
- Generates JWT token with user ID payload.
- Uses secret from environment variables.
- Token expires in 7 days.

## Dependencies
- express
- mongoose
- bcryptjs
- jsonwebtoken
- dotenv
- cookie-parser
- cors
- multer
- cloudinary
- nodemon (dev dependency)

## Summary
The backend provides a solid foundation for user authentication with secure password handling and JWT-based sessions. It is structured with clear separation of concerns between routing, controllers, models, and configuration. The use of environment variables and middleware ensures flexibility and security.
