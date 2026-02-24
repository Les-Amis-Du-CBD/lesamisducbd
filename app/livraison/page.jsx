import LivraisonClient from './LivraisonClient';
import { kv } from '@vercel/kv';

export const metadata = {
    title: 'Livraison | Les Amis du CBD',
    description: 'Découvrez notre processus de livraison, de la commande à la réception de votre colis. Expédition rapide et discrète.',
};

export default async function LivraisonPage() {
    let globalContent = null;
    try {
        const data = await kv.get('global_content');
        if (data) globalContent = data;
    } catch (e) {
        console.error('KV error (livraison):', e);
    }

    return <LivraisonClient globalContent={globalContent} />;
}
