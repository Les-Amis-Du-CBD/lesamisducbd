'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Header.module.css';
import { User, ShoppingBag, Menu, X } from 'lucide-react';

export default function Header({ logoText, logoImage, menuItems }) {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Scroll lock and Viewport handling
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isMenuOpen]);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <>
            <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
                <div className={styles.container}>
                    {/* Mobile Menu Toggle */}
                    <button
                        className={styles.mobileToggle}
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    <div className={styles.logo}>
                        {logoImage ? (
                            <img src={logoImage} alt={logoText || 'Logo'} className={styles.logoImage} />
                        ) : (
                            logoText
                        )}
                    </div>

                    {/* Desktop Nav */}
                    <nav className={styles.desktopNav}>
                        <ul>
                            {menuItems && menuItems.map((item, index) => (
                                <li key={index}><a href={item.href}>{item.label}</a></li>
                            ))}
                        </ul>
                    </nav>

                    <div className={styles.actions}>
                        <button className={styles.iconBtn} aria-label="Compte"><User size={20} /></button>

                        <button className={styles.iconBtn} aria-label="Panier"><ShoppingBag size={20} /></button>
                    </div>
                </div>
            </header>

            {/* Mobile Nav Overlay (Portaled) */}
            {mounted && isMenuOpen && createPortal(
                <nav className={styles.mobileNavOverlay}>
                    <ul>
                        {menuItems && menuItems.map((item, index) => (
                            <li key={index}>
                                <a href={item.href} onClick={() => setIsMenuOpen(false)}>
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>,
                document.body
            )}
        </>
    );
}
