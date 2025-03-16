import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../context/CartContext';
import './styles/slideshow.css';

const ProductShowcase = () => {
  const scrollContainerRef = useRef(null);
  const [currentCurrency, setCurrentCurrency] = useState('USD');
  const { dispatch } = useCart();
  
  // Exchange rates (approximate values - in a real app, you would fetch these from an API)
  const exchangeRates = {
    USD: 1,
    EUR: 0.85,
    GBP: 0.75,
    JPY: 110,
    AUD: 1.35
  };

  // Currency symbols
  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    AUD: 'A$'
  };
  
  // Product data with base prices in USD
  const products = [
    {
      id: 1,
      image: '/imgs/place1.jpg',
      alt: 'FiveM Clothing Item',
      title: 'Premium Hoodie',
      basePrice: 49.99,
      category: 'clothing'
    },
    {
      id: 2,
      image: '/imgs/place2.jpg',
      alt: 'FiveM Car Model',
      title: 'Luxury Sports Car',
      basePrice: 199.99,
      category: 'cars'
    },
    {
      id: 3,
      image: '/imgs/place3.jpg',
      alt: 'FiveM Featured Item',
      title: 'Designer Jacket',
      basePrice: 79.99,
      category: 'clothing'
    },
    {
      id: 4,
      image: '/imgs/place1.jpg',
      alt: 'FiveM Clothing Item',
      title: 'Urban Sneakers',
      basePrice: 89.99,
      category: 'clothing'
    },
    {
      id: 5,
      image: '/imgs/place2.jpg',
      alt: 'FiveM Car Model',
      title: 'Classic Muscle Car',
      basePrice: 149.99,
      category: 'cars'
    },
    {
      id: 6,
      image: '/imgs/place3.jpg',
      alt: 'FiveM Featured Item',
      title: 'Tactical Vest',
      basePrice: 59.99,
      category: 'clothing'
    },
    {
      id: 7,
      image: '/imgs/place1.jpg',
      alt: 'FiveM Clothing Item',
      title: 'Street Racing Car',
      basePrice: 179.99,
      category: 'cars'
    },
    {
      id: 8,
      image: '/imgs/place2.jpg',
      alt: 'FiveM Car Model',
      title: 'Premium Jeans',
      basePrice: 39.99,
      category: 'clothing'
    }
  ];

  // Convert price to the selected currency
  const convertPrice = (basePrice, currency) => {
    const convertedPrice = basePrice * exchangeRates[currency];
    
    // Format the price based on currency
    if (currency === 'JPY') {
      // JPY typically doesn't use decimal places
      return `${currencySymbols[currency]}${Math.round(convertedPrice)}`;
    } else {
      return `${currencySymbols[currency]}${convertedPrice.toFixed(2)}`;
    }
  };

  // Listen for currency change events
  useEffect(() => {
    const handleCurrencyChange = (event) => {
      setCurrentCurrency(event.detail.currency);
    };

    // Check if there's a saved currency preference
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (savedCurrency) {
      setCurrentCurrency(savedCurrency);
    }

    window.addEventListener('currencyChange', handleCurrencyChange);
    
    return () => {
      window.removeEventListener('currencyChange', handleCurrencyChange);
    };
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    let animationFrameId;
    let scrollPosition = 0;
    const scrollSpeed = 0.5; // pixels per frame - adjust for faster/slower scrolling
    
    const scroll = () => {
      if (scrollContainer) {
        // Increment scroll position
        scrollPosition += scrollSpeed;
        
        // Reset scroll position when we've scrolled the width of one product card
        // to create an infinite scrolling effect
        if (scrollPosition >= 320) { // 300px card width + 20px gap
          // Move the first product to the end
          const firstProduct = scrollContainer.firstChild;
          scrollContainer.appendChild(firstProduct);
          scrollPosition = 0;
        }
        
        // Apply the scroll position
        scrollContainer.style.transform = `translateX(-${scrollPosition}px)`;
        
        // Continue the animation
        animationFrameId = requestAnimationFrame(scroll);
      }
    };
    
    // Start the animation
    animationFrameId = requestAnimationFrame(scroll);
    
    // Pause animation when hovering
    const pauseScroll = () => {
      cancelAnimationFrame(animationFrameId);
    };
    
    const resumeScroll = () => {
      animationFrameId = requestAnimationFrame(scroll);
    };
    
    if (scrollContainer) {
      scrollContainer.addEventListener('mouseenter', pauseScroll);
      scrollContainer.addEventListener('mouseleave', resumeScroll);
    }
    
    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (scrollContainer) {
        scrollContainer.removeEventListener('mouseenter', pauseScroll);
        scrollContainer.removeEventListener('mouseleave', resumeScroll);
      }
    };
  }, []);

  // Add to cart function
  const addToCart = (product) => {
    // Create a complete product object with all required fields
    const cartProduct = {
      id: product.id,
      name: product.title,
      price: product.basePrice,
      image: product.image,
      category: product.category,
      // Add any other fields needed for the cart
      rating: 5,
      onSale: false
    };

    dispatch({
      type: 'ADD_ITEM',
      payload: cartProduct
    });
    
    // Show a brief notification
    const notification = document.createElement('div');
    notification.className = 'add-to-cart-notification';
    notification.textContent = `${product.title} added to cart!`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 2000);
    }, 10);
  };

  return (
    <div className="product-showcase">
      <h2 className="showcase-title">Featured Products</h2>
      <div className="showcase-container">
        <div className="product-scroll" ref={scrollContainerRef}>
          {products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                <img src={product.image} alt={product.alt} className="product-image" />
                <div className="product-overlay">
                  <button className="quick-view-btn">Quick View</button>
                </div>
              </div>
              <div className="product-info">
                <h3 className="product-title">{product.title}</h3>
                <p className="product-price">{convertPrice(product.basePrice, currentCurrency)}</p>
                <div className="product-actions">
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => addToCart(product)}
                  >
                    <FontAwesomeIcon icon={faShoppingCart} /> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductShowcase; 