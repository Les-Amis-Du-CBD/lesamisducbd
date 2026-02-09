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
        { title: "Sécurité & légalité avant tout", description: "Produits conformes à la législation française, avec moins de 0,3 % de THC." },
        { title: "Produits testés et traçables", description: "Analyses par des laboratoires indépendants et vente sous scellé de protection." },
        { title: "Zéro risque en bureau de tabac", description: "Une gamme pensée pour une vente simple, claire et sans mauvaise surprise." },
        { title: "CBD 100 % naturel, sans lavage chimique", description: "Fleurs cultivées naturellement, sans traitements artificiels, pour une qualité constante." },
        { title: "Prix public ultra accessible", description: "Des fleurs entre 1,50 € et 2 € le gramme, adaptées à une forte demande." }
    ];

    const whyChooseUsFeatures2 = [
        { title: "Gain de temps au quotidien", description: "Commandes rapides et gestion simplifiée pour se concentrer sur les ventes." },
        { title: "Accompagnement clé en main", description: "Présentoirs adaptés, supports pédagogiques et outils d'aide à la vente inclus." },
        { title: "Différenciation en point de vente", description: "Une offre CBD claire qui vous démarque de la concurrence." },
        { title: "Marge attractive pour le buraliste", description: "Un produit accessible qui reste rentable et compétitif." },
        { title: "Excellent rapport qualité / prix", description: "Un positionnement rare sur le marché, apprécié par les clients exigeants." }
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
                            <div className={styles.heroImageWrapper}>
                                <img
                                    src="/images/buraliste/header-illustration.png"
                                    alt="Partenariat Buraliste"
                                    className={styles.heroIllustration}
                                />
                            </div>
                            <h1 className={styles.heroTitle}>
                                CBD accessible et pas cher pour buralistes : <br />
                                devenez partenaire des Amis du CBD.
                            </h1>
                            <div className={styles.heroText}>
                                <strong>Cher Buraliste,</strong>
                                <br /><br />
                                Les Amis du CBD est une marque française pensée pour les bureaux de tabac : du CBD naturel, légal, accessible en prix et simple à commercialiser.
                                <br /><br />
                                Notre ambition est claire : démocratiser le CBD de qualité, sans promesses floues ni prix excessifs.
                                <br /><br />
                                Votre bureau de tabac est le lieu idéal pour proposer un CBD pas cher, fiable et conforme à la réglementation, à une clientèle de plus en plus demandeuse.
                            </div>
                        </div>
                        {/* Wrapper for Desktop Illustration - Hidden on mobile via CSS ideally, or just kept if not conflicting */}
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
