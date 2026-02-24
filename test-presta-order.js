require('dotenv').config({ path: '.env.local' });

async function run() {
    const url = process.env.PRESTASHOP_API_URL;
    const key = process.env.PRESTASHOP_API_KEY;

    // Use the IDs from the logs
    const addressId = 1027;
    const cartId = 5530;
    const customerId = 840;
    const totalPaid = 20.00;

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
    <order>
        <id_address_delivery>${addressId}</id_address_delivery>
        <id_address_invoice>${addressId}</id_address_invoice>
        <id_cart>${cartId}</id_cart>
        <id_currency>1</id_currency>
        <id_lang>1</id_lang>
        <id_customer>${customerId}</id_customer>
        <id_carrier>1</id_carrier>
        <current_state>10</current_state>
        <module><![CDATA[wirepayment]]></module>
        <payment><![CDATA[Virement bancaire]]></payment>
        <total_paid>${totalPaid}</total_paid>
        <total_paid_real>${totalPaid}</total_paid_real>
        <total_products>${totalPaid}</total_products>
        <total_products_wt>${totalPaid}</total_products_wt>
        <conversion_rate>1.000000</conversion_rate>
    </order>
</prestashop>`;

    const finalUrl = `${url}/orders?ws_key=${key}&output_format=JSON&display_errors=1`;
    console.log('Posting to', finalUrl);

    try {
        const res = await fetch(finalUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/xml', 'Accept': 'application/json' },
            body: xml
        });
        const text = await res.text();
        console.log('Status:', res.status);
        console.log('Response:', text);
    } catch (e) {
        console.error(e);
    }
}
run();
