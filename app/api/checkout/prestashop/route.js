import { NextResponse } from 'next/server';
import { prestaCheckoutService } from '@/lib/services/prestaCheckoutService';
import crypto from 'crypto';

export async function POST(request) {
    try {
        const payload = await request.json();
        const { cart, user } = payload;

        if (!cart || cart.length === 0) {
            return NextResponse.json({ success: false, error: 'Panier vide' }, { status: 400 });
        }

        // 1. Déterminer l'ID Client PrestaShop
        let prestashopCustomerId = 0;

        if (user && user.email) {
            console.log(`[checkout/prestashop] Utilisateur connecté : ${user.email}`);
            // Cherche le client ou le crée
            try {
                const customerData = await prestaCheckoutService.createCustomer({
                    email: user.email,
                    name: user.name || 'Client',
                    firstname: user.firstname,
                    lastname: user.lastname,
                    company: user.company,
                    siret: user.siret,
                    birthday: user.birthday,
                    role: user.role || 'client',
                }, 0); // 0 = vrai client, pas invité
                // createCustomer returns {id, id_default_group}
                prestashopCustomerId = customerData?.id || customerData || 0;
                console.log(`[checkout/prestashop] ID Client PrestaShop trouvé/créé : ${prestashopCustomerId}`);
            } catch (err) {
                console.error("[checkout/prestashop] Erreur création client, on continue en anonyme", err);
            }
        }

        // 2. Créer le panier sur PrestaShop en l'associant au client
        // id_address = 0 indique à PrestaShop que l'adresse n'est pas encore choisie
        console.log("[checkout/prestashop] Création du panier PrestaShop...");
        const prestashopCartId = await prestaCheckoutService.createCart(prestashopCustomerId, 0, cart);

        console.log("[checkout/prestashop] Panier créé avec l'ID:", prestashopCartId);

        // 3. Générer la signature de sécurité HMAC-SHA256
        const secretKey = process.env.PRESTASHOP_SAS_SECRET_KEY;
        const ts = Math.floor(Date.now() / 1000); // Timestamp actuel

        if (!secretKey) {
            console.error("[checkout/prestashop] ERREUR CRITIQUE : PRESTASHOP_SAS_SECRET_KEY n'est pas définie.");
            return NextResponse.json({
                success: false,
                error: "Configuration de sécurité manquante sur le serveur (SAS KEY)."
            }, { status: 500 });
        }

        // Payload: cart_id-customer_id-timestamp
        const signaturePayload = `${prestashopCartId}-${prestashopCustomerId}-${ts}`;
        const signature = crypto.createHmac('sha256', secretKey).update(signaturePayload).digest('hex');

        console.log(`[checkout/prestashop] HMAC-SHA256 généré avec TS:${ts}`);

        // 4. Préparer l'URL de redirection sécurisée
        const prestaUrl = process.env.PRESTASHOP_API_URL.replace('/api', '');
        const redirectUrl = `${prestaUrl}/sas.php?cart_id=${prestashopCartId}&id_customer=${prestashopCustomerId}&ts=${ts}&sign=${signature}`;

        return NextResponse.json({
            success: true,
            redirectUrl: redirectUrl
        });

    } catch (error) {
        console.error('[checkout/prestashop] Erreur:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
