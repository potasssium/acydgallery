import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './styles/styles.css';
import Navbar from './Navbar';
import Logo from './Logo';
import Login from './Login';
import Cart from './Cart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSun, faMoon, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const Header = ({ user, onLogin, onLogout, darkMode, toggleDarkMode, children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const headerRef = useRef(null);
  const [currency, setCurrency] = useState('USD');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
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
    
    // Only apply animations on the home page
    if (isHomePage) {
      const header = headerRef.current;
      const logo = header && header.querySelector('.logo img.acydgallery');
      const nav = header && header.querySelector('.navbar-center');

      // Animate header height (from 280px to 50px)
      if (header) {
        const initialHeaderHeight = 280;
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

    // Optionally force the window to scroll to the top on refresh
    window.scrollTo(0, 0);

    // Attach the scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Call handleScroll immediately to set the initial state based on current scroll
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isHomePage]);

  return (
    <>
      {isHomePage ? (
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
            <button onClick={toggleDarkMode}>
              <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
            </button>
          </div>

          {/* Search Bar */}
          <div className="header-search">
            {children}
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
            <Cart />
          </div>

          <Logo />
          <Navbar />
        </header>
      ) : null}

      {/* Fixed Navbar that appears when scrolled or on non-home pages */}
      <div className={`fixed-navbar ${isScrolled || !isHomePage ? 'visible' : ''}`}>
        <div className="fixed-navbar-container">
          <div className="fixed-navbar-logo">
            <Link to="/">
              <img src="/imgs/invertedacyd-removebg-preview.png" alt="ACYD Gallery Logo" />
            </Link>
          </div>
          <nav className="fixed-navbar-links">
            <ul>
              <li><Link to="/category/clothing">Clothing</Link></li>
              <li><Link to="/category/vehicles">Vehicles</Link></li>
              <li><Link to="/category/artwork">Artwork</Link></li>
              <li><Link to="/category/audio">Audio</Link></li>
              <li><Link to="/category/gaming">Gaming</Link></li>
              <li><Link to="/category/premium">Premium</Link></li>
            </ul>
          </nav>
          <div className="fixed-navbar-controls">
            <div className="fixed-search">
              {children}
            </div>
            <select value={currency} onChange={handleCurrencyChange} className="fixed-currency-select">
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
              <option value="AUD">AUD</option>
            </select>
            <button onClick={toggleDarkMode} className="fixed-theme-toggle">
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