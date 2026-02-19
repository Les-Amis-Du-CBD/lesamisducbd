'use client';
import { useState } from 'react';
import styles from './Editor.module.css';

export default function MarqueeEditor({ section, onSave }) {
    const [props, setProps] = useState(section.props);
    const [saving, setSaving] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProps(prev => ({ ...prev, [name]: value }));
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
                <label>Texte Défilant</label>
                <textarea
                    name="text"
                    value={props.text}
                    onChange={handleChange}
                    rows={3}
                    className={styles.textarea}
                    placeholder="Ex: LIVRAISON OFFERTE..."
                />
            </div>

            <div className={styles.fieldGroup}>
                <label>Vitesse de défilement (secondes)</label>
                <input
                    type="number"
                    name="speed"
                    value={props.speed}
                    onChange={handleChange}
                    className={styles.input}
                    min="5"
                    max="100"
                />
                <small className={styles.smallText}>Plus le chiffre est bas, plus ça va vite.</small>
            </div>

            <button type="submit" className={styles.saveBtn} disabled={saving}>
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
        </form>
    );
}
