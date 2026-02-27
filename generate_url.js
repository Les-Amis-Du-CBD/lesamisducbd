const crypto = require('crypto');
const fs = require('fs');

const secretKey = 'LacBc67_9sP@!CBD2026_SecureKey';
const cartId = 123;
const customerId = 45;
const ts = Math.floor(Date.now() / 1000);
const payload = `${cartId}-${customerId}-${ts}`;
const sign = crypto.createHmac('sha256', secretKey).update(payload).digest('hex');

const url = `https://lesamisducbd.fr/sas.php?cart_id=${cartId}&id_customer=${customerId}&ts=${ts}&sign=${sign}`;

fs.writeFileSync('generated_url.txt', url);
console.log('done');
