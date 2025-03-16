import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './styles/searchResults.css';

const SearchResults = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock product data - in a real app, you would fetch this from an API
  const mockProducts = [
    {
      id: 1,
      name: 'Premium Hoodie',
      price: 49.99,
      image: '/imgs/place1.jpg',
      category: 'clothing',
      rating: 4.5,
      description: 'High-quality premium hoodie with custom design.'
    },
    {
      id: 2,
      name: 'Luxury Sports Car',
      price: 199.99,
      image: '/imgs/place2.jpg',
      category: 'vehicles',
      rating: 5,
      description: 'Detailed luxury sports car model for your game.'
    },
    {
      id: 3,
      name: 'Designer Jacket',
      price: 79.99,
      image: '/imgs/place3.jpg',
      category: 'clothing',
      rating: 4,
      description: 'Stylish designer jacket with unique patterns.'
    },
    {
      id: 4,
      name: 'Urban Sneakers',
      price: 89.99,
      image: '/imgs/place1.jpg',
      category: 'clothing',
      rating: 3.5,
      description: 'Modern urban sneakers for your character.'
    },
    {
      id: 5,
      name: 'Classic Muscle Car',
      price: 149.99,
      image: '/imgs/place2.jpg',
      category: 'vehicles',
      rating: 4.8,
      description: 'Classic American muscle car with detailed interior.'
    },
    {
      id: 6,
      name: 'Tactical Vest',
      price: 59.99,
      image: '/imgs/place3.jpg',
      category: 'clothing',
      rating: 4.2,
      description: 'Military-style tactical vest with multiple pockets.'
    },
    {
      id: 7,
      name: 'Digital Artwork',
      price: 29.99,
      image: '/imgs/place1.jpg',
      category: 'artwork',
      rating: 4.7,
      description: 'High-resolution digital artwork for your collection.'
    },
    {
      id: 8,
      name: 'Sound Effects Pack',
      price: 19.99,
      image: '/imgs/place2.jpg',
      category: 'audio',
      rating: 4.3,
      description: 'Collection of high-quality sound effects for your projects.'
    },
    {
      id: 9,
      name: 'Game Mod Bundle',
      price: 39.99,
      image: '/imgs/place3.jpg',
      category: 'gaming',
      rating: 4.6,
      description: 'Bundle of game modifications to enhance your experience.'
    },
    {
      id: 10,
      name: 'Premium Membership',
      price: 99.99,
      image: '/imgs/place1.jpg',
      category: 'premium',
      rating: 4.9,
      description: 'Exclusive premium membership with special benefits.'
    }
  ];

  // Search for products based on query
  useEffect(() => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (!query) {
        setResults([]);
        setLoading(false);
        return;
      }
      
      const searchTerms = query.toLowerCase().split(' ');
      
      const filteredResults = mockProducts.filter(product => {
        const searchableText = `${product.name} ${product.category} ${product.description}`.toLowerCase();
        return searchTerms.some(term => searchableText.includes(term));
      });
      
      setResults(filteredResults);
      setLoading(false);
    }, 500);
  }, [query]);

  // Format price with currency symbol
  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  // Render star ratings
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<i key={i} className="fas fa-star"></i>);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<i key={i} className="fas fa-star-half-alt"></i>);
      } else {
        stars.push(<i key={i} className="far fa-star"></i>);
      }
    }
    
    return stars;
  };

  // Highlight matching text in search results
  const highlightText = (text, query) => {
    if (!query) return text;
    
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    if (searchTerms.length === 0) return text;
    
    const parts = [];
    let lastIndex = 0;
    
    // Simple highlighting for demonstration purposes
    // In a real app, you might want to use a more sophisticated approach
    const lowerText = text.toLowerCase();
    searchTerms.forEach(term => {
      let index = lowerText.indexOf(term, lastIndex);
      while (index !== -1) {
        if (index > lastIndex) {
          parts.push(text.substring(lastIndex, index));
        }
        parts.push(<span key={`${term}-${index}`} className="highlight">{text.substring(index, index + term.length)}</span>);
        lastIndex = index + term.length;
        index = lowerText.indexOf(term, lastIndex);
      }
    });
    
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    
    return parts.length > 0 ? parts : text;
  };

  return (
    <div className="search-results-page">
      <div className="search-header">
        <h1>
          <FontAwesomeIcon icon={faSearch} />
          Search Results for "{query}"
        </h1>
        <p className="results-count">
          {loading ? 'Searching...' : `${results.length} results found`}
        </p>
      </div>
      
      <div className="search-results-container">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Searching for products...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="no-results">
            <h2>No results found for "{query}"</h2>
            <p>Try different keywords or check your spelling.</p>
            <div className="search-suggestions">
              <h3>Popular searches:</h3>
              <div className="suggestion-tags">
                <a href="/search?q=clothing">clothing</a>
                <a href="/search?q=vehicles">vehicles</a>
                <a href="/search?q=premium">premium</a>
                <a href="/search?q=audio">audio</a>
              </div>
            </div>
          </div>
        ) : (
          <div className="results-grid">
            {results.map(product => (
              <div key={product.id} className="result-card">
                <div className="result-image">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="result-details">
                  <h3 className="result-name">{highlightText(product.name, query)}</h3>
                  <div className="result-category">
                    Category: <span>{highlightText(product.category, query)}</span>
                  </div>
                  <div className="result-rating">
                    <span className="stars">{renderStars(product.rating)}</span>
                    <span className="rating-value">({product.rating})</span>
                  </div>
                  <p className="result-description">{highlightText(product.description, query)}</p>
                  <div className="result-footer">
                    <p className="result-price">{formatPrice(product.price)}</p>
                    <button className="add-to-cart">Add to Cart</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults; 