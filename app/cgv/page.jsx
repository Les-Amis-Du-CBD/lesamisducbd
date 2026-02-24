import CgvClient from './CgvClient';
import { kv } from '@vercel/kv';

export const metadata = {
    title: 'Conditions Générales de Vente | Les Amis du CBD',
    description: 'Consultez les Conditions Générales de Vente (CGV) de la boutique Les Amis du CBD.',
};

export default async function CgvPage() {
    let globalContent = null;
    try {
        const data = await kv.get('global_content');
        if (data) globalContent = data;
    } catch (e) {
        console.error('KV error (cgv):', e);
    }

    return <CgvClient globalContent={globalContent} />;
}
