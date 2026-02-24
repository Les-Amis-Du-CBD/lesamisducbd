import { NextResponse } from 'next/server';
import { prestaCheckoutService } from '@/lib/services/prestaCheckoutService';
import crypto from 'crypto';

export async function POST(request) {
    try {
        const payload = await request.json();
        const { cart } = payload;

        if (!cart || cart.length === 0) {
            return NextResponse.json({ success: false, error: 'Panier vide' }, { status: 400 });
        }

        // 1. Créer le panier "Anonyme" sur PrestaShop
        // id_customer = 0 et id_address = 0 indique à PrestaShop que c'est un visiteur
        // Le prestaCheckoutService.js doit accepter ces valeurs (ou nous devons adapter)
        console.log("[checkout/prestashop] Création du panier PrestaShop...");
        const prestashopCartId = await prestaCheckoutService.createCart(0, 0, cart);

        console.log("[checkout/prestashop] Panier créé avec l'ID:", prestashopCartId);

        // 2. Générer la signature de sécurité
        // La clé secrète doit être partagée entre ce fichier et le sas.php de PrestaShop
        const secretKey = process.env.PRESTASHOP_SAS_SECRET_KEY || 'CHANGEME_EN_PROD';

        // Hasher id_cart + clé secrète (comme md5 en PHP)
        const signature = crypto.createHash('md5').update(prestashopCartId + secretKey).digest('hex');

        // 3. Préparer l'URL de redirection
        const prestaUrl = process.env.PRESTASHOP_API_URL.replace('/api', ''); // ex: https://lesamisducbd.fr
        const redirectUrl = `${prestaUrl}/sas.php?cart_id=${prestashopCartId}&sign=${signature}`;

        return NextResponse.json({
            success: true,
            redirectUrl: redirectUrl
        });

    } catch (error) {
        console.error('[checkout/prestashop] Erreur:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
