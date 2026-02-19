import BuralisteClient from './BuralisteClient';
import { SHARED_TITLE } from '@/app/shared-metadata';

export const metadata = {
    title: 'Espace Buraliste & Revendeurs',
    description: 'Devenez partenaire des Amis du CBD. Offres exclusives pour buralistes et professionnels : produits premium, marges attractives et accompagnement personnalisé.',
    alternates: {
        canonical: '/buraliste',
    },
};

export default function BuralistePage() {
    return <BuralisteClient />;
}
