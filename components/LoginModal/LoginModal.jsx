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
    const [name, setName] = useState('');
    const [isPro, setIsPro] = useState(false);
    const [company, setCompany] = useState('');
    const [siret, setSiret] = useState('');
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
            // Logique d'inscription
            try {
                const registerRes = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email,
                        password,
                        name,
                        role: isPro ? 'buraliste' : 'client',
                        company: isPro ? company : undefined,
                        siret: isPro ? siret : undefined
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
        setName('');
        setCompany('');
        setSiret('');
        setIsPro(false);
        setError('');
    };


    if (!mounted || !isOpen) return null;

    return createPortal(
        <div className={styles.overlay} onClick={onClose}>
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
                    {/* Name field - Only for Sign Up */}
                    {!isLogin && (
                        <>
                            <div className={styles.inputGroup} style={{ animation: 'fadeIn 0.3s ease' }}>
                                <label className={styles.label} htmlFor="name">Prénom / Nom</label>
                                <input
                                    type="text"
                                    id="name"
                                    className={styles.input}
                                    placeholder="Jean Dupont"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required={!isLogin}
                                />
                            </div>

                            <div className={styles.checkboxGroup} style={{ animation: 'fadeIn 0.4s ease' }}>
                                <label className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={isPro}
                                        onChange={(e) => setIsPro(e.target.checked)}
                                        className={styles.checkbox}
                                    />
                                    Je suis un professionnel (Buraliste / Revendeur)
                                </label>
                            </div>

                            {isPro && (
                                <div className={styles.proFieldsContainer} style={{ animation: 'fadeIn 0.3s ease' }}>
                                    <div className={styles.inputGroup} style={{ flex: 1 }}>
                                        <label className={styles.label} htmlFor="company">Société</label>
                                        <input
                                            type="text"
                                            id="company"
                                            className={styles.input}
                                            placeholder="Ma Boutique"
                                            value={company}
                                            onChange={(e) => setCompany(e.target.value)}
                                            required={isPro}
                                        />
                                    </div>
                                    <div className={styles.inputGroup} style={{ flex: 1 }}>
                                        <label className={styles.label} htmlFor="siret">N° SIRET</label>
                                        <input
                                            type="text"
                                            id="siret"
                                            className={styles.input}
                                            placeholder="123 456 789 00012"
                                            value={siret}
                                            onChange={(e) => setSiret(e.target.value)}
                                            required={isPro}
                                        />
                                    </div>
                                </div>
                            )}
                        </>
                    )}

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

                    {error && (
                        <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '-0.5rem', marginBottom: '0.5rem' }}>
                            {error}
                        </div>
                    )}

                    <button type="submit" className={styles.submitButton} disabled={isLoading}>
                        {isLoading ? (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <Loader2 size={20} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
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
                        @keyframes fadeIn {
                            from { opacity: 0; transform: translateY(-10px); }
                            to { opacity: 1; transform: translateY(0); }
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
