import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import './styles/gallery.css';

const Gallery = () => {
    const featuredItems = [
        {
            id: 1,
            image: '/imgs/place1.jpg',
            title: 'Premium Hoodie',
            category: 'clothing',
            price: '$49.99',
            description: 'High-quality digital clothing asset'
        },
        {
            id: 2,
            image: '/imgs/place2.jpg',
            title: 'Luxury Sports Car',
            category: 'vehicles',
            price: '$199.99',
            description: 'Detailed 3D vehicle model'
        },
        {
            id: 3,
            image: '/imgs/place3.jpg',
            title: 'Digital Artwork',
            category: 'artwork',
            price: '$29.99',
            description: 'Exclusive digital artwork'
        },
        {
            id: 4,
            image: '/imgs/place1.jpg',
            title: 'Sound Pack Vol.1',
            category: 'audio',
            price: '$19.99',
            description: 'Premium audio collection'
        }
    ];

    return (
        <section className="gallery-section">
            <div className="gallery-grid">
                {featuredItems.map(item => (
                    <div className="gallery-item" key={item.id}>
                        <div className="gallery-item-image">
                            <img src={item.image} alt={item.title} />
                            <div className="gallery-item-overlay">
                                <div className="gallery-item-actions">
                                    <button className="action-button view">
                                        <FontAwesomeIcon icon={faEye} />
                                    </button>
                                    <button className="action-button cart">
                                        <FontAwesomeIcon icon={faShoppingCart} />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="gallery-item-info">
                            <h3 className="gallery-item-title">{item.title}</h3>
                            <p className="gallery-item-category">{item.category}</p>
                            <p className="gallery-item-price">{item.price}</p>
                            <p className="gallery-item-description">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="gallery-view-more">
                <Link to="/category/all" className="view-more-button">View All Products</Link>
            </div>
        </section>
    );
};

export default Gallery;