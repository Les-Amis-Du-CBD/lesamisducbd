import QuiSommesNousClient from './QuiSommesNousClient';
import { SHARED_TITLE } from '@/app/shared-metadata';
import { kv } from '@vercel/kv';


export const metadata = {
    title: "Qui sommes-nous ?",
    description: "Découvrez l'histoire des Amis du CBD, nos valeurs, notre engagement pour la qualité et notre équipe basée en Ardèche.",
    alternates: {
        canonical: '/qui-sommes-nous',
    },
};

export default async function QuiSommesNousPage() {
    let globalContent = null;
    try {
        const globalData = await kv.get('global_content');
        if (globalData) globalContent = globalData;
    } catch (e) {
        console.error('KV error (qui-sommes-nous/global):', e);
    }
    return <QuiSommesNousClient globalContent={globalContent} />;
}

