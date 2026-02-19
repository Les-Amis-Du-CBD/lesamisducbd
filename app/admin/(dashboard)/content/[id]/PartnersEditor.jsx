'use client';
import { useState } from 'react';
import styles from './Editor.module.css';

export default function PartnersEditor({ section, onSave }) {
    const [title, setTitle] = useState(section.props.title || '');
    const [subtitle, setSubtitle] = useState(section.props.subtitle || '');
    const [partners, setPartners] = useState(section.props.partners || []);
    const [saving, setSaving] = useState(false);

    const handlePartnerChange = (index, field, value) => {
        const newPartners = [...partners];
        newPartners[index][field] = value;
        setPartners(newPartners);
    };

    const addItem = () => {
        setPartners([...partners, { name: "Nouveau Tabac", role: "Gérant", quote: "Super produits !" }]);
    };

    const removeItem = (index) => {
        if (confirm('Supprimer ce témoignage ?')) {
            const newPartners = partners.filter((_, i) => i !== index);
            setPartners(newPartners);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        await onSave(section.id, { title, subtitle, partners });
        setSaving(false);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form} style={{ maxWidth: '800px' }}>
            <div className={styles.fieldGroup}>
                <label>Titre (Chiffre '300' animé automatiquement)</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={styles.input}
                />
            </div>

            <div className={styles.fieldGroup}>
                <label>Sous-titre (HTML accepté)</label>
                <textarea
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className={styles.textarea}
                    rows={2}
                />
            </div>

            <div className={styles.fieldGroup}>
                <label>Témoignages ({partners.length})</label>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {partners.map((partner, index) => (
                        <div key={index} style={{
                            border: '1px solid #eee',
                            padding: '15px',
                            borderRadius: '8px',
                            background: '#fafafa'
                        }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                                <input
                                    type="text"
                                    value={partner.name}
                                    onChange={(e) => handlePartnerChange(index, 'name', e.target.value)}
                                    className={styles.input}
                                    placeholder="Nom du Tabac"
                                />
                                <input
                                    type="text"
                                    value={partner.role}
                                    onChange={(e) => handlePartnerChange(index, 'role', e.target.value)}
                                    className={styles.input}
                                    placeholder="Rôle (ex: Gérant)"
                                />
                            </div>

                            <textarea
                                value={partner.quote}
                                onChange={(e) => handlePartnerChange(index, 'quote', e.target.value)}
                                className={styles.textarea}
                                rows={3}
                                placeholder="Citation"
                            />

                            <button type="button" onClick={() => removeItem(index)} style={{
                                marginTop: '10px',
                                color: 'red',
                                border: 'none',
                                background: 'none',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                textDecoration: 'underline'
                            }}>
                                Supprimer ce témoignage
                            </button>
                        </div>
                    ))}
                </div>

                <button type="button" onClick={addItem} style={{
                    padding: '10px',
                    background: '#e0fbf4',
                    border: '1px dashed #1F4B40',
                    color: '#1F4B40',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    marginTop: '10px',
                    fontWeight: 'bold'
                }}>
                    + Ajouter un témoignage
                </button>
            </div>

            <button type="submit" className={styles.saveBtn} disabled={saving}>
                {saving ? 'Sauvegarde...' : 'Sauvegarder tout'}
            </button>
        </form>
    );
}
