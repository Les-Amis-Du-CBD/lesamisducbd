'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../[id]/Editor.module.css';

const DEFAULTS = {
    hero: {
        title: "CBD accessible et pas cher pour buralistes : devenez partenaire des Amis du CBD.",
        text: "Les Amis du CBD est une marque française pensée pour les bureaux de tabac : du CBD naturel, légal, accessible en prix et simple à commercialiser.\n\nNotre ambition est claire : démocratiser le CBD de qualité, sans promesses floues ni prix excessifs.\n\nVotre bureau de tabac est le lieu idéal pour proposer un CBD pas cher, fiable et conforme à la réglementation, à une clientèle de plus en plus demandeuse."
    },
    features1: [
        { title: "Sécurité & légalité avant tout", description: "Produits conformes à la législation française, avec moins de 0,3 % de THC." },
        { title: "Produits testés et traçables", description: "Analyses par des laboratoires indépendants et vente sous scellé de protection." },
        { title: "Zéro risque en bureau de tabac", description: "Une gamme pensée pour une vente simple, claire et sans mauvaise surprise." },
        { title: "CBD 100 % naturel, sans lavage chimique", description: "Fleurs cultivées naturellement, sans traitements artificiels, pour une qualité constante." },
        { title: "Prix public ultra accessible", description: "Des fleurs entre 1,50 € et 2 € le gramme, adaptées à une forte demande." }
    ],
    features2: [
        { title: "Gain de temps au quotidien", description: "Commandes rapides et gestion simplifiée pour se concentrer sur les ventes." },
        { title: "Accompagnement clé en main", description: "Présentoirs adaptés, supports pédagogiques et outils d'aide à la vente inclus." },
        { title: "Différenciation en point de vente", description: "Une offre CBD claire qui vous démarque de la concurrence." },
        { title: "Marge attractive pour le buraliste", description: "Un produit accessible qui reste rentable et compétitif." },
        { title: "Excellent rapport qualité / prix", description: "Un positionnement rare sur le marché, apprécié par les clients exigeants." }
    ],
    steps: [
        { title: "CONTACTEZ NOTRE ÉQUIPE COMMERCIALE", text: "Notre équipe est disponible pour répondre à vos questions et vous accompagner dans la mise en place.\n06 71 82 42 87" },
        { title: "DEMANDEZ VOTRE KIT DE DÉMARRAGE", text: "Vous souhaitez tester le potentiel du CBD dans votre boutique ?\n\nDemandez votre kit de démarrage gratuit, incluant une sélection de nos produits phares, pour évaluer rapidement les ventes." },
        { title: "Prenez une longueur d'avance sur vos concurrents", text: "Transformez votre bureau de tabac en un point de référence du CBD accessible et pas cher, tout en rassurant votre clientèle sur la qualité et la légalité des produits.\n\nLes Amis du CBD, c'est le CBD bien fait, bien expliqué, et bien vendu.\n\nAmicalement,\nLes Amis du CBD" }
    ]
};

export default function BuralisteContentPage() {
    const [loaded, setLoaded] = useState(false);
    const [saving, setSaving] = useState(false);
    const [tab, setTab] = useState('hero');

    const [hero, setHero] = useState(DEFAULTS.hero);
    const [features1, setFeatures1] = useState(DEFAULTS.features1);
    const [features2, setFeatures2] = useState(DEFAULTS.features2);
    const [steps, setSteps] = useState(DEFAULTS.steps);

    const [visibility, setVisibility] = useState({
        hero: true,
        features1: true,
        features2: true,
        steps: true,
        calculator: true
    });

    useEffect(() => {
        const controller = new AbortController();
        fetch('/api/admin/content/buraliste', { signal: controller.signal })
            .then(r => r.json())
            .then(data => {
                if (data.hero) setHero(data.hero);
                if (data.features1) setFeatures1(data.features1);
                if (data.features2) setFeatures2(data.features2);
                if (data.steps) setSteps(data.steps);
                if (data.visibility) setVisibility(prev => ({ ...prev, ...data.visibility }));
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
            await fetch('/api/admin/content/buraliste', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ hero, features1, features2, steps, visibility })
            });
            alert('Modifications enregistrées !');
        } catch { alert('Erreur lors de la sauvegarde'); }
        finally { setSaving(false); }
    };

    const updateFeature = (setter, index, field, value) => {
        setter(prev => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: value };
            return next;
        });
    };

    const updateStep = (index, field, value) => {
        setSteps(prev => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: value };
            return next;
        });
    };

    const TABS = [
        { id: 'hero', label: '🏷 Hero' },
        { id: 'features1', label: '🔒 Sécurité (5 args)' },
        { id: 'features2', label: '📈 Business (5 args)' },
        { id: 'steps', label: '📋 Étapes' }
    ];

    if (!loaded) return <div style={{ padding: 20 }}>Chargement...</div>;

    return (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Link href="/admin/content" style={{ textDecoration: 'none', color: '#666' }}>← Retour</Link>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1F4B40', margin: 0 }}>🏪 Buraliste</h1>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, borderBottom: '2px solid #eee', paddingBottom: 0, overflowX: 'auto', flexWrap: 'nowrap', WebkitOverflowScrolling: 'touch' }}>
                {TABS.map(t => (
                    <button key={t.id} type="button" onClick={() => setTab(t.id)} style={{
                        background: 'none', border: 'none', borderBottom: tab === t.id ? '3px solid #1F4B40' : '3px solid transparent',
                        padding: '6px 14px', fontWeight: 700, color: tab === t.id ? '#1F4B40' : '#888',
                        cursor: 'pointer', fontSize: '0.85rem', marginBottom: -2
                    }}>{t.label}</button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className={styles.form} style={{ maxWidth: '100%' }}>

                <div style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #1F4B40' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
                        <input
                            type="checkbox"
                            checked={visibility[tab] !== false}
                            onChange={(e) => setVisibility(prev => ({ ...prev, [tab]: e.target.checked }))}
                            style={{ width: '18px', height: '18px' }}
                        />
                        Afficher  sur le site web
                    </label>
                    {tab === 'hero' && (
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>
                            <input
                                type="checkbox"
                                checked={visibility.calculator !== false}
                                onChange={(e) => setVisibility(prev => ({ ...prev, calculator: e.target.checked }))}
                                style={{ width: '18px', height: '18px' }}
                            />
                            Afficher le simulateur de revenus sur le site web
                        </label>
                    )}
                    <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>Décochez cette case pour masquer cette partie au public.</small>
                </div>

                {/* Hero */}
                {tab === 'hero' && (
                    <>
                        <div className={styles.fieldGroup}>
                            <label>Titre H1</label>
                            <textarea className={styles.textarea} value={hero.title} rows={2} onChange={e => setHero(h => ({ ...h, title: e.target.value }))} />
                        </div>
                        <div className={styles.fieldGroup}>
                            <label>Corps du texte (les retours à la ligne seront respectés)</label>
                            <textarea className={styles.textarea} value={hero.text} rows={6} onChange={e => setHero(h => ({ ...h, text: e.target.value }))} />
                        </div>
                    </>
                )}

                {/* Features 1 */}
                {tab === 'features1' && features1.map((f, i) => (
                    <div key={i} style={{ border: '1px solid #eee', borderRadius: 8, padding: 15, background: '#fafafa' }}>
                        <p style={{ fontWeight: 700, color: '#888', fontSize: '0.8rem', margin: '0 0 10px', textTransform: 'uppercase' }}>Argument {i + 1}</p>
                        <div className={styles.fieldGroup}>
                            <label>Titre</label>
                            <input className={styles.input} value={f.title} onChange={e => updateFeature(setFeatures1, i, 'title', e.target.value)} />
                        </div>
                        <div className={styles.fieldGroup}>
                            <label>Description</label>
                            <textarea className={styles.textarea} value={f.description} rows={2} onChange={e => updateFeature(setFeatures1, i, 'description', e.target.value)} />
                        </div>
                    </div>
                ))}

                {/* Features 2 */}
                {tab === 'features2' && features2.map((f, i) => (
                    <div key={i} style={{ border: '1px solid #eee', borderRadius: 8, padding: 15, background: '#fafafa' }}>
                        <p style={{ fontWeight: 700, color: '#888', fontSize: '0.8rem', margin: '0 0 10px', textTransform: 'uppercase' }}>Argument {i + 1}</p>
                        <div className={styles.fieldGroup}>
                            <label>Titre</label>
                            <input className={styles.input} value={f.title} onChange={e => updateFeature(setFeatures2, i, 'title', e.target.value)} />
                        </div>
                        <div className={styles.fieldGroup}>
                            <label>Description</label>
                            <textarea className={styles.textarea} value={f.description} rows={2} onChange={e => updateFeature(setFeatures2, i, 'description', e.target.value)} />
                        </div>
                    </div>
                ))}

                {/* Steps */}
                {tab === 'steps' && steps.map((step, i) => (
                    <div key={i} style={{ border: '1px solid #eee', borderRadius: 8, padding: 15, background: '#fafafa' }}>
                        <p style={{ fontWeight: 700, color: '#888', fontSize: '0.8rem', margin: '0 0 10px', textTransform: 'uppercase' }}>Étape {i + 1}</p>
                        <div className={styles.fieldGroup}>
                            <label>Titre</label>
                            <input className={styles.input} value={step.title} onChange={e => updateStep(i, 'title', e.target.value)} />
                        </div>
                        <div className={styles.fieldGroup}>
                            <label>Texte</label>
                            <textarea className={styles.textarea} value={step.text} rows={4} onChange={e => updateStep(i, 'text', e.target.value)} />
                        </div>
                    </div>
                ))}

                <button type="submit" className={styles.saveBtn} disabled={saving}>
                    {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                </button>
            </form>
        </div>
    );
}
