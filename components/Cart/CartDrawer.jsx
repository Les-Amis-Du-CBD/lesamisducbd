
'use client';

import { useCart } from '@/context/CartContext';
import styles from './CartDrawer.module.css';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useLockBodyScroll from '@/hooks/useLockBodyScroll';

export default function CartDrawer() {
    const { cart, isCartOpen, setIsCartOpen, removeItem, updateQuantity, cartTotal } = useCart();

    // Lock scroll when cart is open
    useLockBodyScroll(isCartOpen);

    if (!isCartOpen) return null;

    const handleCheckout = async () => {
        // Implement Redirect Checkout Logic
        // 1. Send cart to API
        // 2. Redirect to PrestaShop URL
        // For now, mock redirect
        alert('Redirection vers le paiement sécurisé (PrestaShop) ...');
        // window.location.href = '...';
    };

    return (
        <div className={styles.overlay} onClick={() => setIsCartOpen(false)}>
            <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>Mon Panier</h2>
                    <button onClick={() => setIsCartOpen(false)} className={styles.closeBtn}>
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
                            <div key={`${item.id}-${item.variant?.id}`} className={styles.item}>
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
                                    <div className={styles.price}>{item.price}€</div>

                                    <div className={styles.controls}>
                                        <div className={styles.qtyControl}>
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1, item.variant)}>-</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant)}>+</button>
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
                        <div className={styles.totalRow}>
                            <span>Total</span>
                            <span className={styles.totalAmount}>{cartTotal.toFixed(2)}€</span>
                        </div>
                        <p className={styles.shippingNote}>Livraison calculée à l'étape suivante</p>
                        <button onClick={handleCheckout} className={styles.checkoutBtn}>
                            Procéder au paiement
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
