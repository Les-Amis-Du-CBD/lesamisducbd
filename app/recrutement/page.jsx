import RecruitmentClient from './RecruitmentClient';
import { SHARED_TITLE } from '@/app/shared-metadata';

export const metadata = {
    title: "Rejoignez l'équipe",
    description: "Carrières chez Les Amis du CBD. Nous recherchons des talents passionnés par le CBD et le commerce responsable. Postulez dès maintentant.",
    alternates: {
        canonical: '/recrutement',
    },
};

export default function RecrutementPage() {
    return <RecruitmentClient />;
}
