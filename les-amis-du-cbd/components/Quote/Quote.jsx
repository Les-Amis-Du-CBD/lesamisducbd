import styles from './Quote.module.css';

export default function Quote({ text, author }) {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <blockquote className={styles.quote} dangerouslySetInnerHTML={{ __html: text }}>
                </blockquote>
                <cite className={styles.author}>{author}</cite>
            </div>
        </section>
    );
}
