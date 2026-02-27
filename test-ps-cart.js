require('dotenv').config({ path: '.env.local' });

async function testDirectCart() {
    const url = process.env.PRESTASHOP_API_URL;
    const key = process.env.PRESTASHOP_API_KEY;

    console.log("URL:", url, "KEY:", key ? "OK" : "MISSING");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
    <cart>
        <id_currency>1</id_currency>
        <id_lang>1</id_lang>
        <associations>
            <cart_rows>
                <cart_row>
                    <id_product>17</id_product>
                    <id_product_attribute>0</id_product_attribute>
                    <id_address_delivery>0</id_address_delivery>
                    <quantity>1</quantity>
                </cart_row>
            </cart_rows>
        </associations>
    </cart>
</prestashop>`;

    try {
        const finalUrl = `${url}/carts?ws_key=${key}&output_format=JSON`;
        console.log("POSTING to", finalUrl);

        const res = await fetch(finalUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/xml', 'Accept': 'application/json' },
            body: xml
        });

        const text = await res.text();
        console.log("STATUS:", res.status);
        console.log("RESPONSE:", text.substring(0, 500));
    } catch (e) {
        console.error("ERROR:", e);
    }
}

testDirectCart();
