<?php
/**
 * Fichier SAS de paiement - Les Amis du CBD
 * Ce script permet de réceptionner un panier créé par Next.js via API
 * et de rediriger le visiteur vers le tunnel de commande PrestaShop de manière sécurisée.
 */

require(dirname(__FILE__) . '/config/config.inc.php');
require(dirname(__FILE__) . '/init.php');

// 1. Clé secrète partagée avec Next.js (Doit être identique à celle dans le .env.local de Next.js)
$secret_key = 'LacBc67_9sP@!CBD2026_SecureKey';


$cart_id = (int)Tools::getValue('cart_id');
$id_customer = (int)Tools::getValue('id_customer');
$signature = Tools::getValue('sign');

if (!$cart_id || !$signature) {
    die('Paramètres manquants.');
}

// 2. Vérification de sécurité (empêche le scan et le vol de paniers)
// On recrée la signature attendue. Format: md5(cart_id-id_customerSecretKey)
$expected_signature = md5($cart_id . '-' . $id_customer . $secret_key);

if ($signature !== $expected_signature) {
    header('HTTP/1.0 403 Forbidden');
    die('Accès refusé ou lien expiré (Signature invalide).');
}

// 3. Charger le panier PrestaShop correspondant
$cart = new Cart($cart_id);

if (!Validate::isLoadedObject($cart)) {
    header('HTTP/1.0 404 Not Found');
    die('Panier introuvable sur le serveur.');
}

$context = Context::getContext();

// 4. Si un id_customer est fournit depuis Next.js, on connecte ce client de force
if ($id_customer > 0) {
    $customer = new Customer($id_customer);
    if (Validate::isLoadedObject($customer)) {
        // Authentification programmatique PrestaShop
        $context->customer = $customer;
        $context->cookie->id_customer = (int)$customer->id;
        $context->cookie->customer_lastname = $customer->lastname;
        $context->cookie->customer_firstname = $customer->firstname;
        $context->cookie->logged = 1;
        $context->cookie->passwd = $customer->passwd;
        $context->cookie->email = $customer->email;
        $context->cookie->is_guest = $customer->is_guest;

        // Mettre à jour le panier pour ce client
        $cart->id_customer = $customer->id;
        // Si le panier était configuré pour l'invité, on s'assure qu'il passe au client
        $cart->update();
    }
}

// 5. Assigner ce panier au visiteur actuel (qu'il soit connecté ou invité)
$context->cookie->id_cart = (int)$cart->id;

// Si le client est connecté sur la session (au cas où il l'était déjà indépendamment), on lie le panier
if ($context->customer->id && !$id_customer) {
    $cart->id_customer = $context->customer->id;
    $cart->save();
}

$context->cookie->write();

// 6. Redirection finale vers le tunnel de commande (sas)
// Cela dépend du module de checkout utilisé. Par défaut c'est controller=order
Tools::redirect('index.php?controller=order');
exit;
