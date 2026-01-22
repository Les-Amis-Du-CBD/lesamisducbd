import styles from './Partners.module.css';

export default function Partners({ title, subtitle, partners }) {
    return (
        <section className={styles.section}>
            <div className={styles.outerContainer}>
                <div className={styles.header}>
                    <h2 className={styles.title} dangerouslySetInnerHTML={{ __html: title }}></h2>
                    <p className={styles.subtitle} dangerouslySetInnerHTML={{ __html: subtitle }}></p>
                </div>
                <div className={styles.grid}>
                    {partners.map((partner, index) => (
                        <div key={index} className={styles.card}>
                            <div className={styles.avatarPlaceholder}></div>
                            <h3 className={styles.partnerName}>{partner.name}</h3>
                            <p className={styles.partnerRole}>{partner.role}</p>
                            <p className={styles.partnerQuote} dangerouslySetInnerHTML={{ __html: `"${partner.quote}"` }}></p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
