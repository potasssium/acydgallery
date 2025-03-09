import React from 'react';
import './styles/styles.css';

const Gallery = () => {
    return (
        <section id='content'>
            <div className='gallery'>
                <div className='box' id='box-1'>
                    <img src={'/imgs/place1.jpg'}></img>
                </div>
                <div className='box' id='box-2'>
                    <img src={'/imgs/place2.jpg'}></img>
                </div>
                <div className='box' id='box-3'>
                    <img src={'/imgs/place3.jpg'}></img>
                </div>
            </div>
        </section>
    );
};

export default Gallery;