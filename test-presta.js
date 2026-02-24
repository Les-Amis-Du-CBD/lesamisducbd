const fs = require('fs');

async function testPresta() {
    try {
        const url = 'https://lesamisducbd.fr/api/products?display=full&output_format=JSON';
        const auth = Buffer.from('A71ZSF7AV89ZG3K84NPH6M83DAV81LQC:').toString('base64');

        console.log('Fetching', url);
        const res = await fetch(url, {
            headers: {
                'Authorization': `Basic ${auth}`
            }
        });

        if (!res.ok) {
            console.error('Response Error:', res.status, res.statusText);
            const text = await res.text();
            console.error(text);
            return;
        }

        const data = await res.json();
        console.log('Success!');
        console.log(JSON.stringify(data.products?.[0] || data, null, 2).substring(0, 1500));
    } catch (err) {
        console.error('Fetch Error:', err);
    }
}

testPresta();
