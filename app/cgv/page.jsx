
import CgvClient from './CgvClient';
import { kv } from '@vercel/kv';

export const metadata = {
    title: 'Conditions Générales de Vente | Les Amis du CBD',
    description: 'Consultez les Conditions Générales de Vente (CGV) de la boutique Les Amis du CBD.',
};

export const revalidate = 60;

export default async function CgvPage() {

    let globalContent = null;
    let content = null;

    try {
        const [gData, cData] = await Promise.all([
            kv.get('global_content'),
            kv.get('cgv_content')
        ]);
        if (gData) globalContent = gData;
        if (cData) content = cData;
    } catch (e) {
        console.error('KV error (cgv):', e);
    }

    return <CgvClient globalContent={globalContent} content={content} />;
}
