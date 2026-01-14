import styles from './BentoGrid.module.css';

export default function BentoGrid({ title, items, quote }) {
    return (
        <section className={styles.section}>
            {title && <h2 className={styles.title}>{title}</h2>}

            <div className={styles.grid}>
                {items.map((item, index) => (
                    <div key={index} className={styles.card}>
                        <img src={item.image} alt={item.alt || "Bento image"} className={styles.image} />
                        {/* 
                           If images are just backgrounds and text is needed:
                           {item.title && <div className={styles.overlay}><h3 className={styles.cardTitle}>{item.title}</h3></div>}
                        */}
                    </div>
                ))}
            </div>

            {quote && (
                <div className={styles.quoteSection}>
                    <p className={styles.quote}>"{quote.text}"</p>
                    <span className={styles.author}>{quote.author}</span>
                </div>
            )}
        </section>
    );
}
