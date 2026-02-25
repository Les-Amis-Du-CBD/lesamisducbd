import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import styles from './ProductList.module.css';

export default function ProductList({ title, description, linkLabel, linkHref, products }) {
    const titleParts = title.split(' pour ');
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
                        {products.map((product, index) => (
                            <div key={index} className={styles.card}>
                                {product.tag && <span className={styles.badge}>{product.tag}</span>}

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
                                    <span className={styles.pillLeft}>{product.pillLeft || '4G 10€'}</span>
                                    <span className={styles.pillRight}>{product.pillRight || '10G 20€'}</span>
                                </div>

                                <Link href={`/produit/${product.slug}`} className={styles.ctaLink}>
                                    <button className={styles.cta}>Découvrir cette variété</button>
                                </Link>
                            </div>
                        ))}
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
