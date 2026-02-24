'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, MapPin, Phone, Mail, Facebook, Instagram, Linkedin, Send } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer({ columnLinks, contactInfo, newsletter, copyright }) {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
    const [message, setMessage] = useState('');

    const handleNewsletterSubmit = async (e) => {
        e.preventDefault();

        if (!email) return;

        setStatus('loading');
        setMessage('');

        try {
            const response = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setMessage(data.message || 'Merci pour votre inscription !');
            } else {
                setStatus('error');
                setMessage(data.error || 'Une erreur est survenue.');
            }
        } catch (error) {
            console.error('Erreur API Newsletter', error);
            setStatus('error');
            setMessage('Erreur réseau. Veuillez réessayer.');
        }
    };

    return (
        <footer className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    {/* Column 1: Informations */}
                    <div className={styles.column}>
                        <h3 className={styles.header}>Informations</h3>
                        <div className={styles.linkList}>
                            {columnLinks.map((link, i) => (
                                <Link key={i} href={link.href} className={styles.linkItem}>
                                    <ChevronRight size={16} className={styles.iconArrow} />
                                    <span>{link.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Contactez nous */}
                    <div className={styles.column}>
                        <h3 className={styles.header}>Contactez nous</h3>
                        <div className={styles.contactList}>
                            <p className={styles.contactTitle}>{contactInfo.title}</p>
                            <div className={styles.contactItem}>
                                <MapPin size={18} className={styles.iconContact} />
                                <span>{contactInfo.address}</span>
                            </div>
                            <div className={styles.contactItem}>
                                <Phone size={18} className={styles.iconContact} />
                                <span>{contactInfo.phone}</span>
                            </div>
                            <div className={styles.contactItem}>
                                <Mail size={18} className={styles.iconContact} />
                                <span>{contactInfo.email}</span>
                            </div>
                        </div>
                    </div>

                    {/* Column 3: Suivez-nous & Newsletter */}
                    <div className={styles.column}>
                        <div className={styles.socialSection}>
                            <h3 className={styles.header}>Suivez-nous</h3>
                            <div className={styles.socialIcons}>
                                <a href="https://www.facebook.com/profile.php?id=100088639056960" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                    <Facebook size={24} strokeWidth={2.5} className={styles.socialIcon} />
                                </a>
                                <a href="https://www.instagram.com/lesamisducbd/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                    <Instagram size={24} strokeWidth={2.5} className={styles.socialIcon} />
                                </a>
                                <a href="https://www.linkedin.com/company/les-amis-du-cbd/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                                    <Linkedin size={24} strokeWidth={2.5} className={styles.socialIcon} />
                                </a>
                            </div>
                        </div>

                        <div className={styles.newsletterSection}>
                            <h3 className={styles.header}>Newsletter</h3>
                            {status === 'success' ? (
                                <div className={styles.newsletterSuccess}>
                                    <p style={{ color: '#49B197', fontWeight: '500', marginBottom: '8px' }}>{message}</p>
                                    <p className={styles.disclaimer}>Merci de votre intérêt.</p>
                                </div>
                            ) : (
                                <form className={styles.newsletterForm} onSubmit={handleNewsletterSubmit}>
                                    <div className={styles.inputWrapper}>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder={newsletter.placeholder}
                                            className={styles.input}
                                            required
                                            disabled={status === 'loading'}
                                        />
                                        <button type="submit" disabled={status === 'loading'} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                            <Send size={18} className={styles.inputIcon} style={{ opacity: status === 'loading' ? 0.5 : 1 }} />
                                        </button>
                                    </div>
                                    {status === 'error' && (
                                        <p style={{ color: '#ff6b6b', fontSize: '0.8rem', marginTop: '6px' }}>{message}</p>
                                    )}
                                    <p className={styles.disclaimer}>{newsletter.disclaimer}</p>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
