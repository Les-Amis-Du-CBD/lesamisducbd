import RecruitmentClient from './RecruitmentClient';
import { SHARED_TITLE } from '@/app/shared-metadata';
import { kv } from '@vercel/kv';


export const metadata = {
    title: "Rejoignez l'équipe",
    description: "Carrières chez Les Amis du CBD. Nous recherchons des talents passionnés par le CBD et le commerce responsable. Postulez dès maintentant.",
    alternates: {
        canonical: '/recrutement',
    },
};

export default async function RecrutementPage() {
    let globalContent = null;
    try {
        const globalData = await kv.get('global_content');
        if (globalData) globalContent = globalData;
    } catch (e) {
        console.error('KV error (recrutement/global):', e);
    }
    return <RecruitmentClient globalContent={globalContent} />;
}

