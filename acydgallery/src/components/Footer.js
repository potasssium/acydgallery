import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faCheckCircle, faHeadset, faShieldAlt } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  return (
    <footer className="footer">
      {/* Benefits Section */}
      <div className="footer-benefits">
        <div className="benefit-item">
          <FontAwesomeIcon icon={faTruck} className="benefit-icon" />
          <h3 className="benefit-title">Fast Delivery</h3>
          <p className="benefit-text">Instant download on all products</p>
        </div>
        
        <div className="benefit-item">
          <FontAwesomeIcon icon={faCheckCircle} className="benefit-icon" />
          <h3 className="benefit-title">Satisfaction Guaranteed</h3>
          <p className="benefit-text">100% Satisfaction</p>
        </div>
        
        <div className="benefit-item">
          <FontAwesomeIcon icon={faHeadset} className="benefit-icon" />
          <h3 className="benefit-title">Support 24/7</h3>
          <p className="benefit-text">Always available to help</p>
        </div>
        
        <div className="benefit-item">
          <FontAwesomeIcon icon={faShieldAlt} className="benefit-icon" />
          <h3 className="benefit-title">Safe Payment</h3>
          <p className="benefit-text">Safe shopping guarantee</p>
        </div>
      </div>
      
      {/* Links Section */}
      <div className="footer-links">
        <div className="footer-column">
          <h3>Products</h3>
          <ul>
            <li><a href="/tutorials">Tutorials</a></li>
            <li><a href="/digital-assets">Digital Assets</a></li>
            <li><a href="/prices">Special Offers</a></li>
            <li><a href="/new-products">New Releases</a></li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h3>Our Company</h3>
          <ul>
            <li><a href="/delivery">Delivery</a></li>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
            <li><a href="/terms">Terms and Conditions</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/partners">Our Partners</a></li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h3>Your Account</h3>
          <ul>
            <li><a href="/account">Personal Info</a></li>
            <li><a href="/orders">Orders</a></li>
            <li><a href="/addresses">Addresses</a></li>
            <li><a href="/wishlist">Wishlist</a></li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h3>Contact</h3>
          <ul>
            <li><a href="/gallery">ACYD Gallery</a></li>
            <li><a href="/mods">Custom Mods & Assets</a></li>
            <li><a href="/partner">Become a Partner</a></li>
            <li><a href="/contact">Contact Us</a></li>
            <li>
              <p>Email: <span className="email">support@acydgallery.com</span></p>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 