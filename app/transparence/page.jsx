import TransparenceClient from './TransparenceClient';
import { kv } from '@vercel/kv';

export const metadata = {
    title: 'Transparence et Analyses | Les Amis du CBD',
    description: 'Découvrez notre engagement envers la qualité et consultez les résultats de nos analyses en laboratoire.',
};

export default async function TransparencePage() {
    let globalContent = null;
    try {
        const data = await kv.get('global_content');
        if (data) globalContent = data;
    } catch (e) {
        console.error('KV error (transparence):', e);
    }

    return <TransparenceClient globalContent={globalContent} />;
}
