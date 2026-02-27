'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../Builder.module.css';

const TEMPLATES = [
    { type: 'ContentHero', label: 'Héro (Dégradé/Image)', icon: '🖼', defaultProps: { title: 'Titre de la page', imageSrc: '' } },
    { type: 'RichText', label: 'Texte Riche', icon: '📝', defaultProps: { content: '<p>Votre texte riche ici...</p>', title: 'Titre de la section', centered: true } },
    { type: 'FAQ', label: 'FAQ', icon: '❓', defaultProps: { title: 'Questions Fréquentes', items: [{ question: 'Ma question ?', answer: 'Ma réponse ici.' }] } },
    { type: 'ProductList', label: 'Liste de Produits', icon: '🛍', defaultProps: { title: 'Nos Produits Phares', description: 'Découvrez notre sélection premium de fleurs CBD.' } },
    { type: 'Quote', label: 'Citation', icon: '🖊', defaultProps: { text: '“Le CBD doit être simple, accessible et de qualité.”', author: 'Nelson — Les Amis du CBD' } },
];

export default function PageEditor() {
    const { slug } = useParams();
    const router = useRouter();
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [editingSectionIndex, setEditingSectionIndex] = useState(null);

    useEffect(() => {
        if (slug) fetchPage();
    }, [slug]);

    const fetchPage = async () => {
        try {
            const res = await fetch(`/api/admin/builder?slug=${slug}`);
            if (!res.ok) throw new Error('Failed to load page');
            const data = await res.json();
            setPage(data);
        } catch (error) {
            console.error('Error:', error);
            router.push('/admin/builder');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/admin/builder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(page)
            });
            if (res.ok) {
                alert('Page sauvegardée !');
            }
        } catch (error) {
            console.error('Error saving:', error);
        } finally {
            setSaving(false);
        }
    };

    const addSection = (template) => {
        const newSection = {
            id: `${template.type.toLowerCase()}-${Date.now()}`,
            type: template.type,
            props: { ...template.defaultProps }
        };
        setPage({ ...page, sections: [...(page.sections || []), newSection] });
        setShowTemplateModal(false);
    };

    const removeSection = (index) => {
        if (!confirm('Supprimer cette section ?')) return;
        const newSections = [...page.sections];
        newSections.splice(index, 1);
        setPage({ ...page, sections: newSections });
    };

    const moveSection = (index, direction) => {
        const newSections = [...page.sections];
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= newSections.length) return;
        [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
        setPage({ ...page, sections: newSections });
    };

    const updateSectionProps = (index, newProps) => {
        const newSections = [...page.sections];
        newSections[index].props = { ...newSections[index].props, ...newProps };
        setPage({ ...page, sections: newSections });
    };

    if (loading) return <div className={styles.container}>Chargement...</div>;

    const editingSection = editingSectionIndex !== null ? page.sections[editingSectionIndex] : null;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <Link href="/admin/builder" className={styles.backLink}>← Retour</Link>
                    <h1 className={styles.title}>Éditeur : {page.title}</h1>
                    <code className={styles.pageSlug}>/p/{page.slug}</code>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <a href={`/p/${page.slug}`} target="_blank" className={styles.previewBtn} style={{ textDecoration: 'none', padding: '10px 20px', borderRadius: '8px', border: '1px solid #ccc', color: '#666' }}>Prévisualiser</a>
                    <button className={styles.saveButton} onClick={handleSave} disabled={saving}>
                        {saving ? 'Enregistrement...' : 'Sauvegarder la page'}
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px', position: 'relative' }}>
                {/* Structure de la page */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Structure de la page</h2>

                    {page.sections?.map((section, index) => (
                        <div key={section.id || index} style={{
                            background: 'white',
                            padding: '16px',
                            borderRadius: '12px',
                            border: editingSectionIndex === index ? '2px solid #00FF94' : '1px solid #ddd',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px'
                        }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <button onClick={() => moveSection(index, -1)} disabled={index === 0} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>▲</button>
                                <button onClick={() => moveSection(index, 1)} disabled={index === page.sections.length - 1} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>▼</button>
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '1.2rem' }}>{TEMPLATES.find(t => t.type === section.type)?.icon || '🧩'}</span>
                                    <strong style={{ color: '#1F4B40' }}>{section.type}</strong>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '4px' }}>
                                    {section.props.title || section.props.text || 'Sans titre'}
                                </div>
                            </div>

                            <button onClick={() => setEditingSectionIndex(index)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ddd', cursor: 'pointer' }}>Modifier</button>
                            <button onClick={() => removeSection(index)} style={{ border: 'none', background: 'none', color: '#ff6666', cursor: 'pointer', padding: '5px' }}>🗑</button>
                        </div>
                    ))}

                    <button
                        onClick={() => setShowTemplateModal(true)}
                        style={{ padding: '20px', borderRadius: '12px', border: '2px dashed #00FF94', background: 'rgba(0, 255, 148, 0.05)', color: '#1F4B40', fontWeight: 700, cursor: 'pointer' }}
                    >
                        + Ajouter une section
                    </button>
                </div>

                {/* Panneau d'édition de section */}
                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #ddd', height: 'fit-content', position: 'sticky', top: '24px' }}>
                    {editingSection ? (
                        <>
                            <h3 style={{ margin: '0 0 20px', display: 'flex', justifyContent: 'space-between' }}>
                                Paramètres {editingSection.type}
                                <button onClick={() => setEditingSectionIndex(null)} style={{ fontSize: '0.8rem', background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>Fermer</button>
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {Object.entries(editingSection.props).map(([key, value]) => {
                                    if (key === 'isVisible') return null;

                                    return (
                                        <div key={key}>
                                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#666', marginBottom: '4px' }}>{key}</label>
                                            {typeof value === 'string' && value.length > 50 ? (
                                                <textarea
                                                    value={value}
                                                    onChange={(e) => updateSectionProps(editingSectionIndex, { [key]: e.target.value })}
                                                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd', height: '100px' }}
                                                />
                                            ) : typeof value === 'object' ? (
                                                <div style={{ fontSize: '0.75rem', color: '#aaa', fontStyle: 'italic' }}>Édition avancée requise (JSON)</div>
                                            ) : (
                                                <input
                                                    type="text"
                                                    value={value}
                                                    onChange={(e) => updateSectionProps(editingSectionIndex, { [key]: e.target.value })}
                                                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        <div style={{ color: '#888', textAlign: 'center', padding: '40px 0' }}>
                            Sélectionnez une section pour la modifier
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Templates */}
            {showTemplateModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: 'white', padding: '32px', borderRadius: '24px', maxWidth: '600px', width: '90%' }}>
                        <h2 style={{ margin: '0 0 24px' }}>Choisir un template</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            {TEMPLATES.map(t => (
                                <button
                                    key={t.type}
                                    onClick={() => addSection(t)}
                                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: '#f9f9f9', border: '1px solid #eee', borderRadius: '12px', cursor: 'pointer', textAlign: 'left' }}
                                >
                                    <span style={{ fontSize: '2rem' }}>{t.icon}</span>
                                    <div>
                                        <div style={{ fontWeight: 700 }}>{t.label}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#888' }}>{t.type}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                        <button onClick={() => setShowTemplateModal(false)} style={{ marginTop: '24px', width: '100%', padding: '12px', borderRadius: '12px', border: 'none', background: '#eee', cursor: 'pointer' }}>Annuler</button>
                    </div>
                </div>
            )}
        </div>
    );
}
