import { NextResponse } from 'next/server';
import { prestaCheckoutService } from '@/lib/services/prestaCheckoutService';

export async function POST(req) {
    try {
        const body = await req.json();
        const { cart, address } = body;

        if (!cart || cart.length === 0) {
            return NextResponse.json({ success: false, error: 'Cart is empty' }, { status: 400 });
        }
        if (!address || !address.email) {
            return NextResponse.json({ success: false, error: 'Address and email are required' }, { status: 400 });
        }

        const prestaBaseUrl = process.env.PRESTASHOP_API_URL?.replace('/api', '');

        console.log('[Checkout API] Starting PrestaShop checkout for:', address.email);

        // 1. Get or Create Customer
        const customerId = await prestaCheckoutService.createGuestCustomer({
            email: address.email,
            firstname: address.firstname,
            lastname: address.lastname,
        });
        console.log('[Checkout API] Customer resolved:', customerId);

        // 2. Create Address
        const addressId = await prestaCheckoutService.createAddress(customerId, address);
        console.log('[Checkout API] Address created:', addressId);

        // 3. Create Cart
        const prestaCartId = await prestaCheckoutService.createCart(customerId, addressId, cart);
        console.log('[Checkout API] Cart created:', prestaCartId);

        // 4. Build checkout redirect URL
        // PS checkout URL with cart ID set in session — user lands directly on the checkout page
        const checkoutUrl = `${prestaBaseUrl}/index.php?controller=order&id_cart=${prestaCartId}&id_customer=${customerId}`;

        console.log('[Checkout API] Redirecting to:', checkoutUrl);

        return NextResponse.json({
            success: true,
            checkoutUrl,
            cartId: prestaCartId,
            message: 'Cart created in PrestaShop'
        });

    } catch (error) {
        console.error('[Checkout API] Error during checkout preparation:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Internal Server Error'
        }, { status: 500 });
    }
}
