import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faLock, faCreditCard, faMoneyBill, faWallet } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../context/CartContext';
import './styles/checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useCart();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Calculate total items and price
  const totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.07;
  const total = subtotal + shipping + tax;

  // Format price based on currency
  const formatPrice = (price, currency = state.currency) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    });
    return formatter.format(price);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  // Handle payment method change
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'address', 'city', 'zipCode', 'country'];
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });
    
    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Credit card validation if credit card is selected
    if (paymentMethod === 'credit-card') {
      if (!formData.cardNumber) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Please enter a valid 16-digit card number';
      }
      
      if (!formData.cardName) {
        newErrors.cardName = 'Name on card is required';
      }
      
      if (!formData.expiryDate) {
        newErrors.expiryDate = 'Expiry date is required';
      } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = 'Please use MM/YY format';
      }
      
      if (!formData.cvv) {
        newErrors.cvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = 'CVV must be 3 or 4 digits';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsProcessing(true);
      
      // Simulate API call to process order
      setTimeout(() => {
        // Generate a random order ID
        const newOrderId = 'ORD-' + Math.random().toString(36).substring(2, 10).toUpperCase();
        setOrderId(newOrderId);
        setOrderComplete(true);
        setIsProcessing(false);
        
        // Clear the cart
        dispatch({ type: 'CLEAR_CART' });
        
        // In a real app, you would send the order to your backend here
        console.log('Order submitted:', {
          orderId: newOrderId,
          items: state.items,
          customer: formData,
          paymentMethod,
          total,
        });
      }, 2000);
    }
  };

  // Return to cart
  const handleBackToCart = () => {
    navigate(-1);
  };

  // Continue shopping after order completion
  const handleContinueShopping = () => {
    navigate('/');
  };

  // If cart is empty, redirect to home
  useEffect(() => {
    if (state.items.length === 0 && !orderComplete) {
      navigate('/');
    }
  }, [state.items, navigate, orderComplete]);

  return (
    <div className="checkout-page">
      {orderComplete ? (
        <div className="order-confirmation">
          <div className="order-success">
            <div className="success-icon">✓</div>
            <h2>Order Successful!</h2>
            <p>Thank you for your purchase.</p>
            <p>Your order ID is: <strong>{orderId}</strong></p>
            <p>We've sent a confirmation email to <strong>{formData.email}</strong></p>
            <button 
              className="continue-shopping-btn" 
              onClick={handleContinueShopping}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="checkout-header">
            <button 
              className="back-to-cart" 
              onClick={handleBackToCart}
            >
              <FontAwesomeIcon icon={faArrowLeft} /> Back to Cart
            </button>
            <h1>Checkout</h1>
            <div className="secure-checkout">
              <FontAwesomeIcon icon={faLock} /> Secure Checkout
            </div>
          </div>
          
          <div className="checkout-content">
            <div className="checkout-form-container">
              <form onSubmit={handleSubmit} className="checkout-form">
                <div className="form-section">
                  <h2>Shipping Information</h2>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName">First Name</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={errors.firstName ? 'error' : ''}
                      />
                      {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="lastName">Last Name</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={errors.lastName ? 'error' : ''}
                      />
                      {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={errors.address ? 'error' : ''}
                    />
                    {errors.address && <span className="error-message">{errors.address}</span>}
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="city">City</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={errors.city ? 'error' : ''}
                      />
                      {errors.city && <span className="error-message">{errors.city}</span>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="zipCode">ZIP Code</label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className={errors.zipCode ? 'error' : ''}
                      />
                      {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="country">Country</label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className={errors.country ? 'error' : ''}
                    >
                      <option value="">Select Country</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="AU">Australia</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                    </select>
                    {errors.country && <span className="error-message">{errors.country}</span>}
                  </div>
                </div>
                
                <div className="form-section">
                  <h2>Payment Method</h2>
                  
                  <div className="payment-methods">
                    <div 
                      className={`payment-method ${paymentMethod === 'credit-card' ? 'selected' : ''}`}
                      onClick={() => handlePaymentMethodChange('credit-card')}
                    >
                      <FontAwesomeIcon icon={faCreditCard} />
                      <span>Credit Card</span>
                    </div>
                    
                    <div 
                      className={`payment-method ${paymentMethod === 'paypal' ? 'selected' : ''}`}
                      onClick={() => handlePaymentMethodChange('paypal')}
                    >
                      <FontAwesomeIcon icon={faWallet} />
                      <span>PayPal</span>
                    </div>
                    
                    <div 
                      className={`payment-method ${paymentMethod === 'bank-transfer' ? 'selected' : ''}`}
                      onClick={() => handlePaymentMethodChange('bank-transfer')}
                    >
                      <FontAwesomeIcon icon={faMoneyBill} />
                      <span>Bank Transfer</span>
                    </div>
                  </div>
                  
                  {paymentMethod === 'credit-card' && (
                    <div className="credit-card-form">
                      <div className="form-group">
                        <label htmlFor="cardNumber">Card Number</label>
                        <input
                          type="text"
                          id="cardNumber"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={formData.cardNumber}
                          onChange={handleChange}
                          className={errors.cardNumber ? 'error' : ''}
                        />
                        {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="cardName">Name on Card</label>
                        <input
                          type="text"
                          id="cardName"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleChange}
                          className={errors.cardName ? 'error' : ''}
                        />
                        {errors.cardName && <span className="error-message">{errors.cardName}</span>}
                      </div>
                      
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="expiryDate">Expiry Date</label>
                          <input
                            type="text"
                            id="expiryDate"
                            name="expiryDate"
                            placeholder="MM/YY"
                            value={formData.expiryDate}
                            onChange={handleChange}
                            className={errors.expiryDate ? 'error' : ''}
                          />
                          {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor="cvv">CVV</label>
                          <input
                            type="text"
                            id="cvv"
                            name="cvv"
                            placeholder="123"
                            value={formData.cvv}
                            onChange={handleChange}
                            className={errors.cvv ? 'error' : ''}
                          />
                          {errors.cvv && <span className="error-message">{errors.cvv}</span>}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {paymentMethod === 'paypal' && (
                    <div className="payment-info">
                      <p>You will be redirected to PayPal to complete your payment after reviewing your order.</p>
                    </div>
                  )}
                  
                  {paymentMethod === 'bank-transfer' && (
                    <div className="payment-info">
                      <p>You will receive our bank details after placing your order.</p>
                    </div>
                  )}
                </div>
                
                <div className="checkout-actions">
                  <button 
                    type="submit" 
                    className="place-order-btn"
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </form>
            </div>
            
            <div className="order-summary">
              <h2>Order Summary</h2>
              
              <div className="order-items">
                {state.items.map((item) => (
                  <div className="order-item" key={item.id}>
                    <div className="item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="item-details">
                      <h3>{item.name}</h3>
                      <p>Quantity: {item.quantity}</p>
                      <p className="item-price">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="order-totals">
                <div className="total-row">
                  <span>Items ({totalItems}):</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="total-row">
                  <span>Shipping:</span>
                  <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                <div className="total-row">
                  <span>Tax:</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="total-row grand-total">
                  <span>Total:</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Checkout; 