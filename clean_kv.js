require('dotenv').config({ path: '.env.local' });
const { createClient } = require('redis');

async function clean() {
    console.log("Connexion à Redis...");
    const client = createClient({
        url: process.env.REDIS_URL
    });

    client.on('error', (err) => console.log('Redis Client Error', err));

    await client.connect();

    console.log("Suppression de la clé home_content...");
    await client.del('home_content');

    console.log("Clé supprimée avec succès !");
    await client.disconnect();
}

clean().catch(console.error);
