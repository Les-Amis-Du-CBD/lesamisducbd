import Link from 'next/link';
import Image from 'next/image';
import styles from './ProductCard.module.css';
import { Tag } from 'lucide-react';

/**
 * ProductCard — affiche un produit issu de l'API PrestaShop.
 * 
 * Props attendues (depuis mapPrestaProduct) :
 *  - id, name, slug, formattedPrice (ex: "18,96 €"), image, descriptionShort (HTML), onSale
 */
export default function ProductCard({ product }) {
    return (
        <Link href={`/produit/${product.slug}`} className={styles.card}>
            {/* Badge Promo */}
            {product.onSale && (
                <span className={styles.badge}>
                    <Tag size={11} /> Promo
                </span>
            )}

            {/* Image Produit */}
            <div className={styles.imageWrapper}>
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className={styles.image}
                    sizes="(max-width: 768px) 50vw, 25vw"
                    unoptimized // Image vient d'un serveur externe PrestaShop
                />
            </div>

            {/* Infos */}
            <div className={styles.info}>
                <h3 className={styles.name}>{product.name}</h3>

                {/* Description courte (peut contenir du HTML) */}
                {product.descriptionShort && (
                    <div
                        className={styles.desc}
                        dangerouslySetInnerHTML={{ __html: product.descriptionShort }}
                    />
                )}

                <div className={styles.footer}>
                    <span className={styles.price}>{product.formattedPrice}</span>
                    <button className={styles.cta}>Voir le produit</button>
                </div>
            </div>
        </Link>
    );
}
