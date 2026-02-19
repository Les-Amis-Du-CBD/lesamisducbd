
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from LocalStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
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
            const existingItemIndex = prevCart.findIndex(
                (item) => item.id === product.id &&
                    JSON.stringify(item.variant) === JSON.stringify(variant)
            );

            if (existingItemIndex > -1) {
                // Item exists, update quantity
                const newCart = [...prevCart];
                newCart[existingItemIndex].quantity += quantity;
                return newCart;
            } else {
                // New item
                return [...prevCart, {
                    id: product.id || product.name, // Fallback to name if ID missing (Mock data)
                    name: product.name,
                    price: product.price || 0, // Ensure price is handled
                    image: product.image,
                    quantity,
                    variant
                }];
            }
        });
        setIsCartOpen(true); // Auto-open cart on add
    };

    // Remove Item
    const removeItem = (id, variant = null) => {
        setCart((prevCart) =>
            prevCart.filter(
                (item) => !(item.id === id && JSON.stringify(item.variant) === JSON.stringify(variant))
            )
        );
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
