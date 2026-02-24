'use client';

import Link from 'next/link';
import styles from '../ContentDashboard.module.css';

// The home page sections already have dedicated editors at /admin/content/[id]
const HOME_SECTIONS = [
    { id: 'promo-marquee', label: 'Bandeau Défilant', icon: '📢', description: 'Texte promotionnel défilant en haut de page', type: 'Marquee' },
    { id: 'hero-home', label: 'Héro Principal', icon: '🖼', description: 'Titre, description, image de fond et bouton CTA', type: 'Hero' },
    { id: 'why-choose-us', label: 'Pourquoi Nous Choisir', icon: '✅', description: '6 arguments différenciants', type: 'WhyChooseUs' },
    { id: 'faq-section', label: 'FAQ', icon: '❓', description: 'Questions/réponses fréquentes', type: 'FAQ' },
    { id: 'partners-section', label: 'Témoignages Buralistes', icon: '💬', description: 'Citations de buralistes partenaires', type: 'Partners' },
    { id: 'partners-network', label: 'Réseau Partenaires', icon: '🤝', description: 'Logos des partenaires institutionnels', type: 'PartnersNetwork' },
    { id: 'quote-section', label: 'Citation Manifesto', icon: '🖊', description: 'Citation phare de l\'équipe fondatrice', type: 'Quote' },
];

export default function AccueilContentPage() {
    return (
        <div className={styles.container}>
            <Link href="/admin/content" className={styles.backLink}>← Retour aux pages</Link>
            <h1 className={styles.pageTitle}>🏠 Page d'Accueil</h1>
            <p className={styles.pageSubtitle}>Modifiez les sections de la page principale du site.</p>

            <div className={styles.grid}>
                {HOME_SECTIONS.map(section => (
                    <Link key={section.id} href={`/admin/content/${section.id}`} className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span className={styles.typeBadge}>{section.type}</span>
                            <span style={{ fontSize: '1.4rem' }}>{section.icon}</span>
                        </div>
                        <h2 className={styles.cardTitle}>{section.label}</h2>
                        <p style={{ fontSize: '0.85rem', color: '#777', margin: '0 0 1rem' }}>{section.description}</p>
                        <div className={styles.cardFooter}>
                            <span className={styles.editLink}>Modifier →</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
