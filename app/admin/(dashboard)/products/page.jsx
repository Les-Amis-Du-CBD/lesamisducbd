
'use client';

import { useState, useEffect } from 'react';
import styles from './Products.module.css';

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        subtitle: '',
        quoteTitle: '',
        price: '',
        pricePerGram: '',
        description: '',
        tag: '',
        image: null
    });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setProducts(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Frontend fetchProducts error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, image: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        try {
            let imageUrl = '';

            // Upload Image first
            if (formData.image) {
                const uploadData = new FormData();
                uploadData.append('file', formData.image);

                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: uploadData
                });

                if (!uploadRes.ok) throw new Error('Upload failed');

                const uploadResult = await uploadRes.json();
                imageUrl = uploadResult.url;
            }

            // Create Product
            const newProduct = {
                name: formData.name,
                slug: formData.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
                subtitle: formData.subtitle.toUpperCase(),
                quoteTitle: `“${formData.quoteTitle}”`,
                image: imageUrl || '/images/products/placeholder.webp',
                price: formData.price,
                pricePerGram: formData.pricePerGram,
                description: formData.description,
                tag: formData.tag,
                pillLeft: '4G 10€',
                pillRight: '10G 20€',
                // Legacy fields for card view compatibility if needed, or derived
                priceInfo: `À partir de ${formData.pricePerGram || '2€'} le gramme`
            };

            const productRes = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct)
            });

            if (productRes.ok) {
                fetchProducts();
                setIsModalOpen(false);
                setFormData({
                    name: '', subtitle: '', quoteTitle: '',
                    price: '', pricePerGram: '', description: '',
                    tag: '', image: null
                });
            }

        } catch (error) {
            console.error(error);
            alert('Erreur lors de la création');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (name) => {
        if (!confirm('Voulez-vous vraiment supprimer ce produit ?')) return;

        const res = await fetch(`/api/products?name=${encodeURIComponent(name)}`, {
            method: 'DELETE'
        });

        if (res.ok) {
            fetchProducts();
        }
    };

    if (loading) return <div>Chargement...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Gestion des Produits</h1>
                <button onClick={() => setIsModalOpen(true)} className={styles.addButton}>
                    + Ajouter un produit
                </button>
            </div>

            <div className={styles.grid}>
                {products.length === 0 ? (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#666' }}>
                        <p>Aucun produit trouvé.</p>
                        <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Vérifiez la console du serveur pour le debug.</p>
                    </div>
                ) : (
                    products.map((product, index) => (
                        <div key={index} className={styles.card}>
                            <div className={styles.imageWrapper}>
                                <img src={product.image} alt={product.name} className={styles.image} />
                                {product.tag && <span className={styles.tag}>{product.tag}</span>}
                            </div>
                            <div className={styles.content}>
                                <h3>{product.name}</h3>
                                {/* Subtitle removed */}
                                <p className={styles.price}>{product.price}€ ({product.pricePerGram}€/g)</p>
                                <button
                                    onClick={() => handleDelete(product.name)}
                                    className={styles.deleteButton}
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h2>Nouveau Produit</h2>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label>Nom (ex: Gorilla Glue)</label>
                                <input name="name" value={formData.name} onChange={handleInputChange} required />
                            </div>

                            {/* Subtitle input removed */}

                            <div className={styles.formGroup}>
                                <label>Citation (ex: La Puissante)</label>
                                <input name="quoteTitle" value={formData.quoteTitle} onChange={handleInputChange} required />
                            </div>

                            <div className={styles.row}>
                                <div className={styles.formGroup}>
                                    <label>Prix Total (ex: 5.00)</label>
                                    <input name="price" value={formData.price} onChange={handleInputChange} placeholder="5.00" />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Prix au gramme (ex: 2.50)</label>
                                    <input name="pricePerGram" value={formData.pricePerGram} onChange={handleInputChange} placeholder="2.50" />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Tag (Optionnel, ex: Bestseller)</label>
                                <input name="tag" value={formData.tag} onChange={handleInputChange} />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Image</label>
                                <input type="file" onChange={handleFileChange} required accept="image/*" />
                            </div>

                            <div className={styles.actions}>
                                <button type="button" onClick={() => setIsModalOpen(false)} className={styles.cancelButton}>Annuler</button>
                                <button type="submit" disabled={uploading} className={styles.submitButton}>
                                    {uploading ? 'Enregistrement...' : 'Créer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
