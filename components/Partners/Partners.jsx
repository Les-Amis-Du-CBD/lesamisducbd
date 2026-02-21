import styles from './Partners.module.css';
import CountUp from '../CountUp/CountUp';

export default function Partners({ title, subtitle, partners }) {
    // Custom logic to handle the specific "+ de 100" title for animation
    // If title contains "100", we split it to animate the number.
    const renderTitle = () => {
        if (title && title.includes('300')) {
            const parts = title.split('300');
            return (
                <>
                    {parts[0]}
                    <CountUp end={300} duration={2500} />
                    {parts[1]}
                </>
            );
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
