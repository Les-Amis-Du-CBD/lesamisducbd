'use client';

import React, { useState } from 'react';
import styles from './RecruitmentModal.module.css';
import { X, Upload, Paperclip } from 'lucide-react';

export default function RecruitmentModal({ onClose }) {
    const [fileName, setFileName] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFileName(e.target.files[0].name);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would handle form submission logic (API call, etc.)
        alert("Merci pour votre candidature ! Nous vous répondrons très vite.");
        onClose();
    };

    return (
        <div className={styles.backdrop} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>
                    <X size={20} />
                </button>

                <div className={styles.header}>
                    <h2 className={styles.title}>Rejoignez l'aventure</h2>
                    <p className={styles.subtitle}>Parlez-nous de vous.</p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Qui êtes-vous ?</label>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="Nom & Prénom"
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Comment vous joindre ?</label>
                        <input
                            type="email"
                            className={styles.input}
                            placeholder="Votre adresse email"
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
                            className={styles.textarea}
                            placeholder="Pourquoi Les Amis du CBD ? Vos motivations, vos idées..."
                            required
                        ></textarea>
                    </div>

                    <button type="submit" className={styles.submitButton}>
                        Envoyer ma candidature
                    </button>
                </form>
            </div>
        </div>
    );
}
