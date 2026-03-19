import styles from './Partners.module.css';
import CountUp from '../CountUp/CountUp';

export default function Partners({ title, subtitle, partners }) {
    // Custom logic to handle dynamic numeric titles for animation (e.g., "+ de 100")
    const renderTitle = () => {
        if (!title) return null;

        const match = title.match(/(\d+)/);

        if (match) {
            const numStr = match[1];
            const num = parseInt(numStr, 10);

            if (num > 0) {
                const parts = title.split(numStr);
                return (
                    <>
                        <span dangerouslySetInnerHTML={{ __html: parts[0] }} />
                        <CountUp end={num} duration={2500} />
                        <span dangerouslySetInnerHTML={{ __html: parts[1] }} />
                    </>
                );
            }
        }
        return <span dangerouslySetInnerHTML={{ __html: title }} />;
    };

    return (
        <section className={styles.section}>
            <div className={styles.outerContainer}>
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        {renderTitle()}
                    </h2>
                    <p className={styles.subtitle} dangerouslySetInnerHTML={{ __html: subtitle }}></p>
                </div>
                <div className={styles.grid}>
                    {partners.map((partner, index) => (
                        <div key={index} className={styles.card}>
                            {partner.imageLogo ? (
                                <img src={partner.imageLogo} alt={`Logo ${partner.name}`} className={styles.avatarPlaceholder} style={{ objectFit: 'contain', background: '#fff', border: '1px solid #eaeaea' }} />
                            ) : (
                                <div className={styles.avatarPlaceholder}></div>
                            )}
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
