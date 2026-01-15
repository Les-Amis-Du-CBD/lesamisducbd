import Link from 'next/link';
import styles from './ProductList.module.css';

export default function ProductList({ title, description, linkLabel, linkHref, products }) {
    const titleParts = title.split(' pour ');
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        {titleParts[0]} <br /> pour {titleParts[1]}
                    </h2>
                    <div className={styles.centerHeader}>
                        <p className={styles.description}>{description}</p>
                    </div>
                    <div className={styles.rightHeader}>
                        <Link href={linkHref} className={styles.viewAll}>
                            {linkLabel}
                        </Link>
                    </div>
                </div>

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

                            <button className={styles.cta}>Découvrir cette variété</button>

                            <p className={styles.priceInfo}>{product.priceInfo}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
