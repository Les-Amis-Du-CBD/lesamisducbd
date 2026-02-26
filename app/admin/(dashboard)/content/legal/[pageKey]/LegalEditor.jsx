'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import { Save, Loader2 } from 'lucide-react';
import styles from './LegalEditor.module.css';

export default function LegalEditor({ pageKey, initialData }) {
    const [data, setData] = useState(initialData);
    const [saving, setSaving] = useState(false);
    const router = useRouter();
    const { showToast } = useToast();

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch(`/api/admin/content/legal/${pageKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error('Erreur de sauvegarde');

            showToast('success', `Page ${pageKey.toUpperCase()} mise à jour`);
            router.refresh();
        } catch (error) {
            console.error(error);
            showToast('error', 'Erreur lors de la sauvegarde');
        } finally {
            setSaving(false);
        }
    };

    const updateHero = (field, value) => {
        setData(prev => ({
            ...prev,
            hero: { ...prev.hero, [field]: value }
        }));
    };

    const updateMarkdown = (value) => {
        setData(prev => ({ ...prev, markdown: value }));
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <Link href="/admin/content" className={styles.backLink}>← Retour</Link>
                    <h1 className={styles.title}>Éditeur : {pageKey.toUpperCase()}</h1>
                    <p className={styles.subtitle}>
                        Modifiez le contenu textuel de la page. Utilisez un formatage simplifié.
                    </p>
                </div>
                <button onClick={handleSave} disabled={saving} className={styles.saveBtn}>
                    {saving ? <Loader2 size={18} className={styles.spin} /> : <Save size={18} />}
                    Enregistrer
                </button>
            </div>

            <div className={styles.formLayout}>
                <div className={styles.panel}>
                    <h2 className={styles.panelTitle}>Héro (En-tête)</h2>
                    <div className={styles.inputGroup}>
                        <label>Titre Principal</label>
                        <input type="text" value={data.hero.title} onChange={e => updateHero('title', e.target.value)} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Sous-Titre / Description</label>
                        <input type="text" value={data.hero.subtitle} onChange={e => updateHero('subtitle', e.target.value)} />
                    </div>
                </div>

                <div className={styles.panel}>
                    <h2 className={styles.panelTitle}>Contenu du Texte Documentaire</h2>

                    <div className={styles.instructions}>
                        <strong>Aide au formatage (Markdown simplifié) :</strong>
                        <ul>
                            <li>Commencez une ligne par <code>## </code> pour créer un <strong>Grand Titre</strong> (H2)</li>
                            <li>Commencez une ligne par <code>### </code> pour créer un <strong>Sous-Titre</strong> (H3)</li>
                            <li>Commencez une ligne par <code>- </code> pour créer une <strong>Puce</strong> (Liste / Bullet point)</li>
                            <li>Séparez vos paragraphes classiques par un saut de ligne.</li>
                            <li>Utilisez <code>**texte**</code> pour mettre en <strong>gras</strong>.</li>
                        </ul>
                    </div>

                    <textarea
                        className={styles.markdownArea}
                        rows={25}
                        value={data.markdown}
                        onChange={e => updateMarkdown(e.target.value)}
                        placeholder="Exemple:\n## Article 1\nContenu paragraphe...\n- Point 1\n- Point 2"
                    />
                </div>
            </div>
        </div>
    );
}
