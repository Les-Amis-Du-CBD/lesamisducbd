import styles from './RichText.module.css';

export default function RichText({ content, title, centered = false }) {
    if (!content) return null;

    return (
        <section className={`${styles.section} ${centered ? styles.centered : ''}`}>
            <div className="container">
                {title && <h2 className={styles.title}>{title}</h2>}
                <div
                    className={styles.content}
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </div>
        </section>
    );
}
