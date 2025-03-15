import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTshirt, faCar, faImage, faHeadphones, faGamepad, faGem } from '@fortawesome/free-solid-svg-icons';
import './styles/categoryBoxes.css';

const CategoryBoxes = () => {
  const categories = [
    {
      id: 1,
      name: 'Clothing',
      icon: faTshirt,
      description: 'Premium apparel and accessories',
      path: '/category/clothing'
    },
    {
      id: 2,
      name: 'Vehicles',
      icon: faCar,
      description: 'Custom vehicle models and mods',
      path: '/category/vehicles'
    },
    {
      id: 3,
      name: 'Artwork',
      icon: faImage,
      description: 'Digital art and posters',
      path: '/category/artwork'
    },
    {
      id: 4,
      name: 'Audio',
      icon: faHeadphones,
      description: 'Sound effects and music',
      path: '/category/audio'
    },
    {
      id: 5,
      name: 'Gaming',
      icon: faGamepad,
      description: 'Game mods and add-ons',
      path: '/category/gaming'
    },
    {
      id: 6,
      name: 'Premium',
      icon: faGem,
      description: 'Exclusive premium content',
      path: '/category/premium'
    }
  ];

  return (
    <section className="category-section">
      <div className="container">
        <h2 className="section-title">Browse Categories</h2>
        <div className="category-grid">
          {categories.map(category => (
            <Link to={category.path} key={category.id} className="category-box">
              <div className="category-icon">
                <FontAwesomeIcon icon={category.icon} />
              </div>
              <h3 className="category-name">{category.name}</h3>
              <p className="category-description">{category.description}</p>
              <div className="category-overlay">
                <span className="view-more">View Products</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryBoxes; 