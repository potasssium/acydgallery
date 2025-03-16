import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import ProductShowcase from './components/Slideshow';
import Gallery from './components/Gallery';
import CategoryBoxes from './components/CategoryBoxes';
import SearchResults from './components/SearchResults';
import CategoryPage from './components/CategoryPage';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';
import './components/styles/pages.css';

// Import Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

// Add all icons to the library
library.add(fab, fas, far);

// Route observer component to set data-page attribute on body
function RouteObserver() {
  const location = useLocation();
  
  useEffect(() => {
    // Set data-page attribute on body based on current route
    if (location.pathname === '/') {
      document.body.setAttribute('data-page', 'home');
    } else {
      document.body.removeAttribute('data-page');
    }
  }, [location]);
  
  return null;
}

function App() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  
  // Check for saved user session on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('user');
      }
    }
    
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === 'true');
    }
  }, []);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    document.body.classList.toggle('dark-mode', newDarkMode);
  };
  
  // Handle user login
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };
  
  // Handle user logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  
  return (
    <CartProvider>
      <Router>
        <div className={`app-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
          <RouteObserver />
          <Header 
            user={user} 
            onLogin={handleLogin} 
            onLogout={handleLogout} 
            darkMode={darkMode} 
            toggleDarkMode={toggleDarkMode}
          >
            <SearchBar />
          </Header>
          
          <div className="main-content">
            <Routes>
              <Route path="/" element={
                <main>
                  <div className="hero-section">
                    <ProductShowcase />
                  </div>
                  <div className="categories-section">
                    <CategoryBoxes />
                  </div>
                  <div className="featured-section">
                    <h2 className="section-title">Featured Items</h2>
                    <Gallery />
                  </div>
                </main>
              } />
              <Route path="/account" element={
                user ? <div className="page-content account-page">
                  <h1>My Account</h1>
                  
                  <div className="account-section">
                    <h2>Account Information</h2>
                    <div className="account-info">
                      <div className="info-item">
                        <div className="info-label">Username</div>
                        <div className="info-value">{user.username || user.email}</div>
                      </div>
                      <div className="info-item">
                        <div className="info-label">Email</div>
                        <div className="info-value">{user.email}</div>
                      </div>
                      <div className="info-item">
                        <div className="info-label">Member Since</div>
                        <div className="info-value">January 2023</div>
                      </div>
                    </div>
                    <div className="account-actions">
                      <button className="account-button">Edit Profile</button>
                      <button className="account-button secondary">Change Password</button>
                    </div>
                  </div>
                  
                  <div className="account-section">
                    <h2>Order History</h2>
                    <p>You haven't placed any orders yet.</p>
                    <div className="account-actions">
                      <button className="account-button">Browse Products</button>
                    </div>
                  </div>
                  
                  <div className="account-section">
                    <h2>Saved Items</h2>
                    <p>You don't have any saved items.</p>
                    <div className="account-actions">
                      <button className="account-button">Browse Products</button>
                    </div>
                  </div>
                </div> : <Navigate to="/login" />
              } />
              <Route path="/login" element={
                user ? <Navigate to="/account" /> : <div className="page-content login-page">
                  <h1>Login Page</h1>
                  <p>Please log in to continue.</p>
                </div>
              } />
              <Route path="/product/:id" element={<div className="page-content product-page">
                <h1>Product Details</h1>
              </div>} />
              <Route path="/category/:category" element={<div className="page-content"><CategoryPage /></div>} />
              <Route path="/category/:category/:subcategory" element={<div className="page-content"><CategoryPage /></div>} />
              <Route path="/search" element={<div className="page-content"><SearchResults /></div>} />
              <Route path="/checkout" element={<div className="page-content checkout-page">
                <h1>Checkout</h1>
              </div>} />
              <Route path="/about" element={<div className="page-content about-page">
                <h1>About ACYD Gallery</h1>
                <p>Welcome to ACYD Gallery, your premier destination for digital assets and virtual merchandise.</p>
                
                <div className="about-section">
                  <div className="about-image">
                    <img src="/imgs/about-image.jpg" alt="ACYD Gallery Team" />
                  </div>
                  <div className="about-content">
                    <h2>Our Story</h2>
                    <p>Founded in 2023, ACYD Gallery was created with a vision to provide high-quality digital assets for creators, gamers, and digital enthusiasts. Our team of passionate designers and developers work tirelessly to create unique and innovative products.</p>
                    <p>We specialize in digital clothing, virtual cars, and props that can be used across various platforms and games. Our commitment to quality and attention to detail sets us apart in the digital marketplace.</p>
                    <p>At ACYD Gallery, we believe in pushing the boundaries of digital design and providing our customers with assets that enhance their virtual experiences.</p>
                  </div>
                </div>
              </div>} />
              <Route path="/faq" element={<div className="page-content faq-page">
                <h1>Frequently Asked Questions</h1>
                <p>Find answers to common questions about our products and services.</p>
                
                <div className="faq-section">
                  <div className="faq-item">
                    <div className="faq-question">How do I use the digital assets I purchase?</div>
                    <div className="faq-answer">After purchasing, you'll receive download links for your assets. These can be imported into compatible games and platforms according to the instructions provided with each product.</div>
                  </div>
                  
                  <div className="faq-item">
                    <div className="faq-question">What payment methods do you accept?</div>
                    <div className="faq-answer">We accept all major credit cards, PayPal, and various cryptocurrencies. You can select your preferred payment method during checkout.</div>
                  </div>
                  
                  <div className="faq-item">
                    <div className="faq-question">Can I request custom designs?</div>
                    <div className="faq-answer">Yes! We offer custom design services for clients with specific needs. Please contact our support team to discuss your requirements and get a quote.</div>
                  </div>
                  
                  <div className="faq-item">
                    <div className="faq-question">What is your refund policy?</div>
                    <div className="faq-answer">Due to the digital nature of our products, we generally do not offer refunds once the assets have been downloaded. However, if you encounter any issues with your purchase, please contact our support team, and we'll do our best to resolve the situation.</div>
                  </div>
                </div>
              </div>} />
            </Routes>
            
            <Footer />
          </div>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
