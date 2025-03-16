import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import ProductShowcase from './components/Slideshow';
import Gallery from './components/Gallery';
import AccountPage from './components/AccountPage';
import LoginPage from './components/LoginPage';
import CategoryBoxes from './components/CategoryBoxes';
import CategoryPage from './components/CategoryPage';
import SearchResults from './components/SearchResults';
import SearchBar from './components/SearchBar';
import Checkout from './components/Checkout';
import { CartProvider } from './context/CartContext';

// Import Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

// Add all icons to the library
library.add(fab, fas, far);

function App() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(true); // Default to dark mode

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

    // Apply dark mode by default
    document.body.classList.add('dark-mode');

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

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.body.classList.remove('dark-mode');
    } else {
      document.body.classList.add('dark-mode');
    }
  };

  return (
    <CartProvider>
      <Router>
        <div className="App">
          <Header 
            user={user} 
            onLogin={handleLogin} 
            onLogout={handleLogout}
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
          >
            <SearchBar />
          </Header>
          <Routes>
            <Route path="/" element={
              <>
                <ProductShowcase />
                <CategoryBoxes />
                <Gallery />
              </>
            } />
            <Route path="/account" element={
              user ? <AccountPage /> : <Navigate to="/login" />
            } />
            <Route path="/login" element={
              user ? <Navigate to="/account" /> : <LoginPage onLogin={handleLogin} />
            } />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
