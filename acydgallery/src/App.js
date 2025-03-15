import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import ProductShowcase from './components/Slideshow';
import Gallery from './components/Gallery';
import AccountPage from './components/AccountPage';
import LoginPage from './components/LoginPage';

// Import Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

// Add all icons to the library
library.add(fab, fas, far);

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if there's a saved user session
    const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
      }
    }

    // Add scroll event listener to force re-render on scroll
    const handleScroll = () => {
      // This is just to ensure React re-renders components that depend on scroll position
    };
    
    window.addEventListener('scroll', handleScroll);

    return () => {
      // Clean up
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle login
  const handleLogin = (userData) => {
    setUser(userData);
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  };

  return (
    <Router>
      <div className="App">
        <Header user={user} onLogin={handleLogin} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={
            <>
              <ProductShowcase />
              <Gallery />
            </>
          } />
          <Route path="/account" element={
            user ? <AccountPage /> : <Navigate to="/login" />
          } />
          <Route path="/login" element={
            user ? <Navigate to="/account" /> : <LoginPage onLogin={handleLogin} />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
