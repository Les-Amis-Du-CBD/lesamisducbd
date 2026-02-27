require('dotenv').config({ path: '.env.local' });

async function testFetchCustomer() {
    const url = process.env.PRESTASHOP_API_URL;
    const key = process.env.PRESTASHOP_API_KEY;
    const testEmail = 'karmazoldick@gmail.com'; // Try to find an existing user or use a dummy

    try {
        const fetchUrl = `${url}/customers?ws_key=${key}&output_format=JSON&display=full`;
        const res = await fetch(fetchUrl);
        const data = await res.json();
        console.log(JSON.stringify(data.customers.slice(0, 2), null, 2));
    } catch (e) {
        console.error("ERROR:", e);
    }
}

testFetchCustomer();
