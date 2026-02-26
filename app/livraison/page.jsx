
import LivraisonClient from './LivraisonClient';
import { kv } from '@vercel/kv';

export const metadata = {
    title: 'Livraison et Expédition | Les Amis du CBD',
    description: 'Découvrez nos méthodes d\'expédition, nos délais de livraison rapides et nos garanties de discrétion.',
};

export const revalidate = 60;

export default async function LivraisonPage() {

    let globalContent = null;
    let content = null;

    try {
        const [gData, cData] = await Promise.all([
            kv.get('global_content'),
            kv.get('livraison_content')
        ]);
        if (gData) globalContent = gData;
        if (cData) content = cData;
    } catch (e) {
        console.error('KV error (livraison):', e);
    }

    return <LivraisonClient globalContent={globalContent} content={content} />;
}
