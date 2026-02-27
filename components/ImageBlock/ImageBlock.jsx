import styles from './ImageBlock.module.css';

export default function ImageBlock({ src, alt, caption }) {
    if (!src) return null;
    return (
        <section className={styles.section}>
            <div className={styles.wrapper}>
                <img src={src} alt={alt || ''} className={styles.image} />
                {caption && <p className={styles.caption}>{caption}</p>}
            </div>
        </section>
    );
}
