'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

// Importing existing components
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import WhyChooseUs from '@/components/WhyChooseUs/WhyChooseUs';
import OfferComparator from '@/components/OfferComparator/OfferComparator';

// Icons
import { ArrowRight, CheckCircle, TrendingUp, Truck } from 'lucide-react';

export default function BuralistePage() {

    // --- Data Mocks (from home.json) ---
    const headerProps = {
        logoText: "LES AMIS DU CBD",
        logoImage: "/images/logo.png",
        menuItems: [
            { label: "PRODUITS", href: "/produits" },
            { label: "L'ESSENTIEL", href: "/essentiel" },
            { label: "CBD & USAGES", href: "/usages" },
            { label: "BURALISTE", href: "/buraliste" }
        ]
    };

    const footerProps = {
        columnLinks: [
            { label: "Livraison", href: "/livraison" },
            { label: "CGV", href: "/cgv" },
            { label: "Politique de confidentialité", href: "/privacy" },
            { label: "Transparence", href: "/transparence" },
            { label: "Buraliste", href: "/buraliste" }
        ],
        contactInfo: {
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

    const whyChooseUsFeatures1 = [
        { title: "Sérénité & Conformité", description: "Pas de stress. Produits 100% légaux, analyses labo fournies." },
        { title: "Marges Garanties", description: "Achetez mieux, vendez mieux. Nos prix sont étudiés pour vous." }
    ];

    const whyChooseUsFeatures2 = [
        { title: "Produits Premium", description: "Fleurs naturelles, sans ajout, cultivées avec soin." },
        { title: "Accompagnement Sur-Mesure", description: "PLV offerte, formation et conseils pour booster vos ventes." }
    ];

    return (
        <div className={styles.pageWrapper}>
            {/* HEADER */}
            <Header {...headerProps} />

            <main>
                {/* HERO SECTION */}
                <section className={styles.heroSection}>
                    <div className={styles.heroContainer}>
                        <div className={styles.heroContent}>
                            <span className={styles.newBadge}>Nous rejoindre ?</span>
                            <h1 className={styles.heroTitle}>
                                CBD accessible et pas cher pour buralistes : <br />
                                devenez partenaire des Amis du CBD.
                            </h1>
                            <p className={styles.heroText}>
                                Les Amis du CBD est la seule marque recommandée par les professionnels.
                                Nous vous offrons les meilleurs tarifs pour maximiser vos marges tout en satisfaisant vos clients.
                            </p>
                        </div>
                        {/* Wrapper for Desktop Illustration - Hidden on mobile via CSS ideally, or just kept if not conflicting */}
                        <div className={styles.heroImageWrapper}>
                            <img
                                src="/images/buraliste/header-illustration.png"
                                alt="Partenariat Buraliste"
                                className={styles.heroIllustration}
                            />
                        </div>
                    </div>
                </section>

                {/* CALCULATOR SECTION */}
                <section className={styles.calculatorSection}>
                    <div className={styles.calculatorContainer}>
                        <OfferComparator />
                    </div>
                </section>

                {/* WHY CHOOSE US - Section 1 (Scientist) */}
                <WhyChooseUs
                    title="Pourquoi choisir Les Amis du CBD pour votre Bureau de Tabac ?"
                    features={whyChooseUsFeatures1}
                    ctaLabel=""
                    imageSrc="/images/whychooseus/Scientist.png"
                    imageAlt="Expert Buraliste"
                />

                {/* WHY CHOOSE US - Section 2 (Woman, Reversed) */}
                <WhyChooseUs
                    title="" // No title for second part to merge visually or use a continuation title? User didn't specify, standard practice is implied continuation or blank.
                    features={whyChooseUsFeatures2}
                    ctaLabel="" // Only one CTA usually? Or both. Screenshot shows button on first, maybe not second. I'll hide button if ctaLabel empty.
                    imageSrc="/images/whychooseus/Woman.png"
                    imageAlt="Partenaire satisfaite"
                    isReversed={true}
                />

                {/* STEPS SECTION */}
                <section className={styles.stepsSection}>
                    <div className={styles.stepsContainer}>
                        {/* Woman image moved to WhyChooseUs section above */}

                        <h2 className={styles.stepsTitle}>Comment devenir partenaire Les Amis du CBD ?</h2>

                        <div className={styles.stepsGrid}>
                            <div className={styles.stepCard} style={{ alignItems: 'center', textAlign: 'center' }}>
                                <div className={styles.stepHeader}>CONTACTEZ NOTRE ÉQUIPE COMMERCIALE</div>
                                <p className={styles.stepText}>
                                    Notre équipe est disponible pour répondre à vos questions et vous accompagner dans la mise en place.<br />
                                    06 71 82 42 87
                                </p>
                            </div>
                            <div className={styles.stepCard} style={{ alignItems: 'center', textAlign: 'center' }}>
                                <div className={styles.stepHeader}>DEMANDEZ VOTRE KIT DE DÉMARRAGE</div>
                                <p className={styles.stepText}>
                                    Vous souhaitez tester le potentiel du CBD dans votre boutique ?<br /><br />
                                    Demandez votre kit de démarrage gratuit, incluant une sélection de nos produits phares, pour évaluer rapidement les ventes.
                                </p>
                            </div>
                            <div className={styles.stepCard}>
                                <div className={styles.stepHeader} style={{ textTransform: 'none', fontSize: '1.5rem', lineHeight: '1.2' }}>
                                    Prenez une longueur d'avance sur vos concurrents
                                </div>
                                <div className={styles.stepText} style={{ marginTop: '1rem', textAlign: 'left' }}>
                                    Transformez votre bureau de tabac en un point de référence du CBD accessible et pas cher, tout en rassurant votre clientèle sur la qualité et la légalité des produits.
                                    <br /><br />
                                    Les Amis du CBD, c'est le CBD bien fait, bien expliqué, et bien vendu.
                                    Nous serons ravis de vous accompagner dans cette aventure.
                                    <br /><br />
                                    Amicalement,<br />
                                    Les Amis du CBD
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


            </main>

            {/* FOOTER */}
            <Footer {...footerProps} />
        </div>
    );
}
