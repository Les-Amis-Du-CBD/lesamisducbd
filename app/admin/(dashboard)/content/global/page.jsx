'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../[id]/Editor.module.css';

const DEFAULTS = {
    contact: {
        title: "Les Amis du CBD France",
        address: "25 rue principale 07120 Chauzon (FR)",
        phone: "06 71 82 42 87",
        email: "lesamisducbd@gmail.com"
    },
    footerLinks: [
        { label: "Livraison", href: "/livraison" },
        { label: "CGV", href: "/cgv" },
        { label: "Politique de confidentialité", href: "/privacy" },
        { label: "Transparence", href: "/transparence" },
        { label: "Buraliste", href: "/buraliste" }
    ]
};

export default function GlobalContentPage() {
    const [loaded, setLoaded] = useState(false);
    const [saving, setSaving] = useState(false);
    const [tab, setTab] = useState('contact');

    const [contact, setContact] = useState(DEFAULTS.contact);
    const [footerLinks, setFooterLinks] = useState(DEFAULTS.footerLinks);

    useEffect(() => {
        const controller = new AbortController();
        fetch('/api/admin/content/global', { signal: controller.signal })
            .then(r => r.json())
            .then(data => {
                if (data.contact) setContact(data.contact);
                if (data.footerLinks) setFooterLinks(data.footerLinks);
                setLoaded(true);
            }).catch(err => {
                if (err.name !== 'AbortError') setLoaded(true);
            });
        return () => controller.abort();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await fetch('/api/admin/content/global', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contact, footerLinks })
            });
            alert('Modifications enregistrées !');
        } catch { alert('Erreur lors de la sauvegarde'); }
        finally { setSaving(false); }
    };

    const updateLink = (index, field, value) => {
        setFooterLinks(prev => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: value };
            return next;
        });
    };

    const addLink = () => setFooterLinks(prev => [...prev, { label: '', href: '/' }]);
    const removeLink = (index) => setFooterLinks(prev => prev.filter((_, i) => i !== index));

    if (!loaded) return <div style={{ padding: 20 }}>Chargement...</div>;

    const TABS = [
        { id: 'contact', label: '📞 Informations de contact' },
        { id: 'footer', label: '🔗 Liens Footer' }
    ];

    return (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Link href="/admin/content" style={{ textDecoration: 'none', color: '#666' }}>← Retour</Link>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1F4B40', margin: 0 }}>🌍 Éléments Globaux</h1>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, borderBottom: '2px solid #eee', paddingBottom: 0 }}>
                {TABS.map(t => (
                    <button key={t.id} type="button" onClick={() => setTab(t.id)} style={{
                        background: 'none', border: 'none', borderBottom: tab === t.id ? '3px solid #1F4B40' : '3px solid transparent',
                        padding: '6px 14px', fontWeight: 700, color: tab === t.id ? '#1F4B40' : '#888',
                        cursor: 'pointer', fontSize: '0.85rem', marginBottom: -2
                    }}>{t.label}</button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className={styles.form} style={{ maxWidth: '100%' }}>

                {/* Contact */}
                {tab === 'contact' && (
                    <>
                        {[
                            { key: 'title', label: "Nom de l'entreprise" },
                            { key: 'address', label: 'Adresse' },
                            { key: 'phone', label: 'Téléphone' },
                            { key: 'email', label: 'Email' }
                        ].map(({ key, label }) => (
                            <div key={key} className={styles.fieldGroup}>
                                <label>{label}</label>
                                <input
                                    className={styles.input}
                                    value={contact[key]}
                                    onChange={e => {
                                        const value = e.target.value;
                                        setContact(prev => ({ ...prev, [key]: value }));
                                    }}
                                />
                            </div>
                        ))}
                    </>
                )}

                {/* Footer links */}
                {tab === 'footer' && (
                    <>
                        {footerLinks.map((link, i) => (
                            <div key={i} style={{ border: '1px solid #eee', borderRadius: 8, padding: 15, background: '#fafafa', display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                                <div className={styles.fieldGroup} style={{ flex: 1, marginBottom: 0 }}>
                                    <label>Label</label>
                                    <input className={styles.input} value={link.label} onChange={e => updateLink(i, 'label', e.target.value)} />
                                </div>
                                <div className={styles.fieldGroup} style={{ flex: 2, marginBottom: 0 }}>
                                    <label>URL</label>
                                    <input className={styles.input} value={link.href} onChange={e => updateLink(i, 'href', e.target.value)} />
                                </div>
                                <button type="button" onClick={() => removeLink(i)} style={{ color: 'red', background: 'none', border: '1px solid #fcc', borderRadius: 6, padding: '8px 12px', cursor: 'pointer', flexShrink: 0 }}>✕</button>
                            </div>
                        ))}
                        <button type="button" onClick={addLink} style={{
                            padding: '10px', background: '#e0fbf4', border: '1px dashed #1F4B40',
                            color: '#1F4B40', borderRadius: 8, cursor: 'pointer', fontWeight: 700, width: '100%', marginTop: 5
                        }}>+ Ajouter un lien</button>
                    </>
                )}

                <button type="submit" className={styles.saveBtn} disabled={saving}>
                    {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                </button>
            </form>
        </div>
    );
}
