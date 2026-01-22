import styles from './WhyChooseUs.module.css';

export default function WhyChooseUs({ title, features, ctaLabel }) {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <h2 className={styles.title}>{title}</h2>
                <div className={styles.list}>
                    {features.map((feature, index) => (
                        <div key={index} className={styles.item}>
                            <h3 className={styles.itemTitle}>{feature.title}</h3>
                            <p className={styles.itemDesc}>{feature.description}</p>
                        </div>
                    ))}
                </div>
                <button className={styles.cta}>{ctaLabel}</button>
            </div>
        </section>
    );
}
