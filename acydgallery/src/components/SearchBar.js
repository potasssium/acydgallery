import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import './styles/searchBar.css';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchContainerRef = useRef(null);
  const isHomePage = location.pathname === '/';
  const isFixedNavbar = !isHomePage || window.scrollY > 100;

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setIsExpanded(false);
    }
  };

  const toggleSearch = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      // Focus the input when expanded
      setTimeout(() => {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
          searchInput.focus();
        }
      }, 100);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.focus();
    }
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  // Close search when route changes
  useEffect(() => {
    setIsExpanded(false);
  }, [location]);

  return (
    <div 
      className={`search-container ${isExpanded ? 'expanded' : ''}`}
      ref={searchContainerRef}
    >
      <button 
        className="search-toggle" 
        onClick={toggleSearch}
        aria-label={isExpanded ? "Close search" : "Open search"}
      >
        <FontAwesomeIcon icon={faSearch} />
      </button>
      
      <form 
        className="search-form" 
        onSubmit={handleSearchSubmit}
      >
        <input
          id="search-input"
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        
        {searchTerm && (
          <button 
            type="button" 
            className="clear-search" 
            onClick={clearSearch}
            aria-label="Clear search"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        )}
        
        <button 
          type="submit" 
          className="submit-search"
          aria-label="Submit search"
        >
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </form>
    </div>
  );
};

export default SearchBar; 