import Link from 'next/link';
import { ChevronRight, MapPin, Phone, Mail, Facebook, Instagram, Linkedin, Send } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer({ columnLinks, contactInfo, newsletter, copyright }) {
    return (
        <footer className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    {/* Column 1: Newsletter */}
                    <div className={styles.column}>
                        <div className={styles.newsletterSection}>
                            <h3 className={styles.header}>Newsletter</h3>
                            <div className={styles.newsletterForm}>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="email"
                                        placeholder={newsletter.placeholder}
                                        className={styles.input}
                                    />
                                    <Mail size={18} className={styles.inputIcon} />
                                </div>
                                <p className={styles.disclaimer}>{newsletter.disclaimer}</p>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Suivez-nous */}
                    <div className={styles.column}>
                        <div className={styles.socialSection}>
                            <h3 className={styles.header}>Suivez-nous</h3>
                            <div className={styles.socialIcons}>
                                <a href="https://www.facebook.com/profile.php?id=100088639056960" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                    <Facebook size={24} strokeWidth={2.5} className={styles.socialIcon} />
                                </a>
                                <a href="https://www.instagram.com/lesamisducbd/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                    <Instagram size={24} strokeWidth={2.5} className={styles.socialIcon} />
                                </a>
                                <a href="https://www.linkedin.com/company/les-amis-du-cbd/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                                    <Linkedin size={24} strokeWidth={2.5} className={styles.socialIcon} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Column 3: Contactez nous */}
                    <div className={styles.column}>
                        <h3 className={styles.header}>Contactez nous</h3>
                        <div className={styles.contactList}>
                            <p className={styles.contactTitle}>{contactInfo.title}</p>
                            <div className={styles.contactItem}>
                                <MapPin size={18} className={styles.iconContact} />
                                <span>{contactInfo.address}</span>
                            </div>
                            <div className={styles.contactItem}>
                                <Phone size={18} className={styles.iconContact} />
                                <span>{contactInfo.phone}</span>
                            </div>
                            <div className={styles.contactItem}>
                                <Mail size={18} className={styles.iconContact} />
                                <span>{contactInfo.email}</span>
                            </div>
                        </div>
                    </div>

                    {/* Column 4: Informations */}
                    <div className={styles.column}>
                        <h3 className={styles.header}>Informations</h3>
                        <div className={styles.linkList}>
                            {columnLinks.map((link, i) => (
                                <Link key={i} href={link.href} className={styles.linkItem}>
                                    <ChevronRight size={16} className={styles.iconArrow} />
                                    <span>{link.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
