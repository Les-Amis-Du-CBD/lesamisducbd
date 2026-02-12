'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2 } from 'lucide-react';
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

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            if (isLogin) {
                console.log("Login attempted with:", { email, password });
            } else {
                console.log("Registration attempted with:", { name, email, password });
            }
            onClose();
        }, 1500);
    };

    const toggleMode = (e) => {
        e?.preventDefault();
        setIsLogin(!isLogin);
        setEmail('');
        setPassword('');
        setName('');
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
                        <div className={styles.inputGroup} style={{ animation: 'fadeIn 0.3s ease' }}>
                            <label className={styles.label} htmlFor="name">Prénom</label>
                            <input
                                type="text"
                                id="name"
                                className={styles.input}
                                placeholder="Votre prénom"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required={!isLogin}
                            />
                        </div>
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
                        <input
                            type="password"
                            id="password"
                            className={styles.input}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

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
