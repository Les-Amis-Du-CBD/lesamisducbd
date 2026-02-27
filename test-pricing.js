require('dotenv').config({ path: '.env.local' });

async function testPricing() {
    const url = process.env.PRESTASHOP_API_URL;
    const key = process.env.PRESTASHOP_API_KEY;

    try {
        console.log("Fetching specific prices...");
        const resList = await fetch(`${url}/specific_prices?ws_key=${key}&output_format=JSON&display=full`);
        const dataList = await resList.json();
        console.log(JSON.stringify(dataList, null, 2));
    } catch (e) {
        console.error("ERROR:", e);
    }
}

testPricing();
