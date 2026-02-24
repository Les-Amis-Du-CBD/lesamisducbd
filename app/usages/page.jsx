import UsagesClient from './UsagesClient';
import { SHARED_TITLE } from '@/app/shared-metadata';
import { kv } from '@vercel/kv';


export const metadata = {
    title: "CBD & Usages",
    description: "Comment consommer le CBD ? Guides d'utilisation pour les fleurs, huiles et infusions. Conseils d'experts pour une expérience optimale.",
    alternates: {
        canonical: '/usages',
    },
};

export default async function UsagesPage() {
    let globalContent = null;
    try {
        const globalData = await kv.get('global_content');
        if (globalData) globalContent = globalData;
    } catch (e) {
        console.error('KV error (usages/global):', e);
    }
    return <UsagesClient globalContent={globalContent} />;
}

