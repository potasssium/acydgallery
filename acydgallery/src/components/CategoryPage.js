import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import './styles/styles.css';

const CategoryPage = () => {
  const { category, subcategory } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockProducts = generateMockProducts(category, subcategory);
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setLoading(false);
    }, 500);
  }, [category, subcategory]);

  // Generate mock products based on category
  const generateMockProducts = (category, subcategory) => {
    const mockProducts = [];
    const count = 12; // Number of mock products to generate
    
    const brands = ['ACYD', 'Velocity', 'Urban Edge', 'Retro Mods', 'Pixel Perfect'];
    const colors = ['Red', 'Blue', 'Black', 'White', 'Green', 'Yellow'];
    const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
    
    for (let i = 1; i <= count; i++) {
      const brand = brands[Math.floor(Math.random() * brands.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = sizes[Math.floor(Math.random() * sizes.length)];
      const price = Math.floor(Math.random() * 900) + 100; // Random price between 100 and 1000
      
      let name = '';
      let image = '';
      
      if (category === 'cars') {
        name = `${brand} ${['Racer', 'Cruiser', 'Drift', 'Sport', 'Classic'][Math.floor(Math.random() * 5)]} ${i}`;
        image = `/imgs/cars/car${i % 5 + 1}.jpg`;
      } else if (category === 'clothing') {
        if (subcategory === 'mens') {
          name = `${brand} Men's ${['T-Shirt', 'Hoodie', 'Jacket', 'Jeans', 'Shirt'][Math.floor(Math.random() * 5)]}`;
          image = `/imgs/clothing/mens/item${i % 5 + 1}.jpg`;
        } else if (subcategory === 'womens') {
          name = `${brand} Women's ${['Dress', 'Top', 'Jeans', 'Skirt', 'Jacket'][Math.floor(Math.random() * 5)]}`;
          image = `/imgs/clothing/womens/item${i % 5 + 1}.jpg`;
        } else if (subcategory === 'accessories') {
          name = `${brand} ${['Hat', 'Scarf', 'Gloves', 'Belt', 'Bag'][Math.floor(Math.random() * 5)]}`;
          image = `/imgs/clothing/accessories/item${i % 5 + 1}.jpg`;
        } else if (subcategory === 'footwear') {
          name = `${brand} ${['Sneakers', 'Boots', 'Sandals', 'Loafers', 'Heels'][Math.floor(Math.random() * 5)]}`;
          image = `/imgs/clothing/footwear/item${i % 5 + 1}.jpg`;
        } else {
          name = `${brand} ${['T-Shirt', 'Hoodie', 'Jacket', 'Jeans', 'Dress'][Math.floor(Math.random() * 5)]}`;
          image = `/imgs/clothing/item${i % 5 + 1}.jpg`;
        }
      } else if (category === 'props') {
        name = `${brand} ${['Furniture', 'Decoration', 'Weapon', 'Tool', 'Gadget'][Math.floor(Math.random() * 5)]} ${i}`;
        image = `/imgs/props/prop${i % 5 + 1}.jpg`;
      } else {
        name = `${brand} Item ${i}`;
        image = `/imgs/default/item${i % 5 + 1}.jpg`;
      }
      
      mockProducts.push({
        id: i,
        name,
        brand,
        color,
        size,
        price,
        image,
        description: `High-quality ${category} item from ${brand}. Perfect for your collection.`
      });
    }
    
    return mockProducts;
  };

  // Filter products based on selected filters
  const applyFilters = () => {
    let filtered = [...products];
    
    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Filter by brands
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(product => 
        selectedBrands.includes(product.brand)
      );
    }
    
    // Filter by colors
    if (selectedColors.length > 0) {
      filtered = filtered.filter(product => 
        selectedColors.includes(product.color)
      );
    }
    
    // Filter by sizes
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(product => 
        selectedSizes.includes(product.size)
      );
    }
    
    setFilteredProducts(filtered);
  };

  // Handle price range change
  const handlePriceChange = (e, index) => {
    const newRange = [...priceRange];
    newRange[index] = parseInt(e.target.value);
    setPriceRange(newRange);
  };

  // Handle brand selection
  const handleBrandChange = (e) => {
    const brand = e.target.value;
    if (e.target.checked) {
      setSelectedBrands([...selectedBrands, brand]);
    } else {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    }
  };

  // Handle color selection
  const handleColorChange = (e) => {
    const color = e.target.value;
    if (e.target.checked) {
      setSelectedColors([...selectedColors, color]);
    } else {
      setSelectedColors(selectedColors.filter(c => c !== color));
    }
  };

  // Handle size selection
  const handleSizeChange = (e) => {
    const size = e.target.value;
    if (e.target.checked) {
      setSelectedSizes([...selectedSizes, size]);
    } else {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
    }
  };

  // Get unique brands, colors, and sizes from products
  const uniqueBrands = [...new Set(products.map(product => product.brand))];
  const uniqueColors = [...new Set(products.map(product => product.color))];
  const uniqueSizes = [...new Set(products.map(product => product.size))];

  // Format category name for display
  const formatCategoryName = () => {
    if (subcategory) {
      return `${subcategory.charAt(0).toUpperCase() + subcategory.slice(1)} ${category.charAt(0).toUpperCase() + category.slice(1)}`;
    }
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="category-page">
      {/* Sidebar with filters */}
      <div className="category-sidebar">
        <h2>{formatCategoryName()}</h2>
        
        {/* Price Range Filter */}
        <div className="filter-section">
          <h3>Price Range</h3>
          <div className="price-range">
            <div className="price-inputs">
              <input 
                type="number" 
                value={priceRange[0]} 
                onChange={(e) => handlePriceChange(e, 0)} 
                min="0" 
                max={priceRange[1]}
              />
              <span>to</span>
              <input 
                type="number" 
                value={priceRange[1]} 
                onChange={(e) => handlePriceChange(e, 1)} 
                min={priceRange[0]} 
                max="10000"
              />
            </div>
            <input 
              type="range" 
              className="price-slider" 
              min="0" 
              max="1000" 
              value={priceRange[1]} 
              onChange={(e) => handlePriceChange(e, 1)}
            />
          </div>
        </div>
        
        {/* Brand Filter */}
        <div className="filter-section">
          <h3>Brands</h3>
          <div className="filter-options">
            {uniqueBrands.map(brand => (
              <div className="filter-option" key={brand}>
                <input 
                  type="checkbox" 
                  id={`brand-${brand}`} 
                  value={brand} 
                  checked={selectedBrands.includes(brand)} 
                  onChange={handleBrandChange}
                />
                <label htmlFor={`brand-${brand}`}>{brand}</label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Color Filter */}
        <div className="filter-section">
          <h3>Colors</h3>
          <div className="filter-options">
            {uniqueColors.map(color => (
              <div className="filter-option" key={color}>
                <input 
                  type="checkbox" 
                  id={`color-${color}`} 
                  value={color} 
                  checked={selectedColors.includes(color)} 
                  onChange={handleColorChange}
                />
                <label htmlFor={`color-${color}`}>{color}</label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Size Filter (only for clothing) */}
        {category === 'clothing' && (
          <div className="filter-section">
            <h3>Sizes</h3>
            <div className="filter-options">
              {uniqueSizes.map(size => (
                <div className="filter-option" key={size}>
                  <input 
                    type="checkbox" 
                    id={`size-${size}`} 
                    value={size} 
                    checked={selectedSizes.includes(size)} 
                    onChange={handleSizeChange}
                  />
                  <label htmlFor={`size-${size}`}>{size}</label>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <button className="filter-button" onClick={applyFilters}>Apply Filters</button>
      </div>
      
      {/* Main content with products */}
      <div className="category-content">
        <h2>{filteredProducts.length} Products</h2>
        
        {loading ? (
          <div className="loading">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="no-products">No products found matching your filters.</div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map(product => (
              <div className="product-card" key={product.id}>
                <img src={product.image} alt={product.name} className="product-image" />
                <div className="product-info">
                  <h3 className="product-title">{product.name}</h3>
                  <p className="product-price">${product.price}</p>
                  <p className="product-description">{product.description}</p>
                  <div className="product-actions">
                    <button className="add-to-cart">
                      <FontAwesomeIcon icon={faShoppingCart} /> Add to Cart
                    </button>
                    <button className="wishlist-button">
                      <FontAwesomeIcon icon={faHeart} />
                    </button>
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

export default CategoryPage; 