<?php
/**
 * Fichier SAS de paiement Sécurisé v4.3 - Les Amis du CBD
 * Passerelle Headless Next.js -> PrestaShop 8 (Auto-Diagnostic)
 */

ini_set('display_errors', 0);
error_reporting(E_ALL);

require(dirname(__FILE__) . '/config/config.inc.php');
require(dirname(__FILE__) . '/init.php');

$secret_key = 'LacBc67_9sP@!CBD2026_SecureKey';

$cart_id = (int)Tools::getValue('cart_id');
$id_customer = (int)Tools::getValue('id_customer');
$ts = (int)Tools::getValue('ts');
$signature = Tools::getValue('sign');
$debug = (int)Tools::getValue('debug');

if ($debug) {
    ini_set('display_errors', 1);
}

if (!$cart_id || !$signature || !$ts) {
    header('HTTP/1.0 400 Bad Request');
    die('Erreur : Paramètres de sécurité manquants.');
}

if (time() > ($ts + 1800)) {
    header('HTTP/1.0 403 Forbidden');
    die('Erreur : Le lien de paiement a expiré.');
}

$payload = $cart_id . '-' . $id_customer . '-' . $ts;
$expected_signature = hash_hmac('sha256', $payload, $secret_key);

if (!hash_equals($expected_signature, $signature)) {
    header('HTTP/1.0 403 Forbidden');
    die('Erreur : Signature de sécurité invalide.');
}

$context = Context::getContext();

if (!Validate::isLoadedObject($context->shop)) {
    $context->shop = new Shop((int)Configuration::get('PS_SHOP_DEFAULT'));
}

if ($id_customer > 0) {
    $customer = new Customer($id_customer);
    if (Validate::isLoadedObject($customer)) {
        $context->cookie->logout();
        $context->customer = $customer;
        $context->updateCustomer($customer);
        $context->cookie->id_customer = (int)$customer->id;
        $context->cookie->customer_lastname = $customer->lastname;
        $context->cookie->customer_firstname = $customer->firstname;
        $context->cookie->logged = 1;
        $context->cookie->passwd = $customer->passwd;
        $context->cookie->email = $customer->email;
        $context->cookie->is_guest = $customer->is_guest;
        if (empty($context->cookie->id_guest)) {
            Guest::setNewGuest($context->cookie);
        }
    }
}
else {
    if (empty($context->cookie->id_guest)) {
        Guest::setNewGuest($context->cookie);
    }
}

$cart = new Cart($cart_id);
if (Validate::isLoadedObject($cart)) {
    if ($id_customer > 0) {
        $cart->id_customer = (int)$id_customer;
        $customer = new Customer($id_customer);
        $cart->secure_key = $customer->secure_key;
    }
    $cart->id_guest = (int)$context->cookie->id_guest;
    $cart->id_shop = (int)$context->shop->id;
    $cart->id_lang = (int)$context->language->id;
    if (!$cart->id_address_delivery || $cart->id_address_delivery == 0) {
        $cart->id_address_delivery = (int)Address::getFirstCustomerAddressId($id_customer);
    }
    if (!$cart->id_address_invoice || $cart->id_address_invoice == 0) {
        $cart->id_address_invoice = (int)Address::getFirstCustomerAddressId($id_customer);
    }
    $cart->update();
    $context->cart = $cart;
    $context->cookie->id_cart = (int)$cart->id;
}

$context->cookie->write();

if ($debug) {
    echo "<h1>Debug SAS v4.3 (Auto-Diagnostic)</h1>";
    echo "<h3>Configuration Serveur :</h3>";
    echo "HTTP_HOST: " . $_SERVER['HTTP_HOST'] . "<br>";
    echo "Shop Domain: " . Configuration::get('PS_SHOP_DOMAIN') . "<br>";
    echo "SSL Domain: " . Configuration::get('PS_SHOP_DOMAIN_SSL') . "<br>";
    echo "Check IP on Cookie: " . (Configuration::get('PS_COOKIE_CHECK_IP') ? 'OUI (A RISQUE)' : 'NON (OK)') . "<br>";
    echo "<hr>";
    echo "<h3>Session :</h3>";
    echo "Cookie Logged: " . ($context->cookie->logged ? 'OUI' : 'NON') . "<br>";
    echo "Context Customer ID: " . ($context->customer->id ?? 'AUCUN') . "<br>";
    echo "Context Cart ID: " . ($context->cart->id ?? 'AUCUN') . "<br>";
    echo "<hr>";
    echo "<a href='index.php?controller=order' style='font-size:20px;'>=> ALLER AU TUNNEL</a>";
    exit;
}

header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");
header("Location: " . __PS_BASE_URI__ . "commande", true, 303);
exit;
