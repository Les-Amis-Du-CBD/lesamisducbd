import QuiSommesNousClient from './QuiSommesNousClient';
import { SHARED_TITLE } from '@/app/shared-metadata';

export const metadata = {
    title: "Qui sommes-nous ?",
    description: "Découvrez l'histoire des Amis du CBD, nos valeurs, notre engagement pour la qualité et notre équipe basée en Ardèche.",
    alternates: {
        canonical: '/qui-sommes-nous',
    },
};

export default function QuiSommesNousPage() {
    return <QuiSommesNousClient />;
}
