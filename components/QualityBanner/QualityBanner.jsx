import styles from './QualityBanner.module.css';

export default function QualityBanner({ title, subtitle }) {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <h3 className={styles.title}>{title}</h3>
                <h2 className={styles.subtitle}>{subtitle}</h2>
            </div>
        </section>
    );
}
