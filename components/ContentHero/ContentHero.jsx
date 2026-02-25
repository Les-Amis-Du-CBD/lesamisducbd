import React from 'react';
import styles from './ContentHero.module.css';

export default function ContentHero({ imageSrc, imageAlt, imagePosition = 'center', children }) {
    return (
        <section className={styles.heroSection}>
            <div className={styles.heroContainer}>
                {children && <div className={styles.heroContent}>{children}</div>}
                <div className={styles.heroImageWrapper}>
                    <img
                        src={imageSrc}
                        alt={imageAlt || "Hero background"}
                        className={styles.heroImage}
                        style={{ objectPosition: imagePosition }}
                    />
                </div>
            </div>
        </section>
    );
}
