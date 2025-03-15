import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles/styles.css';
import Navbar from './Navbar';
import Logo from './Logo';
import Login from './Login';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faShoppingCart, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

const Header = ({ user, onLogin, onLogout }) => {
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const [darkMode, setDarkMode] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // Toggle dark mode
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

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

  // Handle scroll events
  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    const scrollThreshold = 100; // Threshold to show fixed navbar
    const maxScroll = 150; // Animation completes at this scroll position
    const progress = Math.min(scrollPosition / maxScroll, 1);
    
    // Set scrolled state for fixed navbar and header
    const shouldShowFixedNavbar = scrollPosition > scrollThreshold;
    setIsScrolled(shouldShowFixedNavbar);
    
    // Add or remove scrolled class to header
    if (headerRef.current) {
      if (shouldShowFixedNavbar) {
        headerRef.current.classList.add('scrolled');
      } else {
        headerRef.current.classList.remove('scrolled');
      }
    }
    
    const header = headerRef.current;
    const logo = header && header.querySelector('.logo img.acydgallery');
    const nav = header && header.querySelector('.navbar-center');

    // Animate header height (from 200px to 50px)
    if (header) {
      const initialHeaderHeight = 200;
      const finalHeaderHeight = 50;
      const newHeaderHeight =
        initialHeaderHeight - (initialHeaderHeight - finalHeaderHeight) * progress;
      header.style.height = newHeaderHeight + 'px';
    }

    // Animate navbar movement
    if (nav) {
      const initialNavTranslateY = -50;
      const finalNavTranslateY = -180;
      const navTranslateY =
        initialNavTranslateY * (1 - progress) + finalNavTranslateY * progress;

      const initialNavTranslateX = 0;
      const finalNavTranslateX = 300;
      const navTranslateX =
        initialNavTranslateX * (1 - progress) + finalNavTranslateX * progress;

      nav.style.transform = `translate(${navTranslateX}px, ${navTranslateY}px)`;
    }

    // Animate logo movement and scale
    if (logo) {
      const initialLogoTranslateX = 0;
      const finalLogoTranslateX = -400;
      const logoTranslateX =
        initialLogoTranslateX * (1 - progress) + finalLogoTranslateX * progress;

      const initialLogoTranslateY = -30;
      const finalLogoTranslateY = -40;
      const logoTranslateY =
        initialLogoTranslateY * (1 - progress) + finalLogoTranslateY * progress;

      const initialLogoScale = 1;
      const finalLogoScale = 0.55;
      const logoScale =
        initialLogoScale - (initialLogoScale - finalLogoScale) * progress;

      logo.style.transform = `translate(${logoTranslateX}px, ${logoTranslateY}px) scale(${logoScale})`;
    }
  };

  useEffect(() => {
    // Check if there's a saved currency preference
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (savedCurrency) {
      setCurrency(savedCurrency);
      // Dispatch the event to update prices on initial load
      window.dispatchEvent(new CustomEvent('currencyChange', { detail: { currency: savedCurrency } }));
    }

    // Check if there's a saved theme preference
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'true') {
      setDarkMode(true);
      document.body.classList.add('dark-mode');
    }

    // Optionally force the window to scroll to the top on refresh
    window.scrollTo(0, 0);

    // Attach the scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Call handleScroll immediately to set the initial state based on current scroll
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Save dark mode preference when it changes
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  return (
    <>
      <header className="header" ref={headerRef}>
        {/* Currency Toggle */}
        <div className="currency-toggle">
          <select value={currency} onChange={handleCurrencyChange}>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="JPY">JPY</option>
            <option value="AUD">AUD</option>
          </select>
        </div>

        {/* Theme Toggle */}
        <div className="theme-toggle">
          <button onClick={toggleTheme}>
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
          </button>
        </div>

        {/* Login/Account and Cart Buttons */}
        <div className="header-controls">
          {user ? (
            <button onClick={handleAccountClick}>
              <FontAwesomeIcon icon={faUser} /> Account
            </button>
          ) : (
            <button onClick={handleLoginClick}>
              <FontAwesomeIcon icon={faUser} /> Login
            </button>
          )}
          <button>
            <FontAwesomeIcon icon={faShoppingCart} /> Cart
          </button>
        </div>

        <Logo />
        <Navbar />
      </header>

      {/* Fixed Navbar that appears when scrolled */}
      <div className={`fixed-navbar ${isScrolled ? 'visible' : ''}`}>
        <div className="fixed-navbar-container">
          <div className="fixed-navbar-logo">
            <Link to="/">
              <img src="/imgs/WORKINGACYDLOGO.png" alt="ACYD Gallery Logo" />
            </Link>
          </div>
          <nav className="fixed-navbar-links">
            <ul>
              <li><Link to="/clothing">Clothing</Link></li>
              <li><Link to="/cars">Cars</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </nav>
          <div className="fixed-navbar-controls">
            <select value={currency} onChange={handleCurrencyChange} className="fixed-currency-select">
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
              <option value="AUD">AUD</option>
            </select>
            <button onClick={toggleTheme} className="fixed-theme-toggle">
              <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
            </button>
            <button className="fixed-cart-btn">
              <FontAwesomeIcon icon={faShoppingCart} />
            </button>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <Login onClose={() => setShowLogin(false)} onLogin={handleLogin} />
      )}
    </>
  );
};

export default Header;