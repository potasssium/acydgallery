import React, { useEffect, useRef } from 'react';
import './styles/styles.css';
import Navbar from './Navbar';
import Logo from './Logo';


const Header = () => {
  const headerRef = useRef(null);

  useEffect(() => {
    // Optionally force the window to scroll to the top on refresh
    window.scrollTo(0, 0);

    const handleScroll = () => {
      const maxScroll = 200; // Animation completes at 200px scroll
      const progress = Math.min(window.scrollY / maxScroll, 1);
      const header = headerRef.current;
      const logo = header && header.querySelector('.logo img.acydgallery');
      const nav = header && header.querySelector('.navbar-center');

      // Animate header height (from 200px to 50px)
      if (header) {
        const initialHeaderHeight = 200;
        const finalHeaderHeight = 50;
        const newHeaderHeight =
          initialHeaderHeight - (initialHeaderHeight - finalHeaderHeight) * progress;
        header.style.height = newHeaderHeight + 'px';
      }

      // Animate navbar movement
      if (nav) {
        const initialNavTranslateY = -50;
        const finalNavTranslateY = -180;
        const navTranslateY =
          initialNavTranslateY * (1 - progress) + finalNavTranslateY * progress;

        const initialNavTranslateX = 0;
        const finalNavTranslateX = 300;
        const navTranslateX =
          initialNavTranslateX * (1 - progress) + finalNavTranslateX * progress;

        nav.style.transform = `translate(${navTranslateX}px, ${navTranslateY}px)`;
      }

      // Animate logo movement and scale
      if (logo) {
        const initialLogoTranslateX = 0;
        const finalLogoTranslateX = -400;
        const logoTranslateX =
          initialLogoTranslateX * (1 - progress) + finalLogoTranslateX * progress;

        const initialLogoTranslateY = -30;
        const finalLogoTranslateY = -40;
        const logoTranslateY =
          initialLogoTranslateY * (1 - progress) + finalLogoTranslateY * progress;

        const initialLogoScale = 1;
        const finalLogoScale = 0.55;
        const logoScale =
          initialLogoScale - (initialLogoScale - finalLogoScale) * progress;

        logo.style.transform = `translate(${logoTranslateX}px, ${logoTranslateY}px) scale(${logoScale})`;
      }
    };

    // Attach the scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Call handleScroll immediately to set the initial state based on current scroll
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className="header" ref={headerRef}>
      <Logo />
      <Navbar />
    </header>
  );
};

export default Header;