import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './styles/styles.css';
// eslint-disable-next-line no-unused-vars
import Logo from './Logo';
import Login from './Login';
import Cart from './Cart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

const Header = ({ user, onLogin, onLogout, darkMode, toggleDarkMode, children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const headerRef = useRef(null);
  const [currency, setCurrency] = useState('USD');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  
  // Check if we're on the homepage
  const isHomePage = location.pathname === '/';

  // Handle currency change
  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    setCurrency(newCurrency);
    // Store the selected currency in localStorage for persistence
    localStorage.setItem('selectedCurrency', newCurrency);
    // Dispatch a custom event to notify other components about the currency change
    window.dispatchEvent(new CustomEvent('currencyChange', { detail: { currency: newCurrency } }));
  };

  // Handle login button click
  const handleLoginClick = () => {
    setShowLogin(true);
  };

  // Handle account button click
  const handleAccountClick = () => {
    navigate('/account');
  };

  // Handle successful login
  const handleLogin = (userData) => {
    if (onLogin) {
      onLogin(userData);
    }
    setShowLogin(false);
  };

  // Handle logout
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  // Handle scroll events - only on homepage
  useEffect(() => {
    // Only add scroll listener on homepage
    if (isHomePage) {
      const handleScroll = () => {
        const scrollPosition = window.scrollY;
        const scrollThreshold = 80; // Slightly lower threshold for better transition
        const fixedNavbar = document.getElementById('fixed-navbar');
        const logo = document.querySelector('.logo');
        
        if (scrollPosition > scrollThreshold) {
          setIsScrolled(true);
          if (headerRef.current) {
            headerRef.current.classList.add('scrolled');
          }
          if (fixedNavbar) {
            fixedNavbar.classList.add('visible');
          }
          if (logo) {
            logo.classList.add('scrolled-logo');
          }
        } else {
          setIsScrolled(false);
          if (headerRef.current) {
            headerRef.current.classList.remove('scrolled');
          }
          if (fixedNavbar) {
            fixedNavbar.classList.remove('visible');
          }
          if (logo) {
            logo.classList.remove('scrolled-logo');
          }
        }
      };
      
      window.addEventListener('scroll', handleScroll);
      
      // Initialize based on initial scroll position
      const initialScrollPosition = window.scrollY;
      const scrollThreshold = 80;
      const fixedNavbar = document.getElementById('fixed-navbar');
      const logo = document.querySelector('.logo');
      
      if (initialScrollPosition > scrollThreshold) {
        setIsScrolled(true);
        if (headerRef.current) {
          headerRef.current.classList.add('scrolled');
        }
        if (fixedNavbar) {
          fixedNavbar.classList.add('visible');
        }
        if (logo) {
          logo.classList.add('scrolled-logo');
        }
      }
      
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isHomePage]);

  return (
    <>
      {/* Main Header - Only shown on homepage */}
      {isHomePage && (
        <header className={`header ${isScrolled ? 'scrolled' : ''}`} ref={headerRef}>
          {/* Currency Toggle */}
          <div className="currency-toggle">
            <select value={currency} onChange={handleCurrencyChange}>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="AUD">AUD (A$)</option>
            </select>
          </div>
          
          {/* Theme Toggle */}
          <div className="theme-toggle">
            <button onClick={toggleDarkMode}>
              <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
            </button>
          </div>
          
          {/* Header Controls */}
          <div className="header-controls">
            {user ? (
              <>
                <button className="account-btn" onClick={handleAccountClick}>
                  <FontAwesomeIcon icon={faUser} />
                  <span>Account</span>
                </button>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <button className="login-btn" onClick={handleLoginClick}>
                <FontAwesomeIcon icon={faUser} />
                <span>Login</span>
              </button>
            )}
            
            <Cart isFixed={false} />
          </div>
          
          {/* Search Bar */}
          <div className="header-search">
            {children}
          </div>
          
          {/* Centered Content */}
          <div className="header-content">
            {/* Logo */}
            <div className={`logo ${isScrolled ? 'scrolled-logo' : ''}`}>
              <Link to="/">
                <img className='acydgallery' src='/imgs/invertedacyd-removebg-preview.png' alt="ACYD Gallery Logo" />
              </Link>
            </div>
            
            {/* Transparent Navbar */}
            <nav className="navbar-center">
              <ul>
                <li>
                  <Link to="/category/cars">Cars</Link>
                </li>
                <li>
                  <Link to="/category/clothing">Clothing</Link>
                  <ul className="dropdown-menu">
                    <li><Link to="/category/clothing/mens">Men's Clothing</Link></li>
                    <li><Link to="/category/clothing/womens">Women's Clothing</Link></li>
                    <li><Link to="/category/clothing/accessories">Accessories</Link></li>
                    <li><Link to="/category/clothing/footwear">Footwear</Link></li>
                  </ul>
                </li>
                <li>
                  <Link to="/category/props">Props</Link>
                </li>
                <li>
                  <Link to="/about">About</Link>
                </li>
                <li>
                  <Link to="/faq">FAQ</Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
      )}

      {/* Fixed Navbar - Shown when scrolling on homepage, or always on other pages */}
      <div className={`fixed-navbar ${isHomePage ? (isScrolled ? 'visible' : '') : 'visible'}`} id="fixed-navbar">
        <div className="fixed-navbar-container">
          {/* Currency Toggle */}
          <div className="fixed-currency-container">
            <select 
              className="fixed-currency-select"
              value={currency} 
              onChange={handleCurrencyChange}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
              <option value="AUD">AUD</option>
            </select>
            
            <button 
              className="fixed-theme-toggle"
              onClick={toggleDarkMode}
            >
              <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
            </button>
          </div>
          
          {/* Centered group for logo and navigation */}
          <div className="fixed-navbar-center-group">
            <div className="fixed-navbar-logo">
              <div className="logo-gradient-background">
                <Link to="/">
                  <img src='/imgs/invertedacyd-removebg-preview.png' alt="ACYD Gallery Logo" />
                </Link>
              </div>
            </div>
            
            <div className="fixed-navbar-links">
              <ul>
                <li>
                  <Link to="/category/cars">Cars</Link>
                </li>
                <li>
                  <Link to="/category/clothing">Clothing</Link>
                  <ul className="dropdown-menu">
                    <li><Link to="/category/clothing/mens">Men's Clothing</Link></li>
                    <li><Link to="/category/clothing/womens">Women's Clothing</Link></li>
                    <li><Link to="/category/clothing/accessories">Accessories</Link></li>
                    <li><Link to="/category/clothing/footwear">Footwear</Link></li>
                  </ul>
                </li>
                <li>
                  <Link to="/category/props">Props</Link>
                </li>
                <li>
                  <Link to="/about">About</Link>
                </li>
                <li>
                  <Link to="/faq">FAQ</Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="fixed-navbar-controls">
            {user ? (
              <>
                <button 
                  className="fixed-account-btn"
                  onClick={handleAccountClick}
                >
                  <FontAwesomeIcon icon={faUser} />
                  <span>Account</span>
                </button>
                <button 
                  className="fixed-logout-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <button 
                className="fixed-login-btn"
                onClick={handleLoginClick}
              >
                <FontAwesomeIcon icon={faUser} />
                <span>Login</span>
              </button>
            )}
            
            <Cart isFixed={true} />
          </div>
        </div>
      </div>
      
      {/* Login Modal */}
      {showLogin && (
        <Login onLogin={handleLogin} onClose={() => setShowLogin(false)} />
      )}
    </>
  );
};

export default Header;