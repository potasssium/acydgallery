import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../context/CartContext';
import './styles/slideshow.css';

const ProductShowcase = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentCurrency, setCurrentCurrency] = useState('USD');
  const { dispatch } = useCart();
  const intervalRef = useRef(null);
  
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
      alt: 'Premium Hoodie',
      title: 'Premium Hoodie Collection',
      basePrice: 49.99,
      category: 'clothing',
      description: 'Exclusive high-quality digital clothing assets for your gaming experience'
    },
    {
      id: 2,
      image: '/imgs/place2.jpg',
      alt: 'Luxury Sports Car',
      title: 'Luxury Vehicle Models',
      basePrice: 199.99,
      category: 'vehicles',
      description: 'Meticulously crafted 3D vehicle models with stunning details'
    },
    {
      id: 3,
      image: '/imgs/place3.jpg',
      alt: 'Digital Artwork',
      title: 'Premium Digital Artwork',
      basePrice: 29.99,
      category: 'artwork',
      description: 'Unique digital art pieces created by talented artists'
    }
  ];

  // Convert price based on selected currency
  const convertPrice = (basePrice, currency) => {
    const rate = exchangeRates[currency] || 1;
    const symbol = currencySymbols[currency] || '$';
    const convertedPrice = (basePrice * rate).toFixed(2);
    return `${symbol}${convertedPrice}`;
  };

  // Listen for currency changes
  useEffect(() => {
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (savedCurrency) {
      setCurrentCurrency(savedCurrency);
    }

    const handleCurrencyChange = (event) => {
      if (event.detail && event.detail.currency) {
        setCurrentCurrency(event.detail.currency);
      }
    };

    window.addEventListener('currencyChange', handleCurrencyChange);

    return () => {
      window.removeEventListener('currencyChange', handleCurrencyChange);
    };
  }, []);

  // Auto-rotate slides
  useEffect(() => {
    const startAutoRotate = () => {
      intervalRef.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % products.length);
      }, 5000);
    };

    startAutoRotate();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [products.length]);

  // Handle manual navigation
  const goToSlide = (index) => {
    setCurrentSlide(index);
    // Reset the interval when manually changing slides
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % products.length);
      }, 5000);
    }
  };

  const goToPrevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + products.length) % products.length);
    // Reset the interval when manually changing slides
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % products.length);
      }, 5000);
    }
  };

  const goToNextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % products.length);
    // Reset the interval when manually changing slides
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % products.length);
      }, 5000);
    }
  };

  // Add to cart functionality
  const addToCart = (product) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: product.id,
        title: product.title,
        price: product.basePrice,
        image: product.image,
        quantity: 1
      }
    });
    
    // Show a notification or feedback
    alert(`${product.title} added to cart!`);
  };

  useEffect(() => {
    console.log("ProductShowcase component mounted");
    // Check if images are loading
    const testImg = new Image();
    testImg.onload = () => {
      console.log("Test image loaded successfully");
    };
    testImg.onerror = () => {
      console.error("Error loading test image");
    };
    testImg.src = '/imgs/place1.jpg';
    
    return () => {
      console.log("ProductShowcase component unmounted");
    };
  }, []);

  return (
    <div className="product-showcase">
      <div className="showcase-container">
        <div 
          className="showcase-scroll" 
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {products.map((product, index) => (
            <div className="showcase-item" key={product.id}>
              <img 
                src={product.image} 
                alt={product.alt} 
                className="showcase-image" 
                onLoad={() => console.log(`Image ${index} loaded`)}
                onError={() => console.error(`Error loading image ${index}`)}
              />
              <div className="showcase-content">
                <span className="showcase-category">{product.category}</span>
                <h2 className="showcase-title">{product.title}</h2>
                <p className="showcase-price">
                  {convertPrice(product.basePrice, currentCurrency)}
                </p>
                <button 
                  className="showcase-button"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart <FontAwesomeIcon icon={faShoppingCart} className="icon" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="showcase-controls">
          {products.map((_, index) => (
            <div 
              key={index}
              className={`showcase-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
        
        <div className="showcase-arrows">
          <div className="showcase-arrow" onClick={goToPrevSlide}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </div>
          <div className="showcase-arrow" onClick={goToNextSlide}>
            <FontAwesomeIcon icon={faChevronRight} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductShowcase; 