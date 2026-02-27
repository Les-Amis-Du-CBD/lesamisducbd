'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, Eye, EyeOff } from 'lucide-react';
import { signIn } from 'next-auth/react';

import useLockBodyScroll from '../../hooks/useLockBodyScroll';
import styles from './LoginModal.module.css';

export default function LoginModal({ isOpen, onClose }) {
    useLockBodyScroll(isOpen);
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [birthday, setBirthday] = useState('');
    const [company, setCompany] = useState('');
    const [siret, setSiret] = useState('');
    const [rgpdAccepted, setRgpdAccepted] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Reset state when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setIsLogin(true);
            setIsLoading(false);
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (isLogin) {
            const res = await signIn('credentials', {
                redirect: false,
                email,
                password
            });

            if (res?.error) {
                setError('Email ou mot de passe incorrect.');
                setIsLoading(false);
            } else {
                setIsLoading(false);
                onClose();
            }
        } else {
            if (!rgpdAccepted) {
                setError("Vous devez accepter la politique de confidentialité pour créer un compte.");
                setIsLoading(false);
                return;
            }

            try {
                const registerRes = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email,
                        password,
                        firstname,
                        lastname,
                        birthday: birthday || undefined,
                        company: company || undefined,
                        siret: siret || undefined
                    })
                });

                const data = await registerRes.json();

                if (!registerRes.ok || !data.success) {
                    setError(data.message || "Erreur lors de l'inscription.");
                    setIsLoading(false);
                    return;
                }

                // Inscription réussie, connexion automatique
                const loginRes = await signIn('credentials', {
                    redirect: false,
                    email,
                    password
                });

                if (loginRes?.error) {
                    setError("Inscription réussie, mais erreur de connexion automatique.");
                } else {
                    onClose();
                }
            } catch (err) {
                console.error("Erreur lors de l'enregistrement:", err);
                setError("Impossible de joindre le serveur d'inscription.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    const toggleMode = (e) => {
        e?.preventDefault();
        setIsLogin(!isLogin);
        setEmail('');
        setPassword('');
        setFirstname('');
        setLastname('');
        setBirthday('');
        setCompany('');
        setSiret('');
        setRgpdAccepted(false);
        setError('');
    };

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div className={styles.overlay}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose} aria-label="Fermer">
                    <X size={24} />
                </button>

                <h2 className={styles.title}>{isLogin ? 'Bon retour !' : 'Rejoignez-nous'}</h2>
                <p className={styles.subtitle}>
                    {isLogin
                        ? 'Connectez-vous pour accéder à votre espace'
                        : 'Créez votre compte pour profiter de nos offres'}
                </p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* Champs inscription uniquement */}
                    {!isLogin && (
                        <>
                            {/* Prénom + Nom */}
                            <div className={styles.inputGroup}>
                                <label className={styles.label} htmlFor="firstname">Prénom</label>
                                <input
                                    type="text"
                                    id="firstname"
                                    className={styles.input}
                                    placeholder="Jean"
                                    value={firstname}
                                    onChange={(e) => setFirstname(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label} htmlFor="lastname">Nom</label>
                                <input
                                    type="text"
                                    id="lastname"
                                    className={styles.input}
                                    placeholder="Dupont"
                                    value={lastname}
                                    onChange={(e) => setLastname(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Société + SIRET */}
                            <div className={styles.inputGroup}>
                                <label className={styles.label} htmlFor="company">
                                    Société <span style={{ color: '#999', fontWeight: 400 }}>(optionnel)</span>
                                </label>
                                <input
                                    type="text"
                                    id="company"
                                    className={styles.input}
                                    placeholder="Ma Boutique"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label} htmlFor="siret">
                                    N° fiscal <span style={{ color: '#999', fontWeight: 400 }}>(optionnel)</span>
                                </label>
                                <input
                                    type="text"
                                    id="siret"
                                    className={styles.input}
                                    placeholder="SIRET / TVA"
                                    value={siret}
                                    onChange={(e) => setSiret(e.target.value)}
                                />
                            </div>

                            {/* Date de naissance */}
                            <div className={styles.inputGroup}>
                                <label className={styles.label} htmlFor="birthday">
                                    Date de naissance <span style={{ color: '#999', fontWeight: 400 }}>(optionnel)</span>
                                </label>
                                <input
                                    type="date"
                                    id="birthday"
                                    className={styles.input}
                                    value={birthday}
                                    onChange={(e) => setBirthday(e.target.value)}
                                    max={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                        </>
                    )}

                    {/* Email */}
                    <div className={styles.inputGroup}>
                        <label className={styles.label} htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            className={styles.input}
                            placeholder="vous@exemple.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Mot de passe */}
                    <div className={styles.inputGroup}>
                        <label className={styles.label} htmlFor="password">Mot de passe</label>
                        <div className={styles.passwordWrapper}>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                className={styles.input}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className={styles.eyeButton}
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* RGPD — uniquement à l'inscription */}
                    {!isLogin && (
                        <div className={styles.checkboxGroup} style={{ marginTop: '4px' }}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={rgpdAccepted}
                                    onChange={(e) => setRgpdAccepted(e.target.checked)}
                                    className={styles.checkbox}
                                    required
                                />
                                J&apos;accepte la{' '}
                                <a href="/privacy" target="_blank" style={{ color: 'inherit', textDecoration: 'underline' }}>
                                    politique de confidentialité
                                </a>{' '}
                                et le traitement de mes données personnelles.
                            </label>
                        </div>
                    )}

                    {error && (
                        <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '-0.5rem', marginBottom: '0.5rem' }}>
                            {error}
                        </div>
                    )}

                    <button type="submit" className={styles.submitButton} disabled={isLoading}>
                        {isLoading ? (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                                {isLogin ? 'Connexion...' : 'Inscription...'}
                            </span>
                        ) : (
                            isLogin ? 'Se connecter' : "S'inscrire"
                        )}
                    </button>

                    <style jsx global>{`
                        @keyframes spin {
                            from { transform: rotate(0deg); }
                            to { transform: rotate(360deg); }
                        }
                    `}</style>
                </form>

                <div className={styles.switchText}>
                    {isLogin ? 'Pas encore de compte ?' : 'Déjà un compte ?'}
                    <button className={styles.switchLink} onClick={toggleMode} type="button">
                        {isLogin ? 'Créer un compte' : 'Se connecter'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
