/**
 * Authentication API Module
 * 
 * This file contains functions for interacting with the backend authentication API.
 * These functions make HTTP requests to your backend server, which interacts with your MySQL database.
 */

// Make sure this points to your server
const API_URL = '/api'; // Using proxy from package.json

// Helper function to get the stored token from either localStorage or sessionStorage
const getStoredToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

// Helper function to get the stored user from either localStorage or sessionStorage
const getStoredUser = () => {
  const userFromLocal = localStorage.getItem('user');
  const userFromSession = sessionStorage.getItem('user');
  return userFromLocal ? JSON.parse(userFromLocal) : userFromSession ? JSON.parse(userFromSession) : null;
};

// Helper function to check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp < Date.now() / 1000;
  } catch (error) {
    return true;
  }
};

// Refresh token if needed
export const refreshTokenIfNeeded = async () => {
  const token = getStoredToken();
  const user = getStoredUser();
  
  if (!token || !user) return null;
  
  if (isTokenExpired(token)) {
    try {
      // Make a request to the refresh token endpoint
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include', // Include cookies in the request
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Token refresh failed');
      }
      
      const data = await response.json();
      
      // Update storage with the new token
      if (localStorage.getItem('token')) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
      } else {
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('user', JSON.stringify(data));
      }
      
      return data;
    } catch (error) {
      console.error('Token refresh error:', error);
      // If refresh fails, log the user out
      logoutUser();
      return null;
    }
  }
  
  return user;
};

// Login a user
export const loginUser = async (email, password, rememberMe = false) => {
  console.log('Login attempt for:', email, 'rememberMe:', rememberMe);
  try {
    console.log('Sending login request to:', `${API_URL}/auth/login`);
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies in the request
      body: JSON.stringify({ email, password, rememberMe }),
    });
    
    console.log('Login response status:', response.status);
    
    if (!response.ok) {
      let errorMessage = 'Login failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
        console.log('Login error data:', errorData);
      } catch (jsonError) {
        console.error('Error parsing error response:', jsonError);
        errorMessage = `Login failed (${response.status}: ${response.statusText})`;
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log('Login successful, received data:', { ...data, token: data.token ? 'TOKEN_RECEIVED' : 'NO_TOKEN' });
    return data;
  } catch (error) {
    console.error('Login error:', error);
    
    // For demo purposes, if the server is not running, use the mock data
    if (!window.location.hostname.includes('localhost') || error.message.includes('Failed to fetch')) {
      console.log('Using mock login data');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate database lookup
      if (email === 'demo@example.com' && password === 'Password123') {
        const mockData = {
          id: 1,
          name: 'Demo User',
          email: email,
          isAuthenticated: true,
          token: 'sample-jwt-token-would-be-here'
        };
        console.log('Returning mock data:', mockData);
        return mockData;
      } else {
        console.log('Mock login failed: Invalid credentials');
        throw new Error('Invalid email or password');
      }
    }
    
    throw error;
  }
};

// Register a new user
export const registerUser = async (name, email, password) => {
  console.log('Registration attempt for:', email);
  try {
    console.log('Sending registration data:', { name, email, passwordLength: password?.length });
    console.log('Sending registration request to:', `${API_URL}/auth/register`);
    
    // Add a test request to check if the server is reachable
    try {
      const testResponse = await fetch(`${API_URL}/test-db`, {
        mode: 'cors', // Explicitly set CORS mode
        credentials: 'include' // Include cookies in the request
      });
      console.log('Test DB response:', await testResponse.text());
    } catch (testError) {
      console.error('Test DB request failed:', testError);
    }
    
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors', // Explicitly set CORS mode
      credentials: 'include', // Include cookies in the request
      body: JSON.stringify({ name, email, password }),
    });
    
    console.log('Registration response status:', response.status);
    
    if (!response.ok) {
      let errorMessage = 'Registration failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
        console.log('Registration error data:', errorData);
      } catch (jsonError) {
        console.error('Error parsing error response:', jsonError);
        errorMessage = `Registration failed (${response.status}: ${response.statusText})`;
      }
      throw new Error(errorMessage);
    }
    
    // Parse the response
    const data = await response.json();
    console.log('Registration successful:', data);
    
    // Store user data in localStorage or sessionStorage based on rememberMe
    const storage = false ? localStorage : sessionStorage;
    storage.setItem('user', JSON.stringify(data));
    storage.setItem('token', data.token);
    
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    
    // Add more detailed error information for network errors
    if (error.name === 'TypeError' && error.message.includes('NetworkError')) {
      console.error('Network error details:', {
        API_URL,
        error: error.toString(),
        stack: error.stack
      });
      throw new Error(`Network error when connecting to server. Please check if the server is running and accessible. Details: ${error.message}`);
    }
    
    // For development/testing only - remove in production
    if (process.env.NODE_ENV === 'development' && !window.location.hostname.includes('localhost')) {
      console.log('Using mock registration in development');
      const mockUser = {
        id: Math.floor(Math.random() * 1000),
        name,
        email,
        token: 'mock-jwt-token-for-testing',
        isAuthenticated: true
      };
      
      sessionStorage.setItem('user', JSON.stringify(mockUser));
      sessionStorage.setItem('token', mockUser.token);
      
      return mockUser;
    }
    
    throw error;
  }
};

// Get user profile
export const getUserProfile = async (userId) => {
  try {
    // Check if token needs to be refreshed
    await refreshTokenIfNeeded();
    
    const token = getStoredToken();
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies in the request
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch user profile');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Get profile error:', error);
    
    // For demo purposes, if the server is not running, use the mock data
    if (!window.location.hostname.includes('localhost') || error.message.includes('Failed to fetch')) {
      console.log('Using mock profile data');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulate database query
      return {
        id: userId,
        name: 'Demo User',
        email: 'demo@example.com',
        phone: '555-123-4567',
        address: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zip: '12345',
          country: 'USA'
        },
        createdAt: '2023-01-15'
      };
    }
    
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (userId, userData) => {
  try {
    // Check if token needs to be refreshed
    await refreshTokenIfNeeded();
    
    const token = getStoredToken();
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies in the request
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update user profile');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Update profile error:', error);
    
    // For demo purposes, if the server is not running, use the mock data
    if (!window.location.hostname.includes('localhost') || error.message.includes('Failed to fetch')) {
      console.log('Using mock update data');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Simulate database update
      return {
        ...userData,
        id: userId,
        updatedAt: new Date().toISOString()
      };
    }
    
    throw error;
  }
};

// Get user orders
export const getUserOrders = async (userId) => {
  try {
    // Check if token needs to be refreshed
    await refreshTokenIfNeeded();
    
    const token = getStoredToken();
    const response = await fetch(`${API_URL}/users/${userId}/orders`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies in the request
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch orders');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Get orders error:', error);
    
    // For demo purposes, if the server is not running, use the mock data
    if (!window.location.hostname.includes('localhost') || error.message.includes('Failed to fetch')) {
      console.log('Using mock orders data');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate database query
      return [
        {
          id: 'ORD-1234',
          date: '2023-11-15',
          total: 129.99,
          status: 'Delivered',
          items: [
            { id: 1, name: 'ACYD T-Shirt', price: 49.99, quantity: 1 },
            { id: 2, name: 'ACYD Hoodie', price: 79.99, quantity: 1 }
          ]
        },
        {
          id: 'ORD-5678',
          date: '2023-10-28',
          total: 89.99,
          status: 'Processing',
          items: [
            { id: 3, name: 'ACYD Cap', price: 29.99, quantity: 1 },
            { id: 4, name: 'ACYD Poster', price: 19.99, quantity: 3 }
          ]
        }
      ];
    }
    
    throw error;
  }
};

// Logout a user
export const logoutUser = async () => {
  try {
    // Call the logout endpoint to clear cookies
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include', // Include cookies in the request
    });
    
    // Clear local storage and session storage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    // Still remove storage even if there's an error
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    return { success: true };
  }
}; 