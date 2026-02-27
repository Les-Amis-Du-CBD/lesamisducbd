<?php
/**
 * Fichier SAS de paiement Sécurisé v3.1 - Les Amis du CBD
 * Passerelle Headless Next.js -> PrestaShop 8 (Connexion de Force)
 */

require(dirname(__FILE__) . '/config/config.inc.php');
require(dirname(__FILE__) . '/init.php');

// 1. Configuration
$secret_key = 'LacBc67_9sP@!CBD2026_SecureKey';

// --- RÉQUÊTES ---
$cart_id = (int)Tools::getValue('cart_id');
$id_customer = (int)Tools::getValue('id_customer');
$ts = (int)Tools::getValue('ts');
$signature = Tools::getValue('sign');
$debug = (int)Tools::getValue('debug');

if (!$cart_id || !$signature || !$ts) {
    header('HTTP/1.0 400 Bad Request');
    die('Erreur : Paramètres de sécurité manquants.');
}

// 2. Vérification de l'expiration (15 minutes)
if (time() > ($ts + 1800)) { // Extension à 30 min pour pallier aux décalages serveurs si besoin
    header('HTTP/1.0 403 Forbidden');
    die('Erreur : Le lien de paiement a expiré.');
}

// 3. Vérification de la signature HMAC-SHA256
$payload = $cart_id . '-' . $id_customer . '-' . $ts;
$expected_signature = hash_hmac('sha256', $payload, $secret_key);

if (!hash_equals($expected_signature, $signature)) {
    header('HTTP/1.0 403 Forbidden');
    die('Erreur : Signature de sécurité invalide.');
}

// 4. Charger le panier
$cart = new Cart($cart_id);
if (!Validate::isLoadedObject($cart)) {
    die('Erreur : Panier introuvable sur le serveur.');
}

$context = Context::getContext();

// 5. Authentification de Force (BRUTE FORCE)
if ($id_customer > 0) {
    $customer = new Customer($id_customer);
    if (Validate::isLoadedObject($customer)) {

        // 5.1 On définit le client dans le contexte et le cookie
        $context->customer = $customer;
        $context->updateCustomer($customer);

        // 5.2 On synchronise les variables critiques du cookie
        $context->cookie->id_customer = (int)$customer->id;
        $context->cookie->customer_lastname = $customer->lastname;
        $context->cookie->customer_firstname = $customer->firstname;
        $context->cookie->logged = 1;
        $context->cookie->passwd = $customer->passwd;
        $context->cookie->email = $customer->email;
        $context->cookie->is_guest = $customer->is_guest;
        $context->cookie->checksum = $customer->checksum();

        // 5.3 On génère un nouveau Guest si besoin (évite l'expiration de session)
        if (empty($context->cookie->id_guest)) {
            Guest::setNewGuest($context->cookie);
        }

        // 5.4 LIAISON PANIER - Force les adresses et la secure_key
        $cart->id_customer = (int)$customer->id;
        $cart->secure_key = $customer->secure_key;

        // On lie automatiquement l'adresse par défaut si aucune n'est mise
        if (!$cart->id_address_delivery || $cart->id_address_delivery == 0) {
            $cart->id_address_delivery = (int)Address::getFirstCustomerAddressId($customer->id);
        }
        if (!$cart->id_address_invoice || $cart->id_address_invoice == 0) {
            $cart->id_address_invoice = (int)Address::getFirstCustomerAddressId($customer->id);
        }

        $cart->update();

        // 5.5 On force l'ID panier dans le cookie
        $context->cookie->id_cart = (int)$cart->id;
        $context->cart = $cart;

        // 5.6 HOOK D'AUTHENTIFICATION (Indispensable pour de nombreux modules)
        Hook::exec('actionAuthentication', array('customer' => $context->customer));

        // 5.7 Écriture physique
        $context->cookie->write();
    }
}
else {
    // Cas invité
    if (empty($context->cookie->id_guest)) {
        Guest::setNewGuest($context->cookie);
    }
    $context->cookie->id_cart = (int)$cart->id;
    $context->cookie->write();
}

// 6. Mode Debug
if ($debug) {
    echo "<h1>Debug SAS v3.1 (Brute Force)</h1>";
    echo "Cart ID: " . $cart->id . "<br>";
    echo "Customer ID (Panier): " . $cart->id_customer . "<br>";
    echo "Customer ID (Cookie): " . $context->cookie->id_customer . "<br>";
    echo "Logged in context: " . ($context->customer->id ? 'OUI' : 'NON') . "<br>";
    echo "Logged in cookie: " . ($context->cookie->logged ? 'OUI' : 'NON') . "<br>";
    echo "Address Delivery: " . $cart->id_address_delivery . "<br>";
    echo "Address Invoice: " . $cart->id_address_invoice . "<br>";
    echo "<hr>";
    echo "Session Symfony: " . (session_id() ?: 'N/A') . "<br>";
    exit;
}

// 7. Redirection finale sans cache
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");
header("Referrer-Policy: strict-origin-when-cross-origin");

Tools::redirect('index.php?controller=order');
exit;
