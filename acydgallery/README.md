# ACYD Gallery

ACYD Gallery is a modern e-commerce platform for selling clothing, accessories, and art prints.

## Project Structure

The project consists of two main parts:

1. **Frontend** - React application in the root directory
2. **Backend** - Node.js/Express server in the `server` directory

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- HeidiSQL (or any other MySQL client)

## Getting Started

### Setting up the Database

Follow the instructions in the [server README](./server/README.md) to set up the MySQL database using HeidiSQL.

### Setting up the Backend

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on the `.env.example` template and update the values.

4. Start the server:
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

### Setting up the Frontend

1. From the root directory, install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with the following content:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Features

- User authentication (login/signup)
- User profile management
- Product browsing
- Shopping cart
- Order history
- Dark mode
- Currency conversion

## Demo User

A demo user is created by default:
- Email: demo@example.com
- Password: Password123

## Tech Stack

### Frontend
- React
- CSS
- LocalStorage for client-side data persistence

### Backend
- Node.js
- Express
- MySQL (with HeidiSQL)
- JWT for authentication

## Database Schema

The database consists of the following tables:

1. **users** - Stores user information
2. **addresses** - Stores user addresses
3. **categories** - Stores product categories
4. **products** - Stores product information
5. **orders** - Stores order information
6. **order_items** - Stores items within orders

## API Endpoints

See the [server README](./server/README.md) for a complete list of API endpoints.
