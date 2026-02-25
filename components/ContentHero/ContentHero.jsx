import React from 'react';
import Image from 'next/image';
import styles from './ContentHero.module.css';

export default function ContentHero({ imageSrc, imageAlt, imagePosition = 'center', children }) {
    return (
        <section className={styles.heroSection}>
            <div className={styles.heroContainer}>
                {children && <div className={styles.heroContent}>{children}</div>}
                <div className={styles.heroImageWrapper}>
                    <Image
                        src={imageSrc}
                        alt={imageAlt || "Hero background"}
                        className={styles.heroImage}
                        fill
                        priority
                        sizes="100vw"
                        style={{ objectPosition: imagePosition }}
                    />
                </div>
            </div>
        </section>
    );
}
