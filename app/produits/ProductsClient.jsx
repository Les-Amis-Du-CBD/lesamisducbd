
'use client';

import { useState, useEffect } from 'react';
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
        disclaimer: "Vous pouvez vous désinscrire à tout moment.",
            isVisible: globalContent?.visibility?.newsletter !== false
    },
    copyright: "©2024 - Les Amis du CBD"
};

const CAROUSEL_SLIDES = [
    {
        id: 1,
        title: "L'Essentiel du CBD",
        subtitle: "Découvrez notre sélection rigoureuse, pensée pour votre bien-être au quotidien.",
        image: "/images/hero.png",
        buttonText: "Notre histoire",
        buttonLink: "/essentiel"
    },
    {
        id: 2,
        title: "La Qualité Premium",
        subtitle: "Des fleurs et résines exceptionnelles, cultivées avec passion pour des arômes uniques.",
        image: "/images/carousel_nature_cbd.png",
        buttonText: "Voir nos fleurs",
        buttonLink: "/produits?cat=fleur"
    },
    {
        id: 3,
        title: "Bien-être & Sérénité",
        subtitle: "Des conseils experts pour intégrer nos produits à votre routine détente.",
        image: "/images/carousel_wellness_cbd.png",
        buttonText: "Nos conseils",
        buttonLink: "/usages"
    }
];

export default function ProductsClient({ initialProducts, globalContent }) {
    const footerProps = {
        ...FOOTER_PROPS,
        columnLinks: globalContent?.footerLinks || FOOTER_PROPS.columnLinks,
        contactInfo: globalContent?.contact || FOOTER_PROPS.contactInfo
    };
    const { addItem } = useCart();

    // State
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentSlide, setCurrentSlide] = useState(0);

    // Carousel Logic
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrentSlide((currentSlide + 1) % CAROUSEL_SLIDES.length);
    const prevSlide = () => setCurrentSlide((currentSlide - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length);

    // Helper to determine product type robustly (handles accents and forces PLV away from Fleurs)
    const getProductType = (product) => {
        const nameNorm = (product.name || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const tagNorm = (product.tag || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        // Exclude PLV/Flyers/Accessories first
        if (['plv', 'flyer', 'tourniquet', 'presentoir', 'accessoire'].some(k => nameNorm.includes(k) || tagNorm.includes(k))) return 'autre';

        if (['resine', 'hash', 'filtre', 'pollen'].some(k => nameNorm.includes(k) || tagNorm.includes(k))) return 'resine';
        if (['pack', 'mystere', 'decouverte'].some(k => nameNorm.includes(k) || tagNorm.includes(k))) return 'pack';
        if (['fleur', 'trim', 'mix', 'skunk', 'amnesia', 'gorilla', 'remedy', 'cbd'].some(k => nameNorm.includes(k) || tagNorm.includes(k)) || product.category === 3) return 'fleur';

        return 'autre';
    };

    // Derived Categories
    const categories = [
        { id: 'all', label: 'Tout voir' },
        { id: 'fleur', label: 'Fleurs CBD' },
        { id: 'resine', label: 'Résines & Pollens' },
        { id: 'pack', label: 'Packs' },
        { id: 'autre', label: 'Accessoires & Divers' }
    ];

    // Filter Logic
    const filteredProducts = initialProducts.filter(product => {
        // Search filter
        if (searchQuery) {
            const searchNorm = searchQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const nameNorm = (product.name || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            if (!nameNorm.includes(searchNorm)) return false;
        }

        // Category filter
        if (activeCategory === 'all') return true;
        return getProductType(product) === activeCategory;
    });

    return (
        <main className={styles.main}>
            <Header {...HEADER_PROPS} />

            {/* Hero Carousel */}
            <div className={styles.carouselContainer}>
                {CAROUSEL_SLIDES.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`${styles.carouselSlide} ${index === currentSlide ? styles.slideActive : ''}`}
                        style={{ backgroundImage: `url(${slide.image})` }}
                    >
                        <div className={styles.slideOverlay}></div>
                        <div className={styles.slideContent}>
                            <h2>{slide.title}</h2>
                            <p>{slide.subtitle}</p>
                            {slide.buttonLink && (
                                <Link href={slide.buttonLink} className={styles.slideBtn}>
                                    {slide.buttonText}
                                </Link>
                            )}
                        </div>
                    </div>
                ))}

                {/* Carousel Controls */}
                <button className={`${styles.carouselNav} ${styles.navPrev}`} onClick={prevSlide} aria-label="Image précédente">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                </button>
                <button className={`${styles.carouselNav} ${styles.navNext}`} onClick={nextSlide} aria-label="Image suivante">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                </button>

                <div className={styles.carouselIndicators}>
                    {CAROUSEL_SLIDES.map((_, index) => (
                        <button
                            key={index}
                            className={`${styles.indicator} ${index === currentSlide ? styles.indicatorActive : ''}`}
                            onClick={() => setCurrentSlide(index)}
                            aria-label={`Aller à la diapositive ${index + 1}`}
                        ></button>
                    ))}
                </div>
            </div>

            {/* Search Bar */}
            <div className={styles.searchContainer}>
                <div className={styles.searchWrapper}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.searchIcon}>
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input
                        type="text"
                        placeholder="Rechercher un produit (ex: Amnésia, Pollen...)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                    {searchQuery && (
                        <button className={styles.clearSearchBtn} onClick={() => setSearchQuery('')} aria-label="Effacer la recherche">
                            &times;
                        </button>
                    )}
                </div>
            </div>

            <section className={styles.container}>
                {/* Category Filters */}
                <div className={styles.filtersWrapper}>
                    <div className={styles.filtersScroll}>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                className={`${styles.filterBtn} ${activeCategory === cat.id ? styles.active : ''}`}
                                onClick={() => setActiveCategory(cat.id)}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div className={styles.grid}>
                    {filteredProducts.map((product, index) => {
                        return (
                            <div key={product.name} className={styles.card}>
                                <Link href={`/produit/${product.slug}`} className={styles.imageLink}>
                                    <div className={styles.imageWrapper}>
                                        <Image
                                            src={product.image || '/images/placeholder.webp'}
                                            alt={product.name}
                                            fill
                                            priority={index < 6}
                                            unoptimized
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            className={styles.image}
                                        />
                                        {product.tag && product.tag.toLowerCase() !== 'bestseller' && (
                                            <span className={styles.tag}>
                                                {product.tag}
                                            </span>
                                        )}
                                    </div>
                                </Link>

                                <div className={styles.cardContent}>
                                    <div className={styles.cardHeader}>
                                        <h3 className={styles.productName}>{product.name}</h3>
                                        <p className={styles.productSubtitle}>
                                            {getProductType(product) === 'fleur' ? 'Cultivé en France' : 'Qualité Premium'}
                                        </p>
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
                                            title="Ajouter au panier"
                                        >
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                                <path d="M16 10a4 4 0 0 1-8 0"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {filteredProducts.length === 0 && (
                        <div className={styles.emptyState}>
                            <p>Aucun produit ne correspond à cette catégorie pour le moment.</p>
                        </div>
                    )}
                </div>
            </section>

            <Footer {...footerProps} />
        </main>
    );
}
