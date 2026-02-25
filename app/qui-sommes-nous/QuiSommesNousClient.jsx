'use client';

import React from 'react';
import Image from 'next/image';
import styles from './page.module.css';

import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import Quote from '@/components/Quote/Quote';
import JoinUs from '@/components/JoinUs/JoinUs';
import UsagesCarousel from '@/components/UsagesCarousel/UsagesCarousel';

import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';

export default function QuiSommesNousClient({ globalContent }) {
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

    const legalItems = [
        {
            title: "Le CBD est-il légal en France ?",
            description: "Oui, le CBD est légal en France, à condition de respecter un cadre réglementaire strict.\nPour être autorisé à la vente et à la consommation, un produit à base de CBD doit impérativement :\n• contenir un taux de THC inférieur ou égal à 0,3 %\n• être issu de variétés de Cannabis sativa L. autorisées\n• faire l'objet d'analyses réalisées par un laboratoire indépendant\nCes règles visent à garantir la sécurité des consommateurs et la conformité des produits sur le marché français.",
            image: "/images/about/legal.webp"
        },
        {
            title: "Pourquoi les analyses en laboratoire sont essentielles ?",
            description: "Les analyses de laboratoire ne sont pas un argument marketing.\nElles sont une garantie.\nChaque analyse permet de vérifier :\n• le taux réel de THC\n• la conformité légale du produit\n• l'absence d'anomalies majeures\nUn CBD sans analyse claire est un CBD sans preuve.\nChez Les Amis du CBD, chaque lot est analysé par un laboratoire indépendant en France, afin d'assurer une transparence totale.",
            image: "/images/about/analysis.webp"
        },
        {
            title: "CBD et THC : deux molécules, deux effets très différents :",
            description: "Le CBD (cannabidiol) et le THC (tétrahydrocannabinol) sont deux molécules naturellement présentes dans le chanvre, mais leurs effets sont très différents.\n\nLe CBD :\n• n'est pas psychotrope\n• ne provoque pas d'euphorie\n• est autorisé à la vente\n\nLe THC :\n• est psychotrope\n• peut entraîner des effets planants\n• est strictement réglementé\n\nC'est cette distinction fondamentale qui explique pourquoi le CBD est légal, contrairement au THC.",
            image: "/images/about/molecules.webp"
        }
    ];

    const cultureItems = [
        {
            title: "Culture naturelle : ce que cela change vraiment :",
            description: "La manière dont une plante est cultivée influence directement sa qualité finale.\n\nUne culture naturelle permet :\n• de préserver les arômes d'origine\n• d'éviter les résidus chimiques\n• de respecter le rythme naturel de la plante\n\nNos fleurs sont cultivées en serre, sur sol vivant, sans engrais chimiques, sans pesticides et sous lumière naturelle.",
            image: "/images/about/culture_1.webp"
        },
        {
            title: "Le \"lavage\" du CBD : une pratique méconnue.",
            description: "Lorsque certaines fleurs dépassent le seuil légal de THC, elles peuvent être \"lavées\" chimiquement afin de réduire artificiellement leur taux de THC.\n\nCette pratique permet la mise en conformité, mais elle peut :\n• altérer les arômes\n• modifier la couleur\n• appauvrir le profil naturel de la fleur\n\nDes fleurs naturellement conformes n'ont pas besoin de subir ce traitement.",
            image: "/images/about/culture_2.webp"
        },
        {
            title: "CBD pas cher : ce que cela veut vraiment dire.",
            description: "Un prix bas n'est pas forcément synonyme de mauvaise qualité. Mais un prix incohérent cache souvent des compromis.\n\nLe prix d'un CBD dépend :\n• du mode de culture\n• des coûts énergétiques\n• des traitements post-récolte\n• des marges appliquées\n\nUne production simple, naturelle et maîtrisée permet de proposer un CBD accessible, sans sacrifier la qualité.",
            image: "/images/about/culture_3.webp"
        }
    ];

    return (
        <div className={styles.pageWrapper}>
            <Header {...headerProps} />

            <main>
                {/* HERO */}
                <section className={styles.heroSection}>
                    <h1 className={styles.pageTitle}>Qui sommes - nous ?</h1>
                    <div className={styles.heroImageWrapper}>
                        <img
                            src="/images/about/team.webp"
                            alt="L'équipe Les Amis du CBD"
                            className={styles.heroImage}
                        />
                    </div>
                </section>

                {/* INTRO TEXT */}
                <ScrollReveal animation="fade-up">
                    <section className={styles.introSection}>
                        <p className={styles.introText}>
                            Nous sommes une bande d'amis d'enfance, passionnés par le CBD et convaincus qu'il doit être simple, accessible et de qualité.
                        </p>
                        <p className={styles.introText}>
                            Chez Les Amis du CBD, aucune étiquette compliquée, ni de noms artificiels, nous on utilise un vocabulaire du quotidien.
                        </p>
                        <p className={styles.introText}>
                            Notre aventure, c'est avant tout une histoire d'amis, de partage et de sincérité, avec nos partenaires et nos clients.
                        </p>
                    </section>
                </ScrollReveal>

                {/* CAROUSEL 1: TRANSPARENCE */}
                <ScrollReveal animation="fade-up" delay={200}>
                    <section className={styles.carouselSection}>
                        <h2 className={styles.sectionTitle}>
                            CBD : transparence,<br />légalité et ce qu'il faut<br />vraiment savoir.
                        </h2>
                        <p className={styles.sectionIntro}>
                            Le CBD est partout. Mais entre informations approximatives, promesses exagérées et discours flous, il devient difficile de s'y retrouver.
                            Cette page a un seul objectif : vous donner des informations claires, vérifiées et conformes à la réglementation française, pour consommer le CBD sans confusion.
                        </p>
                        <UsagesCarousel items={legalItems} />
                    </section>
                </ScrollReveal>

                {/* CAROUSEL 2: CULTURE */}
                <ScrollReveal animation="fade-up" delay={200}>
                    <section className={styles.carouselSection}>
                        <h2 className={styles.sectionTitle}>
                            Culture naturelle : ce que cela change<br />vraiment.
                        </h2>
                        <p className={styles.sectionIntro}>
                            La manière dont une plante est cultivée influence directement sa qualité finale.
                            Une culture naturelle permet :
                        </p>
                        <UsagesCarousel items={cultureItems} />
                    </section>
                </ScrollReveal>

                {/* ESSENTIAL BOX */}
                <ScrollReveal animation="scale-up" delay={100} duration={800}>
                    <section className={styles.essentialSection}>
                        <div className={styles.essentialBox}>
                            <h3 className={styles.essentialTitle}>L'essentiel à retenir<br />sur le CBD :</h3>
                            <ul className={styles.essentialList}>
                                <li>Le CBD est légal en France sous conditions strictes.</li>
                                <li>Le CBD ne doit jamais être confondu avec des produits stupéfiants.</li>
                                <li>La culture influence directement la qualité.</li>
                                <li>La transparence est le meilleur indicateur de confiance.</li>
                            </ul>
                        </div>
                    </section>
                </ScrollReveal>

                {/* FOOTER QUERY */}
                <ScrollReveal animation="fade-up" delay={200}>
                    <Quote
                        text={`"Comprendre avant d'acheter.<br/>Explorer nos articles pédagogiques.<br/>Découvrir nos produits en toute confiance."`}
                        author="Nelson — Les Amis du CBD"
                    />
                </ScrollReveal>

                {/* JOIN US */}
                <ScrollReveal animation="fade-up" delay={300}>
                    <JoinUs
                        title="Nous rejoindre"
                        buttonLabel="Venez par ici"
                        buttonLink="/recrutement"
                        text="Tu penses avoir le profil pour rejoindre l'équipe ? On attend ta candidature !"
                    />
                </ScrollReveal>

            </main>

            <Footer {...footerProps} />
        </div>
    );
}
