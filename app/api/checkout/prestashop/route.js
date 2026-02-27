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

        // 3. Générer la signature de sécurité
        // La clé secrète doit être partagée entre ce fichier et le sas.php de PrestaShop
        const secretKey = process.env.PRESTASHOP_SAS_SECRET_KEY || 'CHANGEME_EN_PROD';

        // Hasher id_cart + id_customer + clé secrète pour éviter la falsification de l'id client
        const signature = crypto.createHash('md5').update(prestashopCartId + '-' + prestashopCustomerId + secretKey).digest('hex');

        // 4. Préparer l'URL de redirection (on ajoute l'id_customer pour que sas.php l'identifie)
        const prestaUrl = process.env.PRESTASHOP_API_URL.replace('/api', ''); // ex: https://lesamisducbd.fr
        const redirectUrl = `${prestaUrl}/sas.php?cart_id=${prestashopCartId}&id_customer=${prestashopCustomerId}&sign=${signature}`;

        return NextResponse.json({
            success: true,
            redirectUrl: redirectUrl
        });

    } catch (error) {
        console.error('[checkout/prestashop] Erreur:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
