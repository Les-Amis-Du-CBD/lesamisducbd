
import RecruitmentClient from './RecruitmentClient';
import { kv } from '@vercel/kv';

export const metadata = {
    title: "Rejoignez l'équipe",
    description: "Carrières chez Les Amis du CBD. Nous recherchons des talents passionnés par le CBD et le commerce responsable. Postulez dès maintentant.",
    alternates: {
        canonical: '/recrutement',
    },
};

export const revalidate = 60;

export default async function RecrutementPage() {

    let globalContent = null;
    let content = null;

    try {
        const [gData, cData] = await Promise.all([
            kv.get('global_content'),
            kv.get('recrutement_content')
        ]);
        if (gData) globalContent = gData;
        if (cData) content = cData;
    } catch (e) {
        console.error('KV error (recrutement):', e);
    }

    return <RecruitmentClient globalContent={globalContent} content={content} />;
}
