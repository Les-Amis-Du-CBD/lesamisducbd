import styles from './Hero.module.css';

export default function Hero({ backgroundImage, title, description, ctaLabel }) {
    return (
        <section className={styles.heroWrapper} style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className={styles.glassCard}>
                <h1 className={styles.title} dangerouslySetInnerHTML={{ __html: title }}></h1>
                <p className={styles.description} dangerouslySetInnerHTML={{ __html: description }}></p>
                <button className={styles.cta}>{ctaLabel}</button>
            </div>
        </section>
    );
}
