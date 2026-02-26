import { kv } from '@vercel/kv';
import RecrutementEditor from './RecrutementEditor';

export const metadata = {
    title: 'Editeur Recrutement | Admin',
};

const DEFAULT_RECRUTEMENT_DATA = {
    hero: {
        title: "Intégrer l'équipe ?",
    },
    content: {
        title: "Rejoindre l'équipe\nLes Amis du CBD",
        text: "Les Amis du CBD, c'est avant tout une aventure humaine.\nUne équipe qui avance ensemble, avec des valeurs simples : transparence, exigence et proximité.\nNous ne recrutons pas en permanence, mais nous sommes toujours curieux de découvrir de nouveaux profils. Que vous veniez du terrain, du commerce, de la communication ou d'un tout autre horizon, les candidatures spontanées sont les bienvenues.\nSi vous partagez notre vision d'un CBD accessible, responsable et bien fait, n'hésitez pas à nous écrire.\nParfois, les meilleures collaborations commencent sans offre précise."
    },
    jobs: [], // { title: "Vendeur(se)", location: "Paris", type: "CDI", description: "Rejoignez notre boutique..." }
    contactCard: {
        title: "Envie d'en\nsavoir plus ?",
        text: "Un CV, une lettre de motivation ou simplement l'envie d'échanger ?\nContactez-nous, on vous répond avec plaisir."
    }
};

export default async function RecrutementContentPage() {
    let data = DEFAULT_RECRUTEMENT_DATA;
    try {
        const kvData = await kv.get('recrutement_content');
        if (kvData) {
            data = kvData;
            data.hero = kvData.hero || DEFAULT_RECRUTEMENT_DATA.hero;
            data.content = kvData.content || DEFAULT_RECRUTEMENT_DATA.content;
            data.jobs = kvData.jobs || [];
            data.contactCard = kvData.contactCard || DEFAULT_RECRUTEMENT_DATA.contactCard;
        }
    } catch (error) {
        console.error('KV Error (recrutement):', error);
    }

    return <RecrutementEditor initialData={data} />;
}
