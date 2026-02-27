'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { calculateGroupPrice } from '@/lib/utils/groupPricing';
import styles from './ProductList.module.css';

export default function ProductList({ title, description, linkLabel, linkHref, products }) {
    const titleParts = title.split(' pour ');
    const { data: session } = useSession();
    const groupId = session?.user?.id_default_group || 3;

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                {/* Header: Title & Description (Outside Gradient) */}
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        {titleParts[0]} <br /> pour {titleParts[1]}
                    </h2>
                    <div className={styles.descriptionWrapper}>
                        <p className={styles.description} dangerouslySetInnerHTML={{ __html: description }}></p>
                    </div>
                </div>

                {/* Product Grid Container (Green Gradient + Rounded) */}
                <div className={styles.productsContainer}>
                    <div className={styles.grid}>
                        {products.map((product, index) => {
                            // If `rawProduct` was passed down from page.js, calculate group price. Otherwise fallback.
                            const groupPrice = product.rawProduct ? calculateGroupPrice(product.rawProduct, groupId) : null;
                            const displayPrice = groupPrice?.hasDiscount ? groupPrice.formattedPrice : product.formattedPrice;

                            // Show original strike-through if discounted
                            const originalPriceHTML = groupPrice?.hasDiscount
                                ? `<span style="text-decoration: line-through; color: #999; font-size: 0.8em; margin-right: 6px;">${product.formattedPrice}</span><span style="color: #d9534f; font-weight: bold;">${displayPrice}</span>`
                                : displayPrice;

                            // Calculate weight and per-gram price
                            const searchString = `${product.name || ''} ${product.rawProduct?.reference || ''}`.toLowerCase();
                            const weightMatch = searchString.match(/(?:^|\s|-)(\d+(?:[.,]\d+)?)\s*g\b/);
                            let exactGrams = null;
                            let perGramText = null;

                            if (weightMatch) {
                                exactGrams = parseFloat(weightMatch[1].replace(',', '.'));
                                const currentPriceTTC = groupPrice?.priceTTC || product.rawProduct?.priceTTC || product.price;
                                if (exactGrams > 0 && currentPriceTTC > 0) {
                                    const newPerGram = (currentPriceTTC / exactGrams).toFixed(2).replace('.', ',');
                                    perGramText = `${newPerGram}€/g`;
                                }
                            }

                            return (
                                <div key={index} className={styles.card}>
                                    {product.tag && (
                                        <span
                                            className={styles.badge}
                                            style={product.badgeColor ? { backgroundColor: product.badgeColor } : {}}
                                        >
                                            {product.tag}
                                        </span>
                                    )}

                                    <div className={styles.topInfo}>
                                        <div className={styles.subtitlePill}>{product.name}</div>
                                        <h3 className={styles.quoteTitle}>{product.quoteTitle}</h3>
                                    </div>

                                    <div className={styles.imageContainer}>
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            width={400}
                                            height={400}
                                            priority={index < 4}
                                            unoptimized
                                            className={styles.productImage}
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                        />
                                    </div>

                                    <div className={styles.pillsContainer}>
                                        <span className={styles.pillLeft} dangerouslySetInnerHTML={{ __html: originalPriceHTML }}></span>
                                        {exactGrams && (
                                            <span className={styles.pillRight}>{exactGrams}G</span>
                                        )}
                                    </div>

                                    <Link href={`/produit/${product.slug}`} className={styles.ctaLink}>
                                        <button className={styles.cta}>Découvrir cette variété</button>
                                    </Link>

                                    {perGramText && (
                                        <div className={styles.perGramList}>Le gramme à partir de {perGramText}</div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer: View All Link */}
                <div className={styles.footer}>
                    <Link href={linkHref} className={styles.viewAll}>
                        {linkLabel} <ArrowRight size={16} className={styles.arrowIcon} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
