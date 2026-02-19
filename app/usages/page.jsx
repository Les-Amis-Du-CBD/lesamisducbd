import UsagesClient from './UsagesClient';
import { SHARED_TITLE } from '@/app/shared-metadata';

export const metadata = {
    title: "CBD & Usages",
    description: "Comment consommer le CBD ? Guides d'utilisation pour les fleurs, huiles et infusions. Conseils d'experts pour une expérience optimale.",
    alternates: {
        canonical: '/usages',
    },
};

export default function UsagesPage() {
    return <UsagesClient />;
}
