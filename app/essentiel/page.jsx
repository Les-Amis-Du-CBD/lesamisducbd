import EssentielClient from './EssentielClient';
import { SHARED_TITLE } from '../shared-metadata';

export const metadata = {
    title: "L'Essentiel du CBD",
    description: "Tout savoir sur le CBD : bienfaits, législation, et nos guides pour choisir les produits adaptés à vos besoins. L'expertise Les Amis du CBD.",
    alternates: {
        canonical: '/essentiel',
    },
};

export default function EssentielPage() {
    return <EssentielClient />;
}
