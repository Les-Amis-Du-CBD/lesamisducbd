import Link from 'next/link';
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
                                    <div className={styles.subtitlePill}>{product.subtitle}</div>
                                    <h3 className={styles.quoteTitle}>{product.quoteTitle}</h3>
                                </div>

                                <div className={styles.imageContainer}>
                                    <img src={product.image} alt={product.name} className={styles.productImage} />
                                </div>

                                <div className={styles.pillsContainer}>
                                    {product.pillLeft && <span className={styles.pillLeft}>{product.pillLeft}</span>}
                                    {product.pillRight && <span className={styles.pillRight}>{product.pillRight}</span>}
                                </div>

                                <button className={styles.cta}>Découvrir cette variété</button>

                                <p className={styles.priceInfo}>{product.priceInfo}</p>
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
