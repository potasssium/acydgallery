import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import './styles/searchBar.css';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

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
        document.getElementById('search-input').focus();
      }, 100);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    document.getElementById('search-input').focus();
  };

  return (
    <div className={`search-container ${isExpanded ? 'expanded' : ''}`}>
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