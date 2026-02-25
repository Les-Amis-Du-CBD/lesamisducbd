'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import RecruitmentModal from '@/components/RecruitmentModal/RecruitmentModal';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import ContentHero from '@/components/ContentHero/ContentHero';

export default function RecruitmentClient({ globalContent }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const headerProps = {
        logoText: "LES AMIS DU CBD",
        logoImage: "/images/logo.webp",
        menuItems: [
            { label: "PRODUITS", href: "/produits" },
            { label: "L'ESSENTIEL", href: "/essentiel" },
            { label: "CBD & USAGES", href: "/usages" },
            { label: "BURALISTE", href: "/buraliste" }
        ]
    };

    const footerProps = {
        columnLinks: globalContent?.footerLinks || [
            { label: "Livraison", href: "/livraison" },
            { label: "CGV", href: "/cgv" },
            { label: "Politique de confidentialité", href: "/privacy" },
            { label: "Transparence", href: "/transparence" },
            { label: "Buraliste", href: "/buraliste" }
        ],
        contactInfo: globalContent?.contact || {
            title: "Les Amis du CBD France",
            address: "25 rue principale 07120 Chauzon (FR)",
            phone: "06 71 82 42 87",
            email: "lesamisducbd@gmail.com"
        },
        newsletter: {
            placeholder: "Votre adresse e-mail",
            disclaimer: "Vous pouvez vous désinscrire à tout moment."
        },
        copyright: "©2024 - Les Amis du CBD"
    };

    return (
        <div className={styles.pageWrapper}>
            <Header {...headerProps} />

            <main>
                {/* HERO */}
                <ContentHero
                    imageSrc="/images/recrutement/handshake.webp"
                    imageAlt="Rejoindre l'équipe"
                >
                    <h1 className={styles.pageTitle}>Intégrer l'équipe ?</h1>
                </ContentHero>

                {/* TEXT CONTENT */}
                <ScrollReveal animation="fade-up">
                    <section className={styles.contentSection}>
                        <h2 className={styles.mainTitle}>Rejoindre l'équipe<br />Les Amis du CBD</h2>
                        <p className={styles.textBlock}>Les Amis du CBD, c'est avant tout une aventure humaine.</p>

                        <p className={styles.textBlock}>
                            Une équipe qui avance ensemble, avec des valeurs simples : transparence, exigence et proximité.
                        </p>

                        <p className={styles.textBlock}>
                            Nous ne recrutons pas en permanence, mais nous sommes toujours curieux de découvrir de nouveaux profils. Que vous veniez du terrain, du commerce, de la communication ou d'un tout autre horizon, les candidatures spontanées sont les bienvenues.
                        </p>

                        <p className={styles.textBlock}>
                            Si vous partagez notre vision d'un CBD accessible, responsable et bien fait, n'hésitez pas à nous écrire.
                        </p>

                        <p className={styles.textBlock}>
                            Parfois, les meilleures collaborations commencent sans offre précise.
                        </p>
                    </section>
                </ScrollReveal>

                {/* CONTACT CARD */}
                <ScrollReveal animation="fade-up" delay={200}>
                    <section className={styles.contactCardSection}>
                        <div className={styles.contactCard}>
                            <h3 className={styles.cardTitle}>Envie d'en<br />savoir plus ?</h3>
                            <p className={styles.cardText}>
                                Un CV, une lettre de motivation ou simplement l'envie d'échanger ?
                                <br /><br />
                                Contactez-nous, on vous répond avec plaisir.
                            </p>
                            <button onClick={() => setIsModalOpen(true)} className={styles.contactButton}>
                                Contactez-nous !
                            </button>
                        </div>
                    </section>
                </ScrollReveal>

                {isModalOpen && <RecruitmentModal onClose={() => setIsModalOpen(false)} />}
            </main>

            <Footer {...footerProps} />
        </div>
    );
}
