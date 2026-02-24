'use client';
import React, { useState } from 'react';
import styles from './ContactModal.module.css';
import { X, ChevronDown, Globe } from 'lucide-react';
import { COUNTRIES } from './countries';

import { createPortal } from 'react-dom';
import useLockBodyScroll from '@/hooks/useLockBodyScroll';

export default function ContactModal({ isOpen, onClose }) {
    useLockBodyScroll(isOpen);
    // Default to France
    const defaultCountry = COUNTRIES.find(c => c.code === 'FR') || COUNTRIES[0];

    // State for the full phone string (e.g. "+33 ")
    const [phoneValue, setPhoneValue] = useState(defaultCountry.dial + ' ');
    // Derived state for the currently detected country
    const [detectedCountry, setDetectedCountry] = useState(defaultCountry);
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'

    React.useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!isOpen || !mounted) return null;

    // Helper to find country by verifying if phone starts with dial code
    const findCountryByPhone = (phone) => {
        const cleanPhone = phone.trim();
        // Sort by dial code length desc to match specific codes first (+352 before +35)
        const sortedCountries = [...COUNTRIES].sort((a, b) => b.dial.length - a.dial.length);
        return sortedCountries.find(c => cleanPhone.startsWith(c.dial));
    };

    const handlePhoneChange = (e) => {
        const newValue = e.target.value;
        setPhoneValue(newValue);

        const country = findCountryByPhone(newValue);
        setDetectedCountry(country || null); // null means "unknown" -> show custom icon
    };

    const handleCountrySelect = (country) => {
        setDetectedCountry(country);
        // Replace current dial code or just set new one if empty
        setPhoneValue(country.dial + ' ');
        setShowCountryDropdown(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const formData = new FormData(e.target);
            const data = {
                name: formData.get('name'),
                company: formData.get('company'),
                email: formData.get('email'),
                phone: phoneValue, // use the state value
                message: formData.get('message')
            };

            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                setStatus('success');
                setTimeout(() => {
                    onClose();
                    // Optional: reset form state here if you want it fresh next time
                }, 4000);
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error("Erreur d'envoi", error);
            setStatus('error');
        }
    };

    return createPortal(
        <div className={styles.overlay}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>
                    <X size={20} />
                </button>

                <h2 className={styles.title}>Achetez moins cher et Vendez plus !</h2>

                <ul className={styles.benefitsList}>
                    <li>Entreprise française</li>
                    <li>Livraison gratuite en 24/48h</li>
                    <li>Zéro minimum de commande</li>
                    <li>Présentoirs et PLV offertes</li>
                    <li><span className={styles.link}>Satisfait ou remboursé !</span></li>
                </ul>

                {status === 'success' ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                        <h3 style={{ color: '#49B197', marginBottom: '15px' }}>Message envoyé avec succès !</h3>
                        <p style={{ color: 'white', opacity: 0.9 }}>
                            Merci pour votre message. Un conseiller Les Amis du CBD vous recontactera très prochainement.
                        </p>
                    </div>
                ) : (
                    <form className={styles.form} onClick={() => setShowCountryDropdown(false)} onSubmit={handleSubmit}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Prénom et nom *</label>
                            <input type="text" name="name" className={styles.input} required placeholder="Ex : Jean Dupont" />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Société *</label>
                            <input type="text" name="company" className={styles.input} required placeholder="Ex : Vaposhop Paris" />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Email *</label>
                            <input type="email" name="email" className={styles.input} required placeholder="Ex : contact@vaposhop.com" />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Téléphone *</label>
                            <div className={styles.phoneInputContainer} onClick={(e) => e.stopPropagation()}>
                                <div
                                    className={styles.countrySelector}
                                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                                >
                                    {detectedCountry ? (
                                        <img
                                            src={`https://flagcdn.com/w40/${detectedCountry.code.toLowerCase()}.png`}
                                            srcSet={`https://flagcdn.com/w80/${detectedCountry.code.toLowerCase()}.png 2x`}
                                            width="24"
                                            height="18"
                                            alt={detectedCountry.name}
                                            className={styles.flagImage}
                                        />
                                    ) : (
                                        <Globe size={24} color="#888" />
                                    )}
                                    <ChevronDown size={14} className={styles.chevron} />
                                </div>

                                {showCountryDropdown && (
                                    <div className={styles.countryDropdown}>
                                        {COUNTRIES.map((country) => (
                                            <div
                                                key={country.code}
                                                className={styles.countryOption}
                                                onClick={() => handleCountrySelect(country)}
                                            >
                                                <img
                                                    src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`}
                                                    srcSet={`https://flagcdn.com/w80/${country.code.toLowerCase()}.png 2x`}
                                                    width="24"
                                                    height="18"
                                                    alt={country.name}
                                                    className={styles.optionFlagImage}
                                                />
                                                <span className={styles.optionName}>{country.name}</span>
                                                <span className={styles.optionDial}>{country.dial}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <input
                                    type="tel"
                                    className={styles.phoneInput}
                                    value={phoneValue}
                                    onChange={handlePhoneChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Message</label>
                            <textarea
                                name="message"
                                className={styles.textarea}
                                placeholder="Un petit mot sur votre point de vente..."
                            ></textarea>
                        </div>

                        {status === 'error' && (
                            <p style={{ color: '#ff6b6b', textAlign: 'center', marginBottom: '15px', fontSize: '0.9rem' }}>
                                Une erreur est survenue lors de l'envoi. Veuillez réessayer.
                            </p>
                        )}

                        <button type="submit" className={styles.submitButton} disabled={status === 'loading'}>
                            {status === 'loading' ? 'Envoi en cours...' : 'Envoyer'}
                        </button>
                    </form>
                )}
            </div>
        </div>,
        document.body
    );
}
