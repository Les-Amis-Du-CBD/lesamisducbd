'use client';

import Link from 'next/link';
import styles from '../ContentDashboard.module.css';

export default function UsagesContentPage() {
    return (
        <div className={styles.container}>
            <Link href="/admin/content" className={styles.backLink}>← Retour aux pages</Link>
            <h1 className={styles.pageTitle}>💨 CBD & Usages</h1>
            <p className={styles.pageSubtitle}>Page en cours de mise en place pour l'éditeur de contenu.</p>
            <div style={{ background: '#f4faf4', border: '1px solid #b8d8b8', borderRadius: 14, padding: '2rem', marginTop: '1rem', color: '#2d6a2d' }}>
                <p style={{ fontWeight: 700, marginBottom: '0.5rem' }}>🚧 Éditeur à venir</p>
                <p style={{ fontSize: '0.9rem', margin: 0 }}>
                    Le contenu de cette page est actuellement géré directement dans le code.
                    L'éditeur visuel sera disponible dans une prochaine mise à jour.
                </p>
            </div>
        </div>
    );
}
