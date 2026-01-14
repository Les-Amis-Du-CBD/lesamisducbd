import styles from './WhyChooseUs.module.css';

export default function WhyChooseUs({ title, features, ctaLabel }) {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <h2 className={styles.title}>{title}</h2>
                    <div className={styles.list}>
                        {features.map((feature, index) => (
                            <div key={index} className={styles.item}>
                                <h3 className={styles.itemTitle}>{feature.title}</h3>
                                <p className={styles.itemDesc}>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                    <button className={styles.cta}>{ctaLabel}</button>
                </div>

                <div className={styles.collage}>
                    {/* Placeholder images from mockup style */}
                    <div className={styles.largeImage}>
                        <img
                            src="https://images.unsplash.com/photo-1616606002441-2b0e6e76cf81?q=80&w=1000&auto=format&fit=crop"
                            alt="Bowl of flowers"
                            className={styles.image}
                        />
                    </div>
                    <div className={styles.smallImage}>
                        <img
                            src="https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?q=80&w=800&auto=format&fit=crop"
                            alt="Flower detail"
                            className={styles.image}
                        />
                    </div>
                    <div className={styles.smallImage}>
                        <img
                            src="https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=800&auto=format&fit=crop"
                            alt="Single Bud"
                            className={styles.image}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
