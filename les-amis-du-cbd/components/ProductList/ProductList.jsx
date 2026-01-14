import Link from 'next/link';
import styles from './ProductList.module.css';

export default function ProductList({ title, linkLabel, linkHref, products }) {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>{title}</h2>
                    <Link href={linkHref} className={styles.viewAll}>
                        {linkLabel}
                    </Link>
                </div>

                <div className={styles.grid}>
                    {products.map((product, index) => (
                        <div key={index} className={styles.card}>
                            {product.tag && <span className={styles.badge}>{product.tag}</span>}
                            <div className={styles.imageContainer}>
                                {/* Replace with Next/Image usually, but using img for simplicity with external URLs or placeholders */}
                                <img src={product.image} alt={product.name} className={styles.productImage} />
                            </div>
                            <h3 className={styles.productName}>{product.name}</h3>
                            <div className={styles.rating}>
                                <span>★★★★★</span>
                                <span>{product.reviews} avis</span>
                            </div>
                            <button className={styles.cta}>Découvrir le produit</button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
