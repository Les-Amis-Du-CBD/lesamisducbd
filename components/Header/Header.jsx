'use client';
import { useState, useEffect } from 'react';
import styles from './Header.module.css';
import { User, Search, ShoppingBag } from 'lucide-react';

export default function Header({ logoText, logoImage, menuItems }) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
            <div className={styles.container}>
                <div className={styles.logo}>
                    {logoImage ? (
                        <img src={logoImage} alt={logoText || 'Logo'} className={styles.logoImage} />
                    ) : (
                        logoText
                    )}
                </div>
                <nav className={styles.nav}>
                    <ul>
                        {menuItems && menuItems.map((item, index) => (
                            <li key={index}><a href={item.href}>{item.label}</a></li>
                        ))}
                    </ul>
                </nav>
                <div className={styles.actions}>
                    <button className={styles.iconBtn} aria-label="Compte"><User size={20} /></button>
                    <button className={styles.iconBtn} aria-label="Recherche"><Search size={20} /></button>
                    <button className={styles.iconBtn} aria-label="Panier"><ShoppingBag size={20} /></button>
                </div>
            </div>
        </header>
    );
}
