import React, { useState } from 'react';
import './styles/login.css';
import { loginUser, registerUser } from '../api/authAPI';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const Login = ({ onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  const validateForm = () => {
    if (!email || !password) {
      setError('Please fill in all required fields');
      return false;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (!isLogin && !name) {
      setError('Please enter your name');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Password validation (at least 8 characters, 1 uppercase, 1 lowercase, 1 number)
    if (!isLogin) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(password)) {
        setError('Password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, and one number. Special characters are allowed.');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    // Set a timeout to reset loading state if the request takes too long
    const timeoutId = setTimeout(() => {
      setLoading(false);
      setError('Request timed out. Please try again.');
    }, 10000); // 10 seconds timeout

    try {
      let userData;
      
      if (isLogin) {
        // Login logic using our API
        userData = await loginUser(email, password, rememberMe);
      } else {
        // Signup logic using our API
        userData = await registerUser(name, email, password);
      }
      
      // Clear the timeout since the request completed
      clearTimeout(timeoutId);
      
      // Store user data in localStorage or sessionStorage based on rememberMe
      if (rememberMe) {
        localStorage.setItem('user', JSON.stringify(userData));
        if (userData.token) {
          localStorage.setItem('token', userData.token);
        }
      } else {
        sessionStorage.setItem('user', JSON.stringify(userData));
        if (userData.token) {
          sessionStorage.setItem('token', userData.token);
        }
      }
      
      // Call the onLogin callback to update the parent component
      if (onLogin) {
        onLogin(userData);
      }
      
      // Close the login modal
      if (onClose) {
        onClose();
      }
    } catch (err) {
      // Clear the timeout since the request completed (with an error)
      clearTimeout(timeoutId);
      
      console.error('Authentication error:', err);
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-container">
        <button className="close-button" onClick={onClose}>×</button>
        <div className="login-header">
          {!isLogin && (
            <button 
              className="back-button" 
              onClick={toggleForm}
              aria-label="Go back to login"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
          )}
          <h2>{isLogin ? 'Login' : 'Create Account'}</h2>
          <p>Welcome to ACYD Gallery</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            {isLogin && (
              <p className="hint-text">
                Demo credentials: demo@example.com / Password123
              </p>
            )}
          </div>
          
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
              <p className="hint-text">
                Password must be at least 8 characters with 1 uppercase letter, 1 lowercase letter, and 1 number.
              </p>
            </div>
          )}
          
          {isLogin && (
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="rememberMe">Remember me</label>
            </div>
          )}
          
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>
        
        <div className="form-footer">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              type="button" 
              className="toggle-button" 
              onClick={toggleForm}
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 