import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer({ columns, copyright }) {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    {columns.map((col, index) => (
                        <div key={index} className={styles.column}>
                            <h3>{col.title}</h3>
                            {col.type === 'links' && (
                                <div className={styles.linkList}>
                                    {col.items.map((link, i) => (
                                        <Link key={i} href={link.href} className={styles.link}>
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                            {col.type === 'newsletter' && (
                                <div>
                                    <p className={styles.link} style={{ marginBottom: '10px' }}>{col.text}</p>
                                    <input type="email" placeholder="Votre email" className={styles.newsletterInput} />
                                    <button className={styles.newsletterBtn}>S'inscrire</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className={styles.bottom}>
                    <p>{copyright}</p>
                    <div className={styles.socials}>
                        <span>Instagram</span>
                        <span>Facebook</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
