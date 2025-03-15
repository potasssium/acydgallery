import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/accountPage.css';
import { getUserProfile, updateUserProfile, getUserOrders, logoutUser } from '../api/authAPI';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faShoppingBag, faCreditCard, faSignOutAlt, faSave, faEdit } from '@fortawesome/free-solid-svg-icons';

const AccountPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
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
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    
    if (!storedUser) {
      // Redirect to login if not logged in
      navigate('/login');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      // Fetch user data and order history
      fetchUserData(parsedUser);
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    }
  }, [navigate]);

  const fetchUserData = async (user) => {
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
      
      if (localStorage.getItem('user')) {
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      setUser(updatedUser);
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
      
      // Redirect to home page
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-page">
      <div className="account-page-container">
        <div className="account-sidebar">
          <div className="user-info">
            <div className="user-avatar">
              <FontAwesomeIcon icon={faUser} size="2x" />
            </div>
            <h3>{user?.name || 'User'}</h3>
            <p>{user?.email || ''}</p>
          </div>
          
          <nav className="account-nav">
            <button 
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <FontAwesomeIcon icon={faUser} />
              <span>Profile</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <FontAwesomeIcon icon={faShoppingBag} />
              <span>Order History</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'billing' ? 'active' : ''}`}
              onClick={() => setActiveTab('billing')}
            >
              <FontAwesomeIcon icon={faCreditCard} />
              <span>Billing Information</span>
            </button>
            <button 
              className="nav-item logout"
              onClick={handleLogout}
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
              <span>Logout</span>
            </button>
          </nav>
        </div>
        
        <div className="account-content-wrapper">
          <div className="account-header">
            <h2>
              {activeTab === 'profile' && 'My Profile'}
              {activeTab === 'orders' && 'Order History'}
              {activeTab === 'billing' && 'Billing Information'}
            </h2>
            {activeTab === 'profile' && !editMode && (
              <button 
                className="edit-button"
                onClick={() => setEditMode(true)}
              >
                <FontAwesomeIcon icon={faEdit} />
                <span>Edit Profile</span>
              </button>
            )}
            {activeTab === 'profile' && editMode && (
              <button 
                className="save-button"
                onClick={handleSaveProfile}
              >
                <FontAwesomeIcon icon={faSave} />
                <span>Save Changes</span>
              </button>
            )}
          </div>
          
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading...</p>
            </div>
          ) : (
            <div className="account-content">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="profile-section">
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
                </div>
              )}
              
              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="orders-section">
                  {orders.length === 0 ? (
                    <div className="no-orders">
                      <p>You haven't placed any orders yet.</p>
                      <button onClick={() => navigate('/shop')}>Start Shopping</button>
                    </div>
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
                  <div className="billing-address">
                    <h3>Shipping Address</h3>
                    
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
                    <h3>Payment Methods</h3>
                    <p className="no-payment-methods">No payment methods saved</p>
                    <button className="add-payment-button">Add Payment Method</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountPage; 