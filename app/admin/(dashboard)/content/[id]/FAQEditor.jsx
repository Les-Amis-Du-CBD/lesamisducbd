'use client';
import { useState } from 'react';
import styles from './Editor.module.css';

export default function FAQEditor({ section, onSave }) {
    const [title, setTitle] = useState(section.props.title || '');
    const [items, setItems] = useState(section.props.items || []);
    const [saving, setSaving] = useState(false);

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { question: "Nouvelle question ?", answer: "Réponse ici." }]);
    };

    const removeItem = (index) => {
        if (confirm('Supprimer cette question ?')) {
            const newItems = items.filter((_, i) => i !== index);
            setItems(newItems);
        }
    };

    const moveItem = (index, direction) => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === items.length - 1) return;

        const newItems = [...items];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        const temp = newItems[targetIndex];
        newItems[targetIndex] = newItems[index];
        newItems[index] = temp;
        setItems(newItems);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        await onSave(section.id, { title, items });
        setSaving(false);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form} style={{ maxWidth: '800px' }}>
            <div className={styles.fieldGroup}>
                <label>Titre de la section</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={styles.input}
                    placeholder="Ex: Le CBD, expliqué simplement"
                />
            </div>

            <div className={styles.fieldGroup}>
                <label>Questions / Réponses ({items.length})</label>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {items.map((item, index) => (
                        <div key={index} style={{
                            border: '1px solid #eee',
                            padding: '15px',
                            borderRadius: '8px',
                            background: '#fafafa',
                            position: 'relative'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '5px', marginBottom: '10px' }}>
                                <button type="button" onClick={() => moveItem(index, 'up')} disabled={index === 0}>↑</button>
                                <button type="button" onClick={() => moveItem(index, 'down')} disabled={index === items.length - 1}>↓</button>
                                <button type="button" onClick={() => removeItem(index)} style={{ color: 'red', marginLeft: '10px' }}>🗑️</button>
                            </div>

                            <input
                                type="text"
                                value={item.question}
                                onChange={(e) => handleItemChange(index, 'question', e.target.value)}
                                className={styles.input}
                                style={{ marginBottom: '10px', fontWeight: 'bold' }}
                                placeholder="Question"
                            />
                            <textarea
                                value={item.answer}
                                onChange={(e) => handleItemChange(index, 'answer', e.target.value)}
                                className={styles.textarea}
                                rows={3}
                                placeholder="Réponse (HTML accepté)"
                            />
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
                    + Ajouter une question
                </button>
            </div>

            <button type="submit" className={styles.saveBtn} disabled={saving}>
                {saving ? 'Sauvegarde...' : 'Sauvegarder tout'}
            </button>
        </form>
    );
}
