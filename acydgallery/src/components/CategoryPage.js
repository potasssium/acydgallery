import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faSortAmountDown, faTimes, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import './styles/categoryPage.css';

const CategoryPage = () => {
  const { category } = useParams();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    rating: 0,
    onSale: false,
    sortBy: 'popularity'
  });
  const [expandedFilters, setExpandedFilters] = useState({
    price: true,
    rating: true,
    availability: true
  });

  // Mock product data - in a real app, you would fetch this from an API
  const mockProducts = [
    {
      id: 1,
      name: 'Premium Hoodie',
      price: 49.99,
      image: '/imgs/place1.jpg',
      category: 'clothing',
      rating: 4.5,
      onSale: false
    },
    {
      id: 2,
      name: 'Luxury Sports Car',
      price: 199.99,
      image: '/imgs/place2.jpg',
      category: 'vehicles',
      rating: 5,
      onSale: true
    },
    {
      id: 3,
      name: 'Designer Jacket',
      price: 79.99,
      image: '/imgs/place3.jpg',
      category: 'clothing',
      rating: 4,
      onSale: false
    },
    {
      id: 4,
      name: 'Urban Sneakers',
      price: 89.99,
      image: '/imgs/place1.jpg',
      category: 'clothing',
      rating: 3.5,
      onSale: true
    },
    {
      id: 5,
      name: 'Classic Muscle Car',
      price: 149.99,
      image: '/imgs/place2.jpg',
      category: 'vehicles',
      rating: 4.8,
      onSale: false
    },
    {
      id: 6,
      name: 'Tactical Vest',
      price: 59.99,
      image: '/imgs/place3.jpg',
      category: 'clothing',
      rating: 4.2,
      onSale: true
    },
    {
      id: 7,
      name: 'Digital Artwork',
      price: 29.99,
      image: '/imgs/place1.jpg',
      category: 'artwork',
      rating: 4.7,
      onSale: false
    },
    {
      id: 8,
      name: 'Sound Effects Pack',
      price: 19.99,
      image: '/imgs/place2.jpg',
      category: 'audio',
      rating: 4.3,
      onSale: true
    },
    {
      id: 9,
      name: 'Game Mod Bundle',
      price: 39.99,
      image: '/imgs/place3.jpg',
      category: 'gaming',
      rating: 4.6,
      onSale: false
    },
    {
      id: 10,
      name: 'Premium Membership',
      price: 99.99,
      image: '/imgs/place1.jpg',
      category: 'premium',
      rating: 4.9,
      onSale: true
    }
  ];

  // Fetch products based on category and filters
  useEffect(() => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      let filteredProducts = [...mockProducts];
      
      // Filter by category if specified
      if (category && category !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === category);
      }
      
      // Apply price filter
      filteredProducts = filteredProducts.filter(product => 
        product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
      );
      
      // Apply rating filter
      if (filters.rating > 0) {
        filteredProducts = filteredProducts.filter(product => product.rating >= filters.rating);
      }
      
      // Apply sale filter
      if (filters.onSale) {
        filteredProducts = filteredProducts.filter(product => product.onSale);
      }
      
      // Apply sorting
      switch (filters.sortBy) {
        case 'price-low':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filteredProducts.sort((a, b) => b.rating - a.rating);
          break;
        case 'popularity':
        default:
          // Assuming id is a proxy for popularity (newer items are more popular)
          filteredProducts.sort((a, b) => b.id - a.id);
          break;
      }
      
      setProducts(filteredProducts);
      setLoading(false);
    }, 500);
  }, [category, filters]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: value
    }));
  };

  // Toggle filter section on mobile
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Toggle individual filter sections
  const toggleFilterSection = (section) => {
    setExpandedFilters(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

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

  // Get category title
  const getCategoryTitle = () => {
    if (!category || category === 'all') return 'All Products';
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="category-page">
      <div className="category-header">
        <h1>{getCategoryTitle()}</h1>
        <div className="mobile-filter-toggle" onClick={toggleFilters}>
          <FontAwesomeIcon icon={faFilter} />
          <span>Filters</span>
        </div>
      </div>
      
      <div className="category-content">
        <aside className={`filters-sidebar ${showFilters ? 'show' : ''}`}>
          <div className="filters-header">
            <h2>Filters</h2>
            <button className="close-filters" onClick={toggleFilters}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          
          <div className="filter-section">
            <div 
              className="filter-header" 
              onClick={() => toggleFilterSection('price')}
            >
              <h3>Price Range</h3>
              <FontAwesomeIcon 
                icon={faChevronDown} 
                className={expandedFilters.price ? 'expanded' : ''}
              />
            </div>
            
            {expandedFilters.price && (
              <div className="filter-content">
                <div className="price-inputs">
                  <div className="price-input">
                    <label>Min</label>
                    <input 
                      type="number" 
                      value={filters.priceRange[0]}
                      onChange={(e) => handleFilterChange('priceRange', [
                        parseInt(e.target.value) || 0, 
                        filters.priceRange[1]
                      ])}
                      min="0"
                    />
                  </div>
                  <div className="price-input">
                    <label>Max</label>
                    <input 
                      type="number" 
                      value={filters.priceRange[1]}
                      onChange={(e) => handleFilterChange('priceRange', [
                        filters.priceRange[0], 
                        parseInt(e.target.value) || 1000
                      ])}
                      min="0"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="filter-section">
            <div 
              className="filter-header" 
              onClick={() => toggleFilterSection('rating')}
            >
              <h3>Rating</h3>
              <FontAwesomeIcon 
                icon={faChevronDown} 
                className={expandedFilters.rating ? 'expanded' : ''}
              />
            </div>
            
            {expandedFilters.rating && (
              <div className="filter-content">
                <div className="rating-options">
                  {[0, 3, 3.5, 4, 4.5].map(rating => (
                    <div 
                      key={rating} 
                      className={`rating-option ${filters.rating === rating ? 'selected' : ''}`}
                      onClick={() => handleFilterChange('rating', rating)}
                    >
                      {rating === 0 ? (
                        <span>Any Rating</span>
                      ) : (
                        <>
                          <span className="stars">{renderStars(rating)}</span>
                          <span>& Up</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="filter-section">
            <div 
              className="filter-header" 
              onClick={() => toggleFilterSection('availability')}
            >
              <h3>Availability</h3>
              <FontAwesomeIcon 
                icon={faChevronDown} 
                className={expandedFilters.availability ? 'expanded' : ''}
              />
            </div>
            
            {expandedFilters.availability && (
              <div className="filter-content">
                <div className="checkbox-option">
                  <input 
                    type="checkbox" 
                    id="onSale" 
                    checked={filters.onSale}
                    onChange={(e) => handleFilterChange('onSale', e.target.checked)}
                  />
                  <label htmlFor="onSale">On Sale</label>
                </div>
              </div>
            )}
          </div>
          
          <div className="filter-section">
            <div className="filter-header">
              <h3>Sort By</h3>
            </div>
            <div className="filter-content">
              <select 
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="sort-select"
              >
                <option value="popularity">Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>
        </aside>
        
        <div className="products-grid">
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="no-products">
              <p>No products found matching your criteria.</p>
              <button 
                onClick={() => setFilters({
                  priceRange: [0, 1000],
                  rating: 0,
                  onSale: false,
                  sortBy: 'popularity'
                })}
                className="reset-filters"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            products.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  {product.onSale && <span className="sale-badge">SALE</span>}
                </div>
                <div className="product-details">
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-rating">
                    <span className="stars">{renderStars(product.rating)}</span>
                    <span className="rating-value">({product.rating})</span>
                  </div>
                  <p className="product-price">{formatPrice(product.price)}</p>
                  <button className="add-to-cart">Add to Cart</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage; 