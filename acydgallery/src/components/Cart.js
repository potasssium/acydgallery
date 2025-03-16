import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faTimes, faTrash, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../context/CartContext';
import './styles/cart.css';

const Cart = ({ isFixed }) => {
  const { state, dispatch } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const cartRef = useRef(null);
  const navigate = useNavigate();

  // Calculate total items
  const totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
  
  // Calculate total price
  const totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Format price based on currency
  const formatPrice = (price, currency = state.currency) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    });
    return formatter.format(price);
  };

  // Handle clicking outside the cart to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target) && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close cart when scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen]);

  // Toggle cart visibility
  const toggleCart = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setIsOpen(!isOpen);
  };

  // Add item to cart
  const addItem = (item) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: item
    });
  };

  // Remove item from cart
  const removeItem = (item) => {
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: item
    });
  };

  // Delete item from cart
  const deleteItem = (item) => {
    dispatch({
      type: 'DELETE_FROM_CART',
      payload: item
    });
  };

  // Clear cart
  const clearCart = () => {
    dispatch({
      type: 'CLEAR_CART'
    });
  };

  // Update item quantity
  const updateQuantity = (id, quantity) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { id, quantity }
    });
  };

  // Handle checkout
  const handleCheckout = () => {
    navigate('/checkout');
    setIsOpen(false);
  };

  return (
    <div className="cart-container" ref={cartRef}>
      <button 
        className="cart-toggle" 
        onClick={toggleCart}
        aria-label="Shopping Cart"
      >
        <FontAwesomeIcon icon={faShoppingCart} />
        {totalItems > 0 && (
          <span className="cart-badge">{totalItems}</span>
        )}
      </button>

      <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button 
            className="close-cart" 
            onClick={toggleCart}
            aria-label="Close Cart"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="cart-items">
          {state.items.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty</p>
              <button 
                className="continue-shopping" 
                onClick={toggleCart}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {state.items.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p className="item-price">{formatPrice(item.price)}</p>
                    {item.onSale && <span className="sale-badge">SALE</span>}
                  </div>
                  <div className="item-quantity">
                    <button 
                      onClick={() => removeItem(item)}
                      aria-label="Decrease Quantity"
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      onClick={() => addItem(item)}
                      aria-label="Increase Quantity"
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  </div>
                  <button 
                    className="delete-item" 
                    onClick={() => deleteItem(item)}
                    aria-label="Remove Item"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              ))}
            </>
          )}
        </div>

        {state.items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>
            <div className="cart-actions">
              <button 
                className="clear-cart" 
                onClick={clearCart}
              >
                Clear Cart
              </button>
              <button 
                className="checkout-button" 
                onClick={handleCheckout}
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart; 