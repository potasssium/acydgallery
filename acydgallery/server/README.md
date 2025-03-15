# ACYD Gallery Backend Server

This is the backend server for the ACYD Gallery e-commerce application. It provides API endpoints for user authentication, profile management, and order processing.

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- HeidiSQL (or any other MySQL client)

## Database Setup with HeidiSQL

1. **Install and Open HeidiSQL**:
   - Download and install HeidiSQL from [https://www.heidisql.com/download.php](https://www.heidisql.com/download.php)
   - Launch HeidiSQL

2. **Create a New Session**:
   - Click "New" in the bottom left corner
   - Enter your MySQL server details:
     - Network type: MySQL (TCP/IP)
     - Hostname / IP: localhost (or your MySQL server address)
     - User: root (or your MySQL username)
     - Password: (your MySQL password)
     - Port: 3306 (default MySQL port)
   - Click "Open"

3. **Create the Database**:
   - Right-click on the left panel and select "Create new" > "Database"
   - Enter "acydgallery" as the database name
   - Click "OK"

4. **Import the Schema**:
   - Select the "acydgallery" database in the left panel
   - Go to "File" > "Run SQL file..."
   - Navigate to the `database/schema.sql` file in this directory
   - Click "Open"
   - HeidiSQL will execute the SQL script and create all the necessary tables and sample data

5. **Verify the Setup**:
   - Expand the "acydgallery" database in the left panel
   - You should see tables like `users`, `addresses`, `products`, `orders`, etc.
   - You can browse the data by clicking on a table and then on the "Data" tab

## Environment Configuration

1. Create a `.env` file in the root directory of the project (or copy the `.env.example` file)
2. Update the following variables:
   ```
   # Server Configuration
   PORT=5000

   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password_here
   DB_NAME=acydgallery

   # JWT Secret
   JWT_SECRET=your_secret_key_here
   ```

## Installation

```bash
# Install dependencies
npm install

# Start the server
npm start

# Start the server in development mode (with auto-reload)
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user

### User Profile
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile

### Orders
- `GET /api/users/:id/orders` - Get user orders

## Demo User

A demo user is created by default:
- Email: demo@example.com
- Password: Password123

## Database Schema

The database consists of the following tables:

1. **users** - Stores user information
2. **addresses** - Stores user addresses
3. **categories** - Stores product categories
4. **products** - Stores product information
5. **orders** - Stores order information
6. **order_items** - Stores items within orders

## HeidiSQL Tips

- **Viewing Table Structure**: Right-click on a table and select "Show create table" to see the SQL that created the table
- **Editing Data**: Double-click on a cell in the "Data" tab to edit its value
- **Running Queries**: Use the "Query" tab to write and execute SQL queries
- **Exporting Data**: Right-click on a table and select "Export" to export data in various formats
- **Importing Data**: Use "File" > "Import" to import data from CSV or other formats 