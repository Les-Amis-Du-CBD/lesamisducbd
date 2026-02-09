'use client';

import React from 'react';
import Image from 'next/image';
import styles from './page.module.css';

import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import UsagesCarousel from '@/components/UsagesCarousel/UsagesCarousel';
import Quote from '@/components/Quote/Quote';
import JoinUs from '@/components/JoinUs/JoinUs';

export default function UsagesPage() {

    // --- Mocks ---
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

    // Carousel Data Placeholder
    const usagesItems = [
        {
            title: "Détente et relaxation",
            description: "Le CBD est souvent consommé pour favoriser un état de calme et de détente, surtout dans les périodes de stress ponctuel.\n\nIl peut être intégré à vos routines de relaxation, méditation ou moments cocooning.",
            image: "/images/usages/detente.png"
        },
        {
            title: "Cuisine et Alimentation",
            description: "Intégrez le CBD à vos recettes préférées. Huiles, infusions ou plats cuisinés, il existe de nombreuses façons de profiter de ses bienfaits en cuisine.",
            image: "/images/usages/cuisine.png"
        },
        {
            title: "Récupération Sportive",
            description: "De nombreux sportifs utilisent le CBD pour la récupération musculaire et la relaxation après l'effort. Il s'intègre parfaitement à une routine sportive équilibrée.",
            image: "/images/usages/sport.png"
        },
        {
            title: "Bien-être au quotidien",
            description: "Que ce soit sous forme d'huiles ou de cosmétiques, le CBD peut faire partie de votre routine bien-être quotidienne pour prendre soin de vous.",
            image: "/images/usages/cosmetique.png"
        },
        {
            title: "Sommeil et routines",
            description: "Certaines personnes utilisent le CBD à leur rituel du soir. Il ne s'agit pas d'un somnifère mais d'un complément pour favoriser un apaisement avant le coucher.",
            image: "/images/usages/sommeil.png"
        }
    ];

    return (
        <div className={styles.pageWrapper}>
            <Header {...headerProps} />

            <main>
                {/* HERO */}
                <section className={styles.heroSection}>
                    <h1 className={styles.heroTitle}>Le CBD ?</h1>
                    <div className={styles.heroImageWrapper}>
                        <img
                            src="/images/usages/hero.png"
                            alt="Illustration CBD Questionnement"
                            className={styles.heroImage}
                        />
                    </div>
                </section>

                {/* INTRO */}
                <section className={styles.introSection}>
                    <h2 className={styles.introTitle}>CBD : usages courants,<br />limites et bonnes pratiques.</h2>
                    <p className={styles.introText}>
                        Le CBD est utilisé par de nombreuses personnes dans la vie quotidienne.
                        Cette page présente 5 usages fréquents, avec leurs limites et bonnes pratiques.
                        Le CBD n'est pas un médicament et ne remplace jamais un avis médical.
                    </p>
                </section>

                {/* CAROUSEL */}
                <section className={styles.carouselSection}>
                    <h2 className={styles.carouselTitle}>Usages du CBD<br />au quotidien :</h2>
                    <UsagesCarousel items={usagesItems} />
                </section>

                {/* WARNING */}
                <section className={styles.warningSection}>
                    <h2 className={styles.warningTitle}>
                        Le CBD :<br />
                        n'est pas un médicament, ne guérit aucune maladie, ne remplace pas un traitement médical.<br />
                        En cas de doute, de traitement en cours ou de condition particulière, consultez un professionnel de santé.
                    </h2>

                    <div className={styles.responsibleSection}>
                        <h3 className={styles.responsibleTitle}>
                            Pour une utilisation responsable :<br />
                            produits analysés en laboratoire, origine claire, taux de THC conforme, information transparente
                        </h3>
                    </div>
                </section>

                {/* ESSENTIAL BOX */}
                <section className={styles.essentialSection}>
                    <div className={styles.essentialBox}>
                        <h3 className={styles.essentialTitle}>L'essentiel sur les usages du CBD :</h3>
                        <ul className={styles.essentialList}>
                            <li>Le CBD s'inscrit dans une démarche de bien-être</li>
                            <li>Les usages varient selon les individus</li>
                            <li>Il ne s'agit jamais d'un traitement médical</li>
                            <li>La qualité et la transparence sont essentielles</li>
                        </ul>
                    </div>
                </section>

                {/* FOOTER QUERY */}
                <Quote
                    text={`"Découvrir le CBD en toute responsabilité.<br/>Explorez nos produits.<br/>Lire nos guides pédagogiques."`}
                    author="Nelson — Les Amis du CBD"
                />

                {/* JOIN US */}
                <JoinUs
                    title="Nous rejoindre"
                    buttonLabel="Venez par ici"
                    buttonLink="/recrutement"
                    text="Aucun poste ouvert pour le moment ? Les candidatures spontanées sont toujours les bienvenues."
                />

            </main>

            <Footer {...footerProps} />
        </div>
    );
}
