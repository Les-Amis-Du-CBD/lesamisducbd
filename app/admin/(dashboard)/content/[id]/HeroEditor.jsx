'use client';
import { useState } from 'react';
import styles from './Editor.module.css';
import ImageUpload from '@/components/Admin/ImageUpload';

export default function HeroEditor({ section, onSave }) {
    const [props, setProps] = useState(section.props);
    const [saving, setSaving] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProps(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (url) => {
        setProps(prev => ({ ...prev, backgroundImage: url }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        await onSave(section.id, props);
        setSaving(false);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.fieldGroup}>
                <label>Image de fond</label>
                <ImageUpload
                    currentImage={props.backgroundImage}
                    onImageChange={handleImageChange}
                />
            </div>

            <div className={styles.fieldGroup}>
                <label>Titre Principal (HTML accepté)</label>
                <textarea
                    name="title"
                    value={props.title}
                    onChange={handleChange}
                    rows={3}
                    className={styles.textarea}
                />
                <small className={styles.smallText}>Utilisez &lt;br /&gt; pour les sauts de ligne.</small>
            </div>

            <div className={styles.fieldGroup}>
                <label>Description</label>
                <textarea
                    name="description"
                    value={props.description}
                    onChange={handleChange}
                    rows={4}
                    className={styles.textarea}
                />
            </div>

            <div className={styles.row}>
                <div className={styles.fieldGroup}>
                    <label>Label Bouton</label>
                    <input
                        type="text"
                        name="ctaLabel"
                        value={props.ctaLabel || ''}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>
                <div className={styles.fieldGroup}>
                    <label>Lien Bouton</label>
                    <input
                        type="text"
                        name="ctaLink"
                        value={props.ctaLink || ''}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>
            </div>

            <button type="submit" className={styles.saveBtn} disabled={saving}>
                {saving ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
            </button>
        </form>
    );
}
