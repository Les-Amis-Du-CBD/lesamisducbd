'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Builder.module.css';

export default function BuilderIndex() {
    const [pages, setPages] = useState({});
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newPage, setNewPage] = useState({ title: '', slug: '' });

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        try {
            const res = await fetch('/api/admin/builder');
            const data = await res.json();
            setPages(data);
        } catch (error) {
            console.error('Error fetching pages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/builder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newPage, sections: [] })
            });
            if (res.ok) {
                const { page } = await res.json();
                window.location.href = `/admin/builder/${page.slug}`;
            }
        } catch (error) {
            console.error('Error creating page:', error);
        }
    };

    const handleDelete = async (slug) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette page ?')) return;
        try {
            const res = await fetch(`/api/admin/builder?slug=${slug}`, { method: 'DELETE' });
            if (res.ok) {
                fetchPages();
            }
        } catch (error) {
            console.error('Error deleting page:', error);
        }
    };

    if (loading) return <div className={styles.container}>Chargement...</div>;

    const pageList = Object.values(pages);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Page Builder</h1>
                <button
                    className={styles.createBtn}
                    onClick={() => setIsCreating(true)}
                >
                    <span>+</span> Créer une page
                </button>
            </div>

            {isCreating && (
                <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', marginBottom: '24px', border: '1px solid #00FF94' }}>
                    <h2 style={{ margin: '0 0 16px', fontSize: '1.2rem' }}>Nouvelle Page</h2>
                    <form onSubmit={handleCreate} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <input
                            type="text"
                            placeholder="Titre de la page"
                            value={newPage.title}
                            onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
                            style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                            required
                        />
                        <input
                            type="text"
                            placeholder="slug (ex: ma-page)"
                            value={newPage.slug}
                            onChange={(e) => setNewPage({ ...newPage, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                            style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                            required
                        />
                        <button type="submit" className={styles.createBtn}>Valider</button>
                        <button type="button" onClick={() => setIsCreating(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>Annuler</button>
                    </form>
                </div>
            )}

            <div className={styles.grid}>
                {pageList.length === 0 ? (
                    <div className={styles.empty}>
                        <p>Aucune page personnalisée pour le moment.</p>
                    </div>
                ) : (
                    pageList.map(page => (
                        <div key={page.slug} className={styles.pageCard}>
                            <h2 className={styles.pageTitle}>{page.title}</h2>
                            <span className={styles.pageSlug}>/p/{page.slug}</span>
                            <div className={styles.pageMeta}>
                                {page.sections?.length || 0} section{page.sections?.length !== 1 ? 's' : ''}
                                <br />
                                Mise à jour le {new Date(page.updatedAt).toLocaleDateString('fr-FR')}
                            </div>
                            <div className={styles.actions}>
                                <Link href={`/admin/builder/${page.slug}`} className={styles.editLink}>
                                    Modifier
                                </Link>
                                <button
                                    className={styles.deleteBtn}
                                    onClick={() => handleDelete(page.slug)}
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
