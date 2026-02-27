
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import styles from './ProductDetails.module.css';
import { ArrowLeft, Star, Truck, ShieldCheck, Heart } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { calculateGroupPrice } from '@/lib/utils/groupPricing';

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

export default function ProductDetailsClient({ product, relatedProducts, globalContent }) {
    const { addItem } = useCart();
    const [quantity, setQuantity] = useState(1);

    const { data: session } = useSession();
    const groupId = session?.user?.id_default_group || 3;
    const groupPrice = calculateGroupPrice(product, groupId);

    const footerProps = {
        ...FOOTER_PROPS,
        newsletter: { ...FOOTER_PROPS.newsletter, isVisible: globalContent?.visibility?.newsletter !== false },
        columnLinks: globalContent?.footerLinks || FOOTER_PROPS.columnLinks,
        contactInfo: globalContent?.contact || FOOTER_PROPS.contactInfo
    };

    const handleAddToCart = () => {
        addItem({ ...product, price: groupPrice?.priceTTC || product.priceTTC || product.price || 5 }, quantity);
    };

    return (
        <main className={styles.main}>
            <Header {...HEADER_PROPS} bannerVisible={globalContent?.visibility?.headerBanner !== false} />

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
                            <span className={styles.price}>
                                {groupPrice?.hasDiscount ? (
                                    <>
                                        <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.8em', marginRight: '8px' }}>
                                            {product.formattedPrice}
                                        </span>
                                        <span style={{ color: '#d9534f' }}>
                                            {groupPrice.formattedPrice}
                                        </span>
                                    </>
                                ) : (
                                    product.formattedPrice || `${product.priceHT || product.priceTTC || 5} €`
                                )}
                            </span>
                            {(() => {
                                let perGramText = null;
                                const currentPriceTTC = groupPrice?.priceTTC || product.priceTTC || 0;

                                if (currentPriceTTC > 0) {
                                    // Recherche des grammes dans le nom ou la référence (ex: "10g", "10 g", "2.5G", "100 G")
                                    const searchString = `${product.name || ''} ${product.reference || ''}`.toLowerCase();
                                    // Capture un nombre (avec virgule ou point optionnel) suivi de "g" ou " g"
                                    const weightMatch = searchString.match(/(?:^|\s|-)(\d+(?:[.,]\d+)?)\s*g\b/);

                                    if (weightMatch) {
                                        const exactGrams = parseFloat(weightMatch[1].replace(',', '.'));
                                        if (exactGrams > 0) {
                                            const newPerGram = (currentPriceTTC / exactGrams).toFixed(2).replace('.', ',');
                                            perGramText = `Le gramme à partir de ${newPerGram}€ TTC`;
                                        }
                                    }
                                }

                                if (!perGramText) return null;
                                return <span className={styles.taxInfo}>{perGramText}</span>;
                            })()}
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

                        <div
                            className={styles.description}
                            dangerouslySetInnerHTML={{ __html: product.description || product.descriptionShort || "<p>Une variété d'exception sélectionnée pour ses arômes intenses et ses effets relaxants. Cultivée en France dans le respect de l'environnement.</p>" }}
                        />

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
                        {relatedProducts.map(p => {
                            const relatedGroupPrice = calculateGroupPrice(p, groupId);

                            // Extract weight and per gram price
                            const searchString = `${p.name || ''} ${p.reference || ''}`.toLowerCase();
                            const weightMatch = searchString.match(/(?:^|\s|-)(\d+(?:[.,]\d+)?)\s*g\b/);
                            let exactGrams = null;
                            let perGramText = null;

                            const currentPriceTTC = relatedGroupPrice?.priceTTC || p.priceTTC || 0;

                            if (weightMatch) {
                                exactGrams = parseFloat(weightMatch[1].replace(',', '.'));
                                if (exactGrams > 0 && currentPriceTTC > 0) {
                                    const newPerGram = (currentPriceTTC / exactGrams).toFixed(2).replace('.', ',');
                                    perGramText = `${newPerGram}€/g TTC`;
                                }
                            }

                            return (
                                <Link key={p.name} href={`/produit/${p.slug}`} className={styles.relatedCard}>
                                    <div className={styles.relatedImageWrapper}>
                                        <Image src={p.image || '/images/placeholder.webp'} alt={p.name} fill className={styles.relatedImage} />
                                    </div>
                                    <div className={styles.relatedInfo}>
                                        <h3>{p.name}</h3>
                                        <span>
                                            {relatedGroupPrice?.hasDiscount ? (
                                                <>
                                                    <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.8em', marginRight: '6px' }}>
                                                        {p.formattedPrice}
                                                    </span>
                                                    <span style={{ color: '#d9534f' }}>
                                                        {relatedGroupPrice.formattedPrice}
                                                    </span>
                                                </>
                                            ) : (
                                                p.formattedPrice || `${p.priceHT || p.priceTTC || 5} €`
                                            )}
                                        </span>
                                        {perGramText && (
                                            <div className={styles.relatedPerGram}>{perGramText}</div>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            </div>

            <Footer {...footerProps} />
        </main>
    );
}
