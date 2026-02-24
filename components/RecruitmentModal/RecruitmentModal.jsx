'use client';

import React, { useState } from 'react';
import styles from './RecruitmentModal.module.css';
import { X, Upload, Paperclip } from 'lucide-react';

import { createPortal } from 'react-dom';
import useLockBodyScroll from '@/hooks/useLockBodyScroll';

export default function RecruitmentModal({ onClose }) {
    useLockBodyScroll(true);
    const [fileName, setFileName] = useState(null);
    const [file, setFile] = useState(null);
    const [mounted, setMounted] = useState(false);
    const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'

    React.useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted) return null;

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFileName(e.target.files[0].name);
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const formData = new FormData(e.target);
            if (file) {
                formData.set('file', file);
            }

            const response = await fetch('/api/recrutement', {
                method: 'POST',
                body: formData // pas de Content-Type json, le navigateur gère le multipart form data
            });

            if (response.ok) {
                setStatus('success');
                setTimeout(() => {
                    onClose();
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
        <div className={styles.backdrop} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>
                    <X size={20} />
                </button>

                <div className={styles.header}>
                    <h2 className={styles.title}>Rejoignez l'aventure</h2>
                    <p className={styles.subtitle}>Parlez-nous de vous.</p>
                </div>

                {status === 'success' ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                        <h3 style={{ color: '#49B197', marginBottom: '15px' }}>Candidature envoyée !</h3>
                        <p style={{ color: 'white', opacity: 0.9 }}>
                            Merci pour votre message. Nous reviendrons vers vous très prochainement.
                        </p>
                    </div>
                ) : (
                    <form className={styles.form} onSubmit={handleSubmit}>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Qui êtes-vous ?</label>
                            <input
                                name="name"
                                type="text"
                                className={styles.input}
                                placeholder="Ex: Marie Martin"
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Comment vous joindre ?</label>
                            <input
                                name="email"
                                type="email"
                                className={styles.input}
                                placeholder="Ex: marie.martin@email.com"
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Un CV, une lettre, un portfolio ?</label>
                            <div className={styles.fileInputWrapper}>
                                <input
                                    type="file"
                                    className={styles.fileInput}
                                    onChange={handleFileChange}
                                    accept=".pdf,.doc,.docx,.jpg,.png"
                                />
                                <div className={styles.fileLabel}>
                                    <Paperclip size={18} />
                                    <span>{fileName ? fileName : "Glissez ou cliquez pour ajouter un fichier"}</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Dites-nous tout...</label>
                            <textarea
                                name="message"
                                className={styles.textarea}
                                placeholder="Ex: Passionné(e) par le CBD, je souhaite rejoindre une équipe dynamique..."
                                required
                            ></textarea>
                        </div>

                        {status === 'error' && (
                            <p style={{ color: '#ff6b6b', textAlign: 'center', marginBottom: '15px', fontSize: '0.9rem' }}>
                                Une erreur est survenue lors de l'envoi. Veuillez réessayer.
                            </p>
                        )}

                        <button type="submit" className={styles.submitButton} disabled={status === 'loading'}>
                            {status === 'loading' ? 'Envoi en cours...' : 'Envoyer ma candidature'}
                        </button>
                    </form>
                )}
            </div>
        </div>,
        document.body
    );
}
