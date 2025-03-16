import React from 'react';
import { Link } from 'react-router-dom';
import './styles/logo.css';

const Logo = () => {
    return (
        <div className='logo'>
            <Link to="/">
                <img className='acydgallery' src={'/imgs/invertedacyd-removebg-preview.png'} alt="ACYD Gallery Logo" />
            </Link>
        </div>
    );
};

export default Logo;