import React, { useState, useEffect } from 'react';
import './styles/account.css';
import { getUserProfile, updateUserProfile, getUserOrders, logoutUser } from '../api/authAPI';

const Account = ({ onClose, user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    }
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch user data and order history from our API
    const fetchUserData = async () => {
      if (!user || !user.id) return;
      
      setLoading(true);
      try {
        // Fetch user profile data
        const profileData = await getUserProfile(user.id);
        setUserData({
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone || '',
          address: profileData.address || {
            street: '',
            city: '',
            state: '',
            zip: '',
            country: ''
          }
        });
        
        // Fetch user orders
        const ordersData = await getUserOrders(user.id);
        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setUserData({
        ...userData,
        [parent]: {
          ...userData[parent],
          [child]: value
        }
      });
    } else {
      setUserData({
        ...userData,
        [name]: value
      });
    }
  };

  const handleSaveProfile = async () => {
    if (!user || !user.id) return;
    
    setLoading(true);
    try {
      // Update user profile using our API
      const updatedProfile = await updateUserProfile(user.id, userData);
      
      // Update local storage with new user data
      const updatedUser = {
        ...user,
        name: updatedProfile.name,
        email: updatedProfile.email
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setEditMode(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      // Logout user using our API
      await logoutUser();
      
      // Call the onLogout callback to update the parent component
      if (onLogout) {
        onLogout();
      }
      
      // Close the account modal
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-overlay">
      <div className="account-container">
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="account-header">
          <h2>My Account</h2>
          <p>Welcome back, {user?.name || 'User'}</p>
        </div>
        
        <div className="account-tabs">
          <button 
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button 
            className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Order History
          </button>
          <button 
            className={`tab-button ${activeTab === 'billing' ? 'active' : ''}`}
            onClick={() => setActiveTab('billing')}
          >
            Billing Information
          </button>
        </div>
        
        <div className="account-content">
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <>
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="profile-section">
                  <div className="section-header">
                    <h3>Personal Information</h3>
                    {!editMode ? (
                      <button 
                        className="edit-button"
                        onClick={() => setEditMode(true)}
                      >
                        Edit
                      </button>
                    ) : (
                      <button 
                        className="save-button"
                        onClick={handleSaveProfile}
                      >
                        Save
                      </button>
                    )}
                  </div>
                  
                  <div className="profile-form">
                    <div className="form-group">
                      <label>Full Name</label>
                      {editMode ? (
                        <input
                          type="text"
                          name="name"
                          value={userData.name}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <p>{userData.name}</p>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label>Email</label>
                      {editMode ? (
                        <input
                          type="email"
                          name="email"
                          value={userData.email}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <p>{userData.email}</p>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label>Phone Number</label>
                      {editMode ? (
                        <input
                          type="tel"
                          name="phone"
                          value={userData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter your phone number"
                        />
                      ) : (
                        <p>{userData.phone || 'Not provided'}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="logout-section">
                    <button 
                      className="logout-button"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
              
              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="orders-section">
                  <h3>Your Orders</h3>
                  
                  {orders.length === 0 ? (
                    <p className="no-orders">You haven't placed any orders yet.</p>
                  ) : (
                    <div className="orders-list">
                      {orders.map(order => (
                        <div key={order.id} className="order-card">
                          <div className="order-header">
                            <div>
                              <h4>Order #{order.id}</h4>
                              <p className="order-date">Placed on {order.date}</p>
                            </div>
                            <div className="order-status">
                              <span className={`status-badge ${order.status.toLowerCase()}`}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                          
                          <div className="order-items">
                            {order.items.map(item => (
                              <div key={item.id} className="order-item">
                                <p className="item-name">{item.name}</p>
                                <p className="item-details">
                                  ${item.price.toFixed(2)} × {item.quantity}
                                </p>
                              </div>
                            ))}
                          </div>
                          
                          <div className="order-footer">
                            <p className="order-total">Total: ${order.total.toFixed(2)}</p>
                            <button className="view-details-button">View Details</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Billing Tab */}
              {activeTab === 'billing' && (
                <div className="billing-section">
                  <h3>Billing Information</h3>
                  
                  <div className="billing-address">
                    <h4>Shipping Address</h4>
                    
                    {editMode ? (
                      <div className="address-form">
                        <div className="form-group">
                          <label>Street Address</label>
                          <input
                            type="text"
                            name="address.street"
                            value={userData.address.street}
                            onChange={handleInputChange}
                            placeholder="Enter your street address"
                          />
                        </div>
                        
                        <div className="form-row">
                          <div className="form-group">
                            <label>City</label>
                            <input
                              type="text"
                              name="address.city"
                              value={userData.address.city}
                              onChange={handleInputChange}
                              placeholder="City"
                            />
                          </div>
                          
                          <div className="form-group">
                            <label>State/Province</label>
                            <input
                              type="text"
                              name="address.state"
                              value={userData.address.state}
                              onChange={handleInputChange}
                              placeholder="State/Province"
                            />
                          </div>
                        </div>
                        
                        <div className="form-row">
                          <div className="form-group">
                            <label>Postal Code</label>
                            <input
                              type="text"
                              name="address.zip"
                              value={userData.address.zip}
                              onChange={handleInputChange}
                              placeholder="Postal Code"
                            />
                          </div>
                          
                          <div className="form-group">
                            <label>Country</label>
                            <input
                              type="text"
                              name="address.country"
                              value={userData.address.country}
                              onChange={handleInputChange}
                              placeholder="Country"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="address-display">
                        {userData.address.street || userData.address.city || 
                         userData.address.state || userData.address.zip || 
                         userData.address.country ? (
                          <>
                            <p>{userData.address.street}</p>
                            <p>
                              {userData.address.city}{userData.address.city && userData.address.state ? ', ' : ''}
                              {userData.address.state} {userData.address.zip}
                            </p>
                            <p>{userData.address.country}</p>
                          </>
                        ) : (
                          <p className="no-address">No address information provided</p>
                        )}
                        
                        <button 
                          className="edit-button"
                          onClick={() => setEditMode(true)}
                        >
                          {userData.address.street ? 'Edit Address' : 'Add Address'}
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="payment-methods">
                    <h4>Payment Methods</h4>
                    <p className="no-payment-methods">No payment methods saved</p>
                    <button className="add-payment-button">Add Payment Method</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account; 