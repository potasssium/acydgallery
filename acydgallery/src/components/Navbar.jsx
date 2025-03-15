import React from 'react';
import { Link } from 'react-router-dom';
import './styles/styles.css';

const Navbar = () => {
    return (
        <nav className="navbar-center">
            <ul>
                <li><Link to="/clothing">Clothing</Link></li>
                <li><Link to="/cars">Cars</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/faq">FAQ</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;