
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/context/ToastContext';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const { showToast } = useToast();

    // Helper to normalize variant for comparison
    const getVariantKey = (variant) => {
        if (!variant) return 'null';
        return JSON.stringify(variant);
    };

    // Helper to merge duplicates
    const consolidateCart = (items) => {
        const uniqueItems = [];
        items.forEach(item => {
            const itemId = item.id || item.slug || item.name;
            const variantKey = getVariantKey(item.variant);

            const existingIndex = uniqueItems.findIndex(u => {
                const uId = u.id || u.slug || u.name;
                const uVariantKey = getVariantKey(u.variant);
                return uId === itemId && uVariantKey === variantKey;
            });

            if (existingIndex > -1) {
                uniqueItems[existingIndex].quantity += item.quantity;
            } else {
                uniqueItems.push({
                    ...item,
                    id: itemId,
                    variant: item.variant || null
                });
            }
        });
        return uniqueItems;
    };

    // Load from LocalStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                setCart(consolidateCart(parsedCart));
            } catch (e) {
                console.error('Failed to parse cart from local storage:', e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to LocalStorage whenever cart changes
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }, [cart, isLoaded]);

    // Add Item to Cart
    const addItem = (product, quantity = 1, variant = null) => {
        setCart((prevCart) => {
            const productId = product.id || product.slug || product.name;
            const variantKey = getVariantKey(variant);

            const existingItemIndex = prevCart.findIndex((item) => {
                const itemId = item.id || item.slug || item.name;
                const itemVariantKey = getVariantKey(item.variant);
                return itemId === productId && itemVariantKey === variantKey;
            });

            if (existingItemIndex > -1) {
                // Item exists, update quantity
                const newCart = [...prevCart];
                newCart[existingItemIndex] = {
                    ...newCart[existingItemIndex],
                    quantity: newCart[existingItemIndex].quantity + quantity
                };
                return newCart;
            } else {
                // New item
                return [...prevCart, {
                    ...product, // Keep all product props including image, price, etc.
                    id: productId, // Ensure stable ID
                    quantity,
                    variant: variant || null
                }];
            }
        });
        // setIsCartOpen(true); // Auto-open cart on add - REPLACED BY TOAST
        showToast(`${quantity}x ${product.name} ajouté !`, 'success', 3000, {
            label: 'Voir',
            onClick: () => setIsCartOpen(true)
        });
    };

    // Remove Item
    const removeItem = (id, variant = null) => {
        setCart((prevCart) =>
            prevCart.filter(
                (item) => !(item.id === id && JSON.stringify(item.variant) === JSON.stringify(variant))
            )
        );
        showToast('Produit retiré du panier', 'success');
    };

    // Update Quantity
    const updateQuantity = (id, quantity, variant = null) => {
        if (quantity < 1) return;
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === id && JSON.stringify(item.variant) === JSON.stringify(variant)
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    // Clear Cart
    const clearCart = () => {
        setCart([]);
        showToast('Le panier a été vidé', 'success');
    };

    // Calculate Totals
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            cart,
            isCartOpen,
            setIsCartOpen,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            cartCount,
            cartTotal
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
