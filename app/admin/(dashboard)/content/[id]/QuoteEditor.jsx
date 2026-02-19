'use client';
import { useState } from 'react';
import styles from './Editor.module.css';

export default function QuoteEditor({ section, onSave }) {
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
                <label>Texte de la citation (HTML accepté)</label>
                <textarea
                    name="text"
                    value={props.text}
                    onChange={handleChange}
                    rows={5}
                    className={styles.textarea}
                />
            </div>

            <div className={styles.fieldGroup}>
                <label>Auteur</label>
                <input
                    type="text"
                    name="author"
                    value={props.author}
                    onChange={handleChange}
                    className={styles.input}
                />
            </div>

            <button type="submit" className={styles.saveBtn} disabled={saving}>
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
        </form>
    );
}
