import Link from 'next/link';
import Image from 'next/image';
import styles from './Hero.module.css';

export default function Hero({ backgroundImage, title, description, ctaLabel, ctaLink }) {
    return (
        <section className={styles.heroWrapper}>
            <Image
                src={backgroundImage}
                alt={title || "Hero Image"}
                fill
                priority
                quality={90}
                className={styles.heroImage}
                sizes="(max-width: 768px) 100vw, 100vw"
            />
            <div className={styles.glassCard}>
                <h1 className={styles.title} dangerouslySetInnerHTML={{ __html: title }}></h1>
                <p className={styles.description} dangerouslySetInnerHTML={{ __html: description }}></p>
                <Link href={ctaLink || '/produits'} className={styles.ctaLink}>
                    <button className={styles.cta}>{ctaLabel}</button>
                </Link>
            </div>
        </section>
    );
}
