'use client';

import React from 'react';
import Image from 'next/image';
import styles from './page.module.css';

import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import UsagesCarousel from '@/components/UsagesCarousel/UsagesCarousel';
import Quote from '@/components/Quote/Quote';
import JoinUs from '@/components/JoinUs/JoinUs';
import ContentHero from '@/components/ContentHero/ContentHero';

import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';

export default function UsagesClient({ globalContent }) {

    // --- Mocks ---
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

    // Carousel Data Placeholder
    const usagesItems = [
        {
            title: "Détente et relaxation",
            description: "Le CBD est souvent consommé pour favoriser un état de calme et de détente, surtout dans les périodes de stress ponctuel.\n\nIl peut être intégré à vos routines de relaxation, méditation ou moments cocooning.",
            image: "/images/usages/detente.webp"
        },
        {
            title: "Sommeil et routines nocturnes",
            description: "Certaines personnes intègrent le CBD à leur rituel du coucher. Il ne s'agit pas d'un somnifère, mais d'un complément qui peut aider à préparer un sommeil plus serein.\n\nUne bonne hygiène de sommeil reste essentielle : horaires réguliers, environnement calme et réduction des écrans.",
            image: "/images/usages/sommeil.webp"
        },
        {
            title: "Concentration et focus",
            description: "Le CBD peut accompagner certains moments de concentration, que ce soit pour le travail, les études ou les projets créatifs.\n\nIl s'agit d'un usage complémentaire, qui vise à favoriser un état calme et attentif sans stimuler artificiellement.",
            image: "/images/usages/cosmetique.webp"
        },
        {
            title: "Récupération physique",
            description: "Le CBD est parfois utilisé après l'effort pour soutenir la récupération naturelle.\n\nIl peut s'intégrer à une routine de récupération incluant repos, hydratation et étirements, mais il ne remplace pas les fondamentaux de la récupération physique.",
            image: "/images/usages/sport.webp"
        },
        {
            title: "Bien-être au quotidien",
            description: "Le CBD peut être intégré à des petites routines de bien-être au quotidien : pauses relaxantes, moments personnels ou rituels simples.\n\nL'important reste la régularité, l'écoute de soi et le respect des dosages conseillés.",
            image: "/images/usages/cuisine.webp"
        }
    ];

    return (
        <div className={styles.pageWrapper}>
            <Header {...headerProps} />

            <main>
                {/* HERO */}
                <ContentHero
                    imageSrc="/images/usages/hero.webp"
                    imageAlt="Illustration CBD Questionnement"
                    imagePosition="center 35%"
                >
                    <h1 className={styles.heroTitle}>Le CBD ?</h1>
                </ContentHero>

                {/* INTRO */}
                <ScrollReveal animation="fade-up">
                    <section className={styles.introSection}>
                        <h2 className={styles.introTitle}>CBD : usages courants,<br />limites et bonnes pratiques.</h2>
                        <p className={styles.introText}>
                            Le CBD est utilisé par de nombreuses personnes dans la vie quotidienne.
                            Cette page présente 5 usages fréquents, avec leurs limites et bonnes pratiques.
                            Le CBD n'est pas un médicament et ne remplace jamais un avis médical.
                        </p>
                    </section>
                </ScrollReveal>

                {/* CAROUSEL */}
                <ScrollReveal animation="fade-up" delay={200}>
                    <section className={styles.carouselSection}>
                        <h2 className={styles.carouselTitle}>Usages du CBD<br />au quotidien :</h2>
                        <UsagesCarousel items={usagesItems} />
                    </section>
                </ScrollReveal>

                {/* WARNING */}
                <ScrollReveal animation="fade-up">
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
                </ScrollReveal>

                {/* ESSENTIAL BOX */}
                <ScrollReveal animation="fade-up">
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
                </ScrollReveal>

                {/* FOOTER QUERY */}
                <ScrollReveal animation="fade-up">
                    <Quote
                        text={`"Découvrir le CBD en toute responsabilité.<br/>Explorez nos produits.<br/>Lire nos guides pédagogiques."`}
                        author="Nelson — Les Amis du CBD"
                    />
                </ScrollReveal>

                {/* JOIN US */}
                <ScrollReveal animation="fade-up">
                    <JoinUs
                        title="Nous rejoindre"
                        buttonLabel="Venez par ici"
                        buttonLink="/recrutement"
                        text="Aucun poste ouvert pour le moment ? Les candidatures spontanées sont toujours les bienvenues."
                    />
                </ScrollReveal>

            </main>

            <Footer {...footerProps} />
        </div>
    );
}
