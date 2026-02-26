'use client';

import Link from 'next/link';
import styles from './ContentDashboard.module.css';

const PAGES = [
    {
        id: 'accueil',
        label: 'Page d\'Accueil',
        icon: '🏠',
        description: 'Bandeau, Héro, Arguments, FAQ, Témoignages, Logos, Citation',
        count: 7,
        href: '/admin/content/accueil'
    },
    {
        id: 'essentiel',
        label: 'L\'Essentiel',
        icon: '🌿',
        description: 'Intro, Carrousels Légalité & Culture, Points clés, Citation',
        count: 5,
        href: '/admin/content/essentiel'
    },
    {
        id: 'buraliste',
        label: 'Buraliste',
        icon: '🏪',
        description: 'Hero, Arguments partenariat, Étapes pour devenir partenaire',
        count: 4,
        href: '/admin/content/buraliste'
    },
    {
        id: 'usages',
        label: 'CBD & Usages',
        icon: '💨',
        description: 'Hero, Guides d\'usage, Citation',
        count: 3,
        href: '/admin/content/usages'
    },
    {
        id: 'transparence',
        label: 'Transparence',
        icon: '🔬',
        description: 'Héro, Manifesto, Arguments de qualité, Analyses labo',
        count: 4,
        href: '/admin/content/transparence'
    },
    {
        id: 'recrutement',
        label: 'Recrutement',
        icon: '💼',
        description: 'Texte d\'introduction, Offres d\'emploi, Contact',
        count: 3,
        href: '/admin/content/recrutement'
    },
    {
        id: 'global',
        label: 'Éléments Globaux',
        icon: '🌍',
        description: 'Informations de contact, Liens du footer (toutes pages)',
        count: 2,
        href: '/admin/content/global'
    },
    {
        id: 'cgv',
        label: 'CGV',
        icon: '📄',
        description: 'Conditions Générales de Vente (Texte de loi complet)',
        count: 'Texte',
        href: '/admin/content/legal/cgv'
    },
    {
        id: 'livraison',
        label: 'Livraison',
        icon: '🚚',
        description: 'Délais, Tarifs et Méthodes d\'expédition',
        count: 'Texte',
        href: '/admin/content/legal/livraison'
    },
    {
        id: 'privacy',
        label: 'Confidentialité',
        icon: '🔒',
        description: 'Politique de confidentialité et RGPD',
        count: 'Texte',
        href: '/admin/content/legal/privacy'
    }
];

export default function ContentDashboard() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Gestion du Contenu</h1>
                <p className={styles.subtitle}>Modifiez le contenu de chaque page du site en temps réel, sans aucun déploiement.</p>
            </div>

            <div className={styles.pagesGrid}>
                {PAGES.map(page => (
                    <Link key={page.id} href={page.href} className={styles.pageCard}>
                        <div className={styles.pageCardIcon}>{page.icon}</div>
                        <div className={styles.pageCardContent}>
                            <h2 className={styles.pageCardTitle}>{page.label}</h2>
                            <p className={styles.pageCardDesc}>{page.description}</p>
                        </div>
                        <div className={styles.pageCardFooter}>
                            <span className={styles.sectionCount}>{page.count} section{page.count > 1 ? 's' : ''}</span>
                            <span className={styles.editArrow}>Modifier →</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
