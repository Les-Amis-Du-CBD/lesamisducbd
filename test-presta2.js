const fs = require('fs');

async function checkDetails() {
    try {
        const url = 'https://lesamisducbd.fr/api/products?display=full&output_format=JSON&limit=1';
        const auth = Buffer.from('A71ZSF7AV89ZG3K84NPH6M83DAV81LQC:').toString('base64');

        console.log('Fetching', url);
        const res = await fetch(url, {
            headers: { 'Authorization': `Basic ${auth}` }
        });

        const data = await res.json();
        const p = data.products?.[0];
        if (!p) {
            console.log('No product found');
            return;
        }

        // Check languages structure for name & description
        console.log('--- PRODUCT DATA ---');
        console.log('ID:', p.id);
        console.log('Price:', p.price);
        console.log('Name:', JSON.stringify(p.name, null, 2));
        console.log('Link Rewrite:', JSON.stringify(p.link_rewrite, null, 2));
        console.log('Description:', JSON.stringify(p.description, null, 2));
        console.log('Image ID:', p.id_default_image);
    } catch (e) {
        console.error(e);
    }
}

checkDetails();
