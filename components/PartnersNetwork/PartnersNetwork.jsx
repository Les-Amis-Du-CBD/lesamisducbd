import styles from './PartnersNetwork.module.css';

export default function PartnersNetwork({ title, partners }) {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <h2 className={styles.title} dangerouslySetInnerHTML={{ __html: title }}></h2>
                <div className={styles.pillContainer}>
                    {partners.map((partner, index) => (
                        <div key={index} className={styles.card}>
                            <img
                                src={partner.image}
                                alt={partner.name || "Partenaire"}
                                className={styles.logo}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
