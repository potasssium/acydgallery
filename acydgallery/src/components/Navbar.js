import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './styles/navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const navbar = document.querySelector('.navbar-container');
      if (navbar && !navbar.contains(event.target) && 
          !event.target.classList.contains('mobile-menu-toggle')) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-center">
        <ul className={`nav-links ${mobileMenuOpen ? 'show-mobile-menu' : ''}`}>
          <li>
            <Link to="/category/clothing">Clothing</Link>
          </li>
          <li>
            <Link to="/category/vehicles">Vehicles</Link>
          </li>
          <li>
            <Link to="/category/artwork">Artwork</Link>
          </li>
          <li>
            <Link to="/category/audio">Audio</Link>
          </li>
          <li>
            <Link to="/category/gaming">Gaming</Link>
          </li>
          <li>
            <Link to="/category/premium">Premium</Link>
          </li>
        </ul>
      </div>
      
      <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
        <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} />
      </button>
    </nav>
  );
};

export default Navbar; 