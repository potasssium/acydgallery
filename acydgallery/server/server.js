const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

// Import domain configuration
const domainConfig = require('./domain-config');

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

// CORS configuration based on environment
const corsOptions = isProduction 
  ? domainConfig.corsOptions 
  : {
      origin: function(origin, callback) {
        // Allow any origin during development
        callback(null, true);
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    };

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Error handling middleware for JSON parsing errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('JSON parsing error:', err);
    return res.status(400).json({ error: 'Invalid JSON in request body' });
  }
  next();
});

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'acydgallery',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    res.status(200).json({ message: 'Database connection successful!' });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Failed to connect to database' });
  }
});

// Generate JWT token
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    process.env.JWT_SECRET || 'your_jwt_secret',
    { expiresIn: '1h' }
  );
  
  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET || 'your_refresh_secret',
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
};

// Set secure cookies
const setTokenCookies = (res, accessToken, refreshToken) => {
  // Set access token as HTTP-only cookie
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 1000 // 1 hour
  });
  
  // Set refresh token as HTTP-only cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
  // Check for token in cookies first (more secure)
  const tokenFromCookie = req.cookies.accessToken;
  
  // Fallback to Authorization header for compatibility
  const authHeader = req.headers['authorization'];
  const tokenFromHeader = authHeader && authHeader.split(' ')[1];
  
  const token = tokenFromCookie || tokenFromHeader;
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    req.user = verified;
    next();
  } catch (error) {
    // If token is expired, try to refresh it
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired', tokenExpired: true });
    }
    res.status(403).json({ error: 'Invalid token' });
  }
};

// User Registration
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    const { name, email, password } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
      console.log('Missing required fields:', { name: !!name, email: !!email, password: !!password });
      return res.status(400).json({ error: 'Please provide all required fields' });
    }
    
    // Check if user already exists
    const [existingUsers] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (existingUsers.length > 0) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Insert new user
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, NOW())',
      [name, email, hashedPassword]
    );
    
    const user = {
      id: result.insertId,
      name,
      email
    };
    
    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);
    
    // Set cookies
    setTokenCookies(res, accessToken, refreshToken);
    
    // Return user data and token for client-side storage as well
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: accessToken, // For backward compatibility
      isAuthenticated: true
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }
    
    // Find user by email
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const user = users[0];
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);
    
    // Set cookies with appropriate expiration based on rememberMe
    if (rememberMe) {
      setTokenCookies(res, accessToken, refreshToken);
    } else {
      // For session-only cookies (expire when browser closes)
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
    }
    
    // Return user data and token for client-side storage as well
    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: accessToken, // For backward compatibility
      isAuthenticated: true
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Token Refresh
app.post('/api/auth/refresh', async (req, res) => {
  try {
    // Get refresh token from cookies
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token not found' });
    }
    
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'your_refresh_secret');
    
    // Get user from database
    const [users] = await pool.query(
      'SELECT id, name, email FROM users WHERE id = ?',
      [decoded.id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const user = users[0];
    
    // Generate new tokens
    const tokens = generateTokens(user);
    
    // Set new cookies
    setTokenCookies(res, tokens.accessToken, tokens.refreshToken);
    
    // Return user data and new access token
    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: tokens.accessToken,
      isAuthenticated: true
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(403).json({ error: 'Invalid refresh token' });
  }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  // Clear cookies
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

// Get User Profile
app.get('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if the requested user ID matches the authenticated user's ID
    if (req.user.id != userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Get user data
    const [users] = await pool.query(
      'SELECT id, name, email, phone, created_at FROM users WHERE id = ?',
      [userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get user address
    const [addresses] = await pool.query(
      'SELECT street, city, state, zip, country FROM addresses WHERE user_id = ?',
      [userId]
    );
    
    const user = users[0];
    const address = addresses.length > 0 ? addresses[0] : null;
    
    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      address: address || {
        street: '',
        city: '',
        state: '',
        zip: '',
        country: ''
      },
      createdAt: user.created_at
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Update User Profile
app.put('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, phone, address } = req.body;
    
    // Check if the requested user ID matches the authenticated user's ID
    if (req.user.id != userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Start a transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Update user data
      await connection.query(
        'UPDATE users SET name = ?, email = ?, phone = ?, updated_at = NOW() WHERE id = ?',
        [name, email, phone || null, userId]
      );
      
      // Update or insert address
      if (address) {
        const [existingAddresses] = await connection.query(
          'SELECT * FROM addresses WHERE user_id = ?',
          [userId]
        );
        
        if (existingAddresses.length > 0) {
          await connection.query(
            'UPDATE addresses SET street = ?, city = ?, state = ?, zip = ?, country = ? WHERE user_id = ?',
            [address.street, address.city, address.state, address.zip, address.country, userId]
          );
        } else {
          await connection.query(
            'INSERT INTO addresses (user_id, street, city, state, zip, country) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, address.street, address.city, address.state, address.zip, address.country]
          );
        }
      }
      
      await connection.commit();
      
      res.status(200).json({
        id: userId,
        name,
        email,
        phone: phone || '',
        address: address || {
          street: '',
          city: '',
          state: '',
          zip: '',
          country: ''
        },
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

// Get User Orders
app.get('/api/users/:id/orders', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if the requested user ID matches the authenticated user's ID
    if (req.user.id != userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Get orders
    const [orders] = await pool.query(
      `SELECT o.id, o.order_number, o.total, o.status, o.created_at 
       FROM orders o 
       WHERE o.user_id = ? 
       ORDER BY o.created_at DESC`,
      [userId]
    );
    
    // Get order items for each order
    const ordersWithItems = await Promise.all(orders.map(async (order) => {
      const [items] = await pool.query(
        `SELECT oi.id, oi.product_id, p.name, oi.price, oi.quantity 
         FROM order_items oi 
         JOIN products p ON oi.product_id = p.id 
         WHERE oi.order_id = ?`,
        [order.id]
      );
      
      return {
        id: order.order_number,
        date: new Date(order.created_at).toISOString().split('T')[0],
        total: parseFloat(order.total),
        status: order.status,
        items: items.map(item => ({
          id: item.product_id,
          name: item.name,
          price: parseFloat(item.price),
          quantity: item.quantity
        }))
      };
    }));
    
    res.status(200).json(ordersWithItems);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Domain status endpoint
app.get('/api/domain-status', (req, res) => {
  res.json({
    domain: process.env.DOMAIN,
    environment: process.env.NODE_ENV,
    isProduction: isProduction,
    status: 'configured but not live'
  });
});

// If in production, serve static files from the build directory
if (isProduction) {
  // Serve static files from the React app build directory
  app.use(express.static(path.join(__dirname, '../build')));

  // For any request that doesn't match an API route, send the React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server running in ${isProduction ? 'production' : 'development'} mode on port ${PORT}`);
  console.log(`Domain: ${isProduction ? process.env.DOMAIN : 'localhost'}`);
}); 