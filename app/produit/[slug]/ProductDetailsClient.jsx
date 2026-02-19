
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import styles from './ProductDetails.module.css';
import { ArrowLeft, Star, Truck, ShieldCheck, Heart } from 'lucide-react';

const HEADER_PROPS = {
    logoText: "LES AMIS DU CBD",
    logoImage: "/images/logo.png",
    menuItems: [
        { label: "PRODUITS", href: "/produits" },
        { label: "L'ESSENTIEL", href: "/essentiel" },
        { label: "CBD & USAGES", href: "/usages" },
        { label: "BURALISTE", href: "/buraliste" }
    ]
};

const FOOTER_PROPS = {
    columnLinks: [
        { label: "Livraison", href: "/livraison" },
        { label: "CGV", href: "/cgv" },
        { label: "Politique de confidentialité", href: "/privacy" },
        { label: "Transparence", href: "/transparence" },
        { label: "Buraliste", href: "/buraliste" }
    ],
    contactInfo: {
        title: "Les Amis du CBD France",
        address: "25 rue principale 07120 Chauzon (FR)",
        phone: "06 71 82 42 87",
        email: "lesamisducbd@gmail.com"
    },
    newsletter: {
        placeholder: "Votre adresse e-mail",
        disclaimer: "Vous pouvez vous désinscrire à tout moment."
    },
    copyright: "©2024 - Les Amis du CBD"
};

export default function ProductDetailsClient({ product, relatedProducts }) {
    const { addItem } = useCart();
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        addItem({ ...product, price: product.price || 5 }, quantity);
    };

    return (
        <main className={styles.main}>
            <Header {...HEADER_PROPS} />

            <div className={styles.container}>
                <Link href="/produits" className={styles.backLink}>
                    <ArrowLeft size={20} /> Retour aux produits
                </Link>

                <div className={styles.productGrid}>
                    {/* Gallery Section */}
                    <div className={styles.gallery}>
                        <div className={styles.mainImageWrapper}>
                            <Image
                                src={product.image || '/images/placeholder.webp'}
                                alt={product.name}
                                fill
                                className={styles.mainImage}
                                priority
                            />
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className={styles.details}>
                        <div className={styles.headerInfo}>
                            {product.tag && <span className={styles.tag}>{product.tag}</span>}
                            <h1 className={styles.title}>{product.name}</h1>
                        </div>

                        <div className={styles.priceSection}>
                            <span className={styles.price}>{product.price || '5,00'} €</span>
                            <span className={styles.perGram}>{product.pricePerGram ? `${product.pricePerGram} €` : '2,50 €'} Par gramme</span>
                            <span className={styles.taxInfo}>TTC</span>
                        </div>

                        <div className={styles.actions}>
                            <div className={styles.quantityControl}>
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                                <span>{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)}>+</button>
                            </div>
                            <button className={styles.addToCartBtn} onClick={handleAddToCart}>
                                Ajouter au panier
                            </button>
                        </div>

                        <p className={styles.description}>
                            {product.description || "Une variété d'exception sélectionnée pour ses arômes intenses et ses effets relaxants. Cultivée en France dans le respect de l'environnement."}
                        </p>

                        <div className={styles.features}>
                            <div className={styles.feature}>
                                <div className={styles.iconBox}><Truck size={20} /></div>
                                <div>
                                    <strong>Livraison Rapide</strong>
                                    <p>Expédié sous 24h</p>
                                </div>
                            </div>
                            <div className={styles.feature}>
                                <div className={styles.iconBox}><ShieldCheck size={20} /></div>
                                <div>
                                    <strong>Paiement Sécurisé</strong>
                                    <p>CB, Visa, Mastercard</p>
                                </div>
                            </div>
                            <div className={styles.feature}>
                                <div className={styles.iconBox}><Heart size={20} /></div>
                                <div>
                                    <strong>Qualité Premium</strong>
                                    <p>100% Naturel, &lt;0.3% THC</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                <section className={styles.relatedSection}>
                    <h2>Vous aimerez aussi</h2>
                    <div className={styles.relatedGrid}>
                        {relatedProducts.map(p => (
                            <Link key={p.name} href={`/produit/${p.slug}`} className={styles.relatedCard}>
                                <div className={styles.relatedImageWrapper}>
                                    <Image src={p.image || '/images/placeholder.webp'} alt={p.name} fill className={styles.relatedImage} />
                                </div>
                                <div className={styles.relatedInfo}>
                                    <h3>{p.name}</h3>
                                    <span>{p.price || '5.00'}€</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>

            <Footer {...FOOTER_PROPS} />
        </main>
    );
}
