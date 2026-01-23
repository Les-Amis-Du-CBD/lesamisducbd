import styles from './JoinUs.module.css';
import Link from 'next/link';

export default function JoinUs({ title, buttonLabel, buttonLink, text }) {
    return (
        <section className={styles.wrapper}>
            <div className={styles.container}>
                <h2 className={styles.title}>{title}</h2>
                <Link href={buttonLink || "/recrutement"} className={styles.button}>
                    {buttonLabel}
                </Link>
                <p className={styles.text}>{text}</p>
            </div>
        </section>
    );
}
