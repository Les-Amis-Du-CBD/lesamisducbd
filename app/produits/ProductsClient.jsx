
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import styles from './Products.module.css';

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

export default function ProductsClient({ initialProducts, globalContent }) {
    const footerProps = {
        ...FOOTER_PROPS,
        columnLinks: globalContent?.footerLinks || FOOTER_PROPS.columnLinks,
        contactInfo: globalContent?.contact || FOOTER_PROPS.contactInfo
    };
    const { addItem } = useCart();
    return (
        <main className={styles.main}>
            <Header {...HEADER_PROPS} />

            <div className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1>Nos Produits</h1>
                </div>
            </div>

            <section className={styles.container}>
                {/* Grid */}
                <div className={styles.grid}>
                    {initialProducts.map((product) => (
                        <div key={product.name} className={styles.card}>
                            <Link href={`/produit/${product.slug}`} className={styles.imageLink}>
                                <div className={styles.imageWrapper}>
                                    <Image
                                        src={product.image || '/images/placeholder.webp'}
                                        alt={product.name}
                                        fill
                                        className={styles.image}
                                    />
                                    {product.tag && <span className={styles.tag}>{product.tag}</span>}
                                </div>
                            </Link>

                            <div className={styles.cardContent}>
                                <div className={styles.cardHeader}>
                                    <h3 className={styles.productName}>{product.name}</h3>
                                </div>

                                <div className={styles.cardFooter}>
                                    <div className={styles.priceInfo}>
                                        <span className={styles.priceLabel}>Prix TTC</span>
                                        <span className={styles.priceValue}>
                                            {product.formattedPrice || `${product.priceTTC || product.price || 5} €`}
                                        </span>
                                    </div>
                                    <button
                                        className={styles.addBtn}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            addItem({ ...product, price: product.priceTTC || product.price || 5 }, 1);
                                        }}
                                        aria-label="Ajouter au panier"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <Footer {...footerProps} />
        </main>
    );
}
