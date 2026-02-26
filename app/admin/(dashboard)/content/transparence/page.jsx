import { kv } from '@vercel/kv';
import TransparenceEditor from './TransparenceEditor';

export const metadata = {
    title: 'Editeur Transparence | Admin',
};

// Based on the user's hardcoded data in TransparenceClient.jsx
const DEFAULT_TRANSPARENCE_DATA = {
    hero: {
        title: "Transparence",
        subtitle: "La qualité sans compromis."
    },
    quote: {
        text: "Nous, Les Amis du CBD sommes de vrais passionnés du cannabis !\nOr nous étions extrêmement déçus de voir le marché français inondé par des produits de qualité médiocre, vendus bien souvent à des prix délirants !\nNous nous sommes donc mis au travail, et nous avons été surpris de voir ce qui était possible.",
        author: "Nelson - Les Amis du CBD"
    },
    section1: {
        title: "Meilleure qualité",
        col1: {
            title: "Culture 100 % naturelle",
            text: "Nos plantes sont cultivées en serre sur sol vivant :\n- Ni engrais chimiques, ni pesticides ou insecticides.\n- Sous la lumière naturelle du soleil.\n- Boostées seulement avec des engrais organiques type compost et guano de chauve-souris."
        },
        col2: {
            title: "< 0,3% de THC, sans lavage !",
            text: "Point essentiel pour la qualité finale, nos fleurs ont naturellement moins de 0,3% de THC.\nElles n'ont donc pas besoin de \"lavage\" avec des produits chimiques afin de baisser le taux de THC.\nAinsi, nous préservons la couleur, les arômes et les parfums originaux."
        }
    },
    section2: {
        title: "Moins cher",
        col1: {
            title: "Le naturel, c'est gratuit !",
            text: "Comme nos fleurs sont cultivées naturellement, nous économisons :\n- Pas d'engrais ou d'autres produits chimiques coûteux.\n- Pas de matériel hi-tech (ni système hydroponique, ni éclairage artificiel).\n- Pas de facture d'électricité.\n- Pas de \"lavage\" chimique pour baisser le taux de THC.\n- Donc pas besoin de parfumer artificiellement les plantes par la suite."
        },
        col2: {
            title: "Simplicité :",
            text: "Nous comptons sur la quantité et nous pratiquons des marges raisonnables.\nAvec Les Amis du CBD, vous n'avez pas 200 références.\nSeulement 4 variétés au top, disponibles en 4 ou 10 grammes !\nAinsi :\n- La gestion de vos stocks est plus facile.\n- Vos commandes sont rapides à faire,\n- Vous proposez un prix imbattable que cela soit vis-à-vis de vos concurrents locaux, comme de la concurrence en ligne !"
        }
    },
    certificats: [
        { src: '/images/transparence/ak47.png', alt: 'Analyse AK-47 CBD', label: 'AK-47 CBD = 7,5%' },
        { src: '/images/transparence/amnesia.png', alt: 'Analyse AMNÉSIA CBD', label: 'AMNÉSIA CBD = 7%' },
        { src: '/images/transparence/remedy.png', alt: 'Analyse REMEDY CBD', label: 'REMEDY CBD = 9%' },
        { src: '/images/transparence/superskunk.png', alt: 'Analyse SUPER SKUNK CBD', label: 'SUPER SKUNK CBD = 12%' },
        { src: '/images/transparence/gorillaglue.jpg', alt: 'Analyse GORILLA GLUE CBD', label: 'GORILLA GLUE CBD = 10%' },
    ]
};

export default async function TransparenceContentPage() {
    let data = DEFAULT_TRANSPARENCE_DATA;
    try {
        const kvData = await kv.get('transparence_content');
        if (kvData) {
            data = kvData;
            // Ensure backwards compatibility with old KV records if missing section fields
            data.hero = kvData.hero || DEFAULT_TRANSPARENCE_DATA.hero;
            data.quote = kvData.quote || DEFAULT_TRANSPARENCE_DATA.quote;
            data.section1 = kvData.section1 || DEFAULT_TRANSPARENCE_DATA.section1;
            data.section2 = kvData.section2 || DEFAULT_TRANSPARENCE_DATA.section2;
            data.certificats = kvData.certificats || DEFAULT_TRANSPARENCE_DATA.certificats;
        }
    } catch (error) {
        console.error('KV Error (transparence):', error);
    }

    return <TransparenceEditor initialData={data} />;
}
