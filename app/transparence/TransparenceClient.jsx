'use client';

import { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import styles from './Transparence.module.css';
import { X, Star, BadgeEuro, ShieldCheck } from 'lucide-react';

const HEADER_PROPS = {
    logoText: "LES AMIS DU CBD",
    logoImage: "/images/logo.png",
    menuItems: [
        { label: "PRODUITS", href: "/produits" },
        { label: "L'ESSENTIEL", href: "/essentiel" },
        { label: "CBD & USAGES", href: "/usages" },
        { label: "BURALISTE", href: "/buraliste" }
    ]
};

const FOOTER_PROPS = {
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

// Based on the user's uploaded 5 certificates names at the bottom
const ANALYSES = [
    { src: '/images/transparence/ak47.png', alt: 'Analyse AK-47 CBD', label: 'AK-47 CBD = 7,5%' },
    { src: '/images/transparence/amnesia.png', alt: 'Analyse AMNÉSIA CBD', label: 'AMNÉSIA CBD = 7%' },
    { src: '/images/transparence/remedy.png', alt: 'Analyse REMEDY CBD', label: 'REMEDY CBD = 9%' },
    { src: '/images/transparence/superskunk.png', alt: 'Analyse SUPER SKUNK CBD', label: 'SUPER SKUNK CBD = 12%' },
    { src: '/images/transparence/gorillaglue.jpg', alt: 'Analyse GORILLA GLUE CBD', label: 'GORILLA GLUE CBD = 10%' },
];

import useLockBodyScroll from '@/hooks/useLockBodyScroll';

export default function TransparenceClient({ globalContent }) {
    const [selectedImage, setSelectedImage] = useState(null);
    useLockBodyScroll(!!selectedImage);

    const footerProps = {
        ...FOOTER_PROPS,
        columnLinks: globalContent?.footerLinks || FOOTER_PROPS.columnLinks,
        contactInfo: globalContent?.contact || FOOTER_PROPS.contactInfo
    };

    return (
        <main className={styles.main}>
            <Header {...HEADER_PROPS} />

            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Transparence</h1>
                    <p className={styles.subtitle}>La qualité sans compromis.</p>
                </div>

                {/* Intro Section with Profile */}
                <section className={styles.introSection}>
                    <div className={styles.profileWrapper}>
                        <Image
                            src="/images/nelson.png"
                            alt="Nelson - Les Amis du CBD"
                            fill
                            className={styles.profileImage}
                        />
                    </div>
                    <div className={styles.quoteBlock}>
                        <p className={styles.quoteText}>
                            "Nous, Les Amis du CBD sommes des vrais passionnés du cannabis !<br /><br />
                            Or nous étions extrêmement déçu de voir le marché français inondé par des produits de qualité médiocre, vendus bien souvent à des prix délirants !<br /><br />
                            Nous nous sommes donc mis au travail, et nous avons été surpris de voir ce qu'il était possible."
                        </p>
                        <p className={styles.quoteAuthor}>Nelson - Les Amis du CBD</p>
                    </div>
                </section>

                {/* Section 1: Qualité */}
                <section className={styles.featureSection}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.iconCircle}><Star size={40} /></div>
                        <h2>Meilleure qualité</h2>
                    </div>
                    <div className={styles.columns}>
                        <div className={styles.column}>
                            <h3>Culture 100 % naturelle</h3>
                            <p>Nos plantes sont cultivées en serre sur sol vivant :</p>
                            <ul>
                                <li>Ni engrais chimiques, ni pesticides ou insecticides.</li>
                                <li>Sous la lumière naturelle du soleil.</li>
                                <li>Boostées seulement avec des engrais organiques type composte et guano de chauve-souris.</li>
                            </ul>
                        </div>
                        <div className={styles.column}>
                            <h3>&lt; 0,3% de THC, sans lavage !</h3>
                            <p>Point essentiel pour la qualité finale, nos fleurs ont naturellement moins de 0,3% de THC.</p>
                            <p>Elles n'ont donc pas besoins de "lavage" avec des produits chimiques afin de baisser le taux de THC.</p>
                            <p>Ainsi, nous préservons la couleur, les arômes et les parfums originaux.</p>
                        </div>
                    </div>
                </section>

                {/* Section 2: Prix */}
                <section className={styles.featureSection}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.iconCircle}><BadgeEuro size={40} /></div>
                        <h2>Moins cher</h2>
                    </div>
                    <div className={styles.columns}>
                        <div className={styles.column}>
                            <h3>Le naturel, c'est gratuit !</h3>
                            <p>Comme nos fleurs sont cultivées naturellement, nos économisons :</p>
                            <ul>
                                <li>Pas d'engrais ou d'autres produits chimiques coûteux.</li>
                                <li>Pas de matériel hi-tech (ni système hydroponique, ni éclairage artificiel).</li>
                                <li>Pas de facture d'électricité.</li>
                                <li>Pas de "lavage" chimique pour baisser le taux de THC.</li>
                                <li>Donc pas besoin de parfumer artificiellement les plantes par la suite.</li>
                            </ul>
                        </div>
                        <div className={styles.column}>
                            <h3>Simplicité :</h3>
                            <p>Nous comptons sur la quantité et nous pratiquons des marges raisonnables.</p>
                            <p>Avec Les Amis du CBD, vous n'avez pas 200 références.</p>
                            <p>Seulement 4 variétés au top, disponibles en 4 ou 10 gramme !</p>
                            <p>Ainsi :</p>
                            <ul>
                                <li>La gestion de vos stocks est plus facile.</li>
                                <li>Vos commandes sont rapide à faire,</li>
                                <li>Vous proposez un prix imbattable que cela soit vis-à-vis de vos concurrents locaux, comme de la concurrence en ligne !</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Section 3: Sécurité / Certificats */}
                <section className={styles.featureSection}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.iconCircle}><ShieldCheck size={40} /></div>
                        <h2>Sécurité</h2>
                    </div>

                    <h3 className={styles.certifTitle}>Certificats d'analyses :</h3>

                    <div className={styles.galleryGrid}>
                        {ANALYSES.map((analyse, idx) => (
                            <div
                                key={idx}
                                className={styles.imageCard}
                                onClick={() => setSelectedImage(analyse)}
                            >
                                <div className={styles.imageWrapper}>
                                    <Image
                                        src={analyse.src}
                                        alt={analyse.alt}
                                        fill
                                        className={styles.image}
                                    />
                                </div>
                                <div className={styles.imageCaption}>
                                    {analyse.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Lightbox / Modal for viewing full document */}
            {selectedImage && (
                <div className={styles.modalOverlay}>
                    <button
                        className={styles.modalClose}
                        onClick={() => setSelectedImage(null)}
                        aria-label="Fermer"
                    >
                        <X size={40} />
                    </button>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <Image
                            src={selectedImage.src}
                            alt={selectedImage.alt}
                            fill
                            className={styles.modalImage}
                        />
                    </div>
                </div>
            )}

            <Footer {...footerProps} />
        </main>
    );
}
