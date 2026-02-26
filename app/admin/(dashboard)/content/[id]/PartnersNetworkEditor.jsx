'use client';
import { useState } from 'react';
import styles from './Editor.module.css';
import ImageUpload from '@/components/Admin/ImageUpload';

export default function PartnersNetworkEditor({ section, onSave }) {
    const [title, setTitle] = useState(section.props.title || '');
    const [partners, setPartners] = useState(section.props.partners || []);
    const [isVisible, setIsVisible] = useState(section.props.isVisible !== false);
    const [saving, setSaving] = useState(false);

    const handlePartnerChange = (index, field, value) => {
        const newPartners = [...partners];
        newPartners[index][field] = value;
        setPartners(newPartners);
    };

    const addItem = () => {
        setPartners([...partners, { name: "Nouveau", image: "" }]);
    };

    const removeItem = (index) => {
        if (confirm('Supprimer ce partenaire ?')) {
            const newPartners = partners.filter((_, i) => i !== index);
            setPartners(newPartners);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        await onSave(section.id, { title, partners, isVisible });
        setSaving(false);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form} style={{ maxWidth: '800px' }}>
            <div style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #1F4B40' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
                    <input
                        type="checkbox"
                        checked={isVisible}
                        onChange={(e) => setIsVisible(e.target.checked)}
                        style={{ width: '18px', height: '18px' }}
                    />
                    Afficher cette section sur le site web
                </label>
                <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>Décochez cette case pour masquer cette partie au public.</small>
            </div>

            <div className={styles.fieldGroup}>
                <label>Titre de la section</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={styles.input}
                />
            </div>

            <div className={styles.fieldGroup}>
                <label>Logos Partenaires ({partners.length})</label>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                    {partners.map((partner, index) => (
                        <div key={index} style={{
                            border: '1px solid #eee',
                            padding: '15px',
                            borderRadius: '8px',
                            background: '#fafafa',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px'
                        }}>
                            <ImageUpload
                                currentImage={partner.image}
                                onImageChange={(url) => handlePartnerChange(index, 'image', url)}
                            />

                            <input
                                type="text"
                                value={partner.name}
                                onChange={(e) => handlePartnerChange(index, 'name', e.target.value)}
                                className={styles.input}
                                placeholder="Nom"
                            />

                            <button type="button" onClick={() => removeItem(index)} style={{
                                color: 'red',
                                border: '1px solid #fcc',
                                background: '#fff0f0',
                                padding: '5px',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}>
                                Supprimer
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
                    fontWeight: 'bold',
                    width: '100%'
                }}>
                    + Ajouter un logo
                </button>
            </div>

            <button type="submit" className={styles.saveBtn} disabled={saving}>
                {saving ? 'Sauvegarde...' : 'Sauvegarder tout'}
            </button>
        </form>
    );
}
