
'use client';

import { useCart } from '@/context/CartContext';
import styles from './CartDrawer.module.css';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import useLockBodyScroll from '@/hooks/useLockBodyScroll';

export default function CartDrawer() {
    const { cart, isCartOpen, setIsCartOpen, removeItem, updateQuantity, clearCart, cartTotalHT, cartTotalTTC } = useCart();
    const { data: session } = useSession();
    // Use String comparison to handle both number and string types from session
    const isPro = String(session?.user?.id_default_group) === "4";

    const router = useRouter();

    // Lock scroll when cart is open
    useLockBodyScroll(isCartOpen);

    if (!isCartOpen) return null;

    const handleCheckout = async () => {
        try {
            const res = await fetch('/api/checkout/prestashop', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cart, user: session?.user })
            });
            const data = await res.json();

            if (res.ok && data.success && data.redirectUrl) {
                window.location.href = data.redirectUrl;
            } else {
                alert(`Erreur de redirection vers le paiement: ${data.error || 'Inconnue'}`);
            }
        } catch (error) {
            console.error('Checkout redirect error:', error);
            alert("Erreur réseau lors de la préparation du paiement.");
        }
    };

    return (
        <div className={styles.overlay} onClick={() => setIsCartOpen(false)}>
            <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <h2>Mon Panier</h2>
                        {cart.length > 0 && (
                            <button onClick={clearCart} className={styles.clearBtn} title="Vider le panier">
                                Vider le panier
                            </button>
                        )}
                    </div>
                    <button onClick={() => setIsCartOpen(false)} className={styles.closeBtn} aria-label="Fermer le panier">
                        ✕
                    </button>
                </div>

                <div className={styles.items}>
                    {cart.length === 0 ? (
                        <div className={styles.emptyCart}>
                            <p>Votre panier est vide.</p>
                            <Link href="/produits" passHref>
                                <button onClick={() => setIsCartOpen(false)} className={styles.shopBtn}>
                                    Découvrir nos produits
                                </button>
                            </Link>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={`${item.id}-${JSON.stringify(item.variant)}`} className={styles.item}>
                                <div className={styles.imageConfig}>
                                    {item.image && (
                                        <div className={styles.imgWrapper}>
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className={styles.itemDetails}>
                                    <h3>{item.name}</h3>
                                    {item.variant && <span className={styles.variant}>{item.variant.name}</span>}
                                    <div className={styles.price}>
                                        {isPro ? (
                                            <>
                                                {(item.priceHT || item.price).toFixed(2)}€ HT
                                                <span style={{ fontSize: '0.85em', color: '#666', marginLeft: '6px' }}>
                                                    ({(item.priceTTC || item.price).toFixed(2)}€ TTC)
                                                </span>
                                            </>
                                        ) : (
                                            `${(item.priceTTC || item.price).toFixed(2)}€`
                                        )}
                                    </div>

                                    <div className={styles.controls}>
                                        <div className={styles.qtyControl}>
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1, item.variant)} aria-label="Diminuer la quantité">-</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant)} aria-label="Augmenter la quantité">+</button>
                                        </div>
                                        <button onClick={() => removeItem(item.id, item.variant)} className={styles.removeBtn}>
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <div className={styles.footer}>
                        {isPro ? (
                            <div className={styles.totalRowPro}>
                                <div className={styles.totalLine}>
                                    <span>Total HT</span>
                                    <span>{cartTotalHT.toFixed(2)}€</span>
                                </div>
                                <div className={styles.totalLine} style={{ opacity: 0.8, fontSize: '0.9em' }}>
                                    <span>Total TTC</span>
                                    <span>{cartTotalTTC.toFixed(2)}€</span>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.totalRow}>
                                <span>Total</span>
                                <span className={styles.totalAmount}>{cartTotalTTC.toFixed(2)}€</span>
                            </div>
                        )}
                        <p className={styles.shippingNote}>
                            Livraison <span style={{ color: '#10B981', fontWeight: 'bold' }}>offerte</span>
                        </p>
                        <button onClick={handleCheckout} className={styles.checkoutBtn}>
                            Procéder au paiement
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
