import React from 'react';
import './styles/styles.css';

const Gallery = () => {
    return (
        <section id='content'>
            <div className='gallery'>
                <div className='box' id='box-1'>
                    <img src={'/imgs/place1.jpg'}></img>
                </div>
                <div className='overlay' id='over1'>
                    <div className='img-text'>meoq</div>
                </div>
                <div className='box' id='box-2'>
                    <img src={'/imgs/place2.jpg'}></img>
                </div>
                <div className='overlay' id='over2'>
                    <div className='img-text2'>meoq</div>
                </div>
                <div className='box' id='box-3'>
                    <img src={'/imgs/place3.jpg'}></img>
                </div>
                <div className='overlay' id='over3'>
                    <div className='img-text3'>meoq</div>
                </div>
            </div>
        </section>
    );
};

export default Gallery;