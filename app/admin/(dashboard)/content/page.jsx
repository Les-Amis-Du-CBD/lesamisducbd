'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './ContentDashboard.module.css';
import Link from 'next/link';

export default function ContentDashboard() {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const res = await fetch('/api/admin/content');
            if (res.ok) {
                const data = await res.json();
                // Filter only editable sections based on our list
                const editableTypes = ['Hero', 'Marquee', 'FAQ', 'Partners', 'PartnersNetwork', 'Quote'];
                const filtered = data.sections.filter(s => editableTypes.includes(s.type));
                setSections(filtered);
            }
        } catch (error) {
            console.error('Failed to load content', error);
        } finally {
            setLoading(false);
        }
    };

    const getSectionLabel = (type) => {
        switch (type) {
            case 'Hero': return 'Héro (Bannière Principale)';
            case 'Marquee': return 'Bandeau Défilant (Promo)';
            case 'FAQ': return 'Foire Aux Questions';
            case 'Partners': return 'Témoignages Buralistes';
            case 'PartnersNetwork': return 'Réseau Partenaires (Logos)';
            case 'Quote': return 'Citation (Manifesto)';
            default: return type;
        }
    };

    if (loading) return <div className={styles.loading}>Chargement du contenu...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Gestion du Contenu</h1>
                <p className={styles.subtitle}>Modifiez les textes et images de la page d'accueil en temps réel.</p>
            </div>

            <div className={styles.grid}>
                {sections.map((section) => (
                    <Link href={`/admin/content/${section.id}`} key={section.id} className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span className={styles.typeBadge}>{section.type}</span>
                        </div>
                        <h2 className={styles.cardTitle}>{getSectionLabel(section.type)}</h2>
                        <div className={styles.cardFooter}>
                            <span className={styles.editLink}>Modifier &rarr;</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
