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
$signature = Tools::getValue('sign');

if (!$cart_id || !$signature) {
    die('Paramètres manquants.');
}

// 2. Vérification de sécurité (empêche le scan et le vol de paniers)
// On recrée la signature attendue
$expected_signature = md5($cart_id . $secret_key);

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

// 4. Forcer l'assignation de ce panier au visiteur actuel
$context = Context::getContext();
$context->cookie->id_cart = (int)$cart->id;

// Si le client est connecté sur PrestaShop, on s'assure que le panier lui est lié
if ($context->customer->id) {
    $cart->id_customer = $context->customer->id;
    $cart->save();
}

$context->cookie->write();

// 5. Redirection finale vers le tunnel de commande (sas)
// Cela dépend du module de checkout utilisé. Par défaut c'est controller=order
Tools::redirect('index.php?controller=order');
exit;
