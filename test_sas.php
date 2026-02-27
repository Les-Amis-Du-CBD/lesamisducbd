<?php
$cart_id = 123;
$id_customer = 45;
$ts = time();
$secret_key = 'LacBc67_9sP@!CBD2026_SecureKey';
$payload = $cart_id . '-' . $id_customer . '-' . $ts;
$sign = hash_hmac('sha256', $payload, $secret_key);

$url = "https://lesamisducbd.fr/sas.php?cart_id=$cart_id&id_customer=$id_customer&ts=$ts&sign=$sign";
echo "Testing URL: $url\n\n";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HEADER, 1);
// Follow redirects so we can see where it ends up, but we want to see the headers of the first request
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 0);

$response = curl_exec($ch);
curl_close($ch);

echo $response;
?>
