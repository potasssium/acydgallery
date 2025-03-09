import React from 'react';
import './styles/styles.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className='navbar-center'>
                <ul className='nav-links'>
                    <li><a href='#'>Clothing</a></li>
                    <li><a href='#'>Cars</a></li>
                    <li><a href='#'>About</a></li>
                    <li><a href='#'>FAQ</a></li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;