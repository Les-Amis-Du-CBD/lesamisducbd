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
    let content = null;
    try {
        const globalData = await kv.get('global_content');
        if (globalData) globalContent = globalData;
        const pageData = await kv.get('content:usages');
        if (pageData) content = pageData;
    } catch (e) {
        console.error('KV error (usages/global):', e);
    }
    return <UsagesClient globalContent={globalContent} content={content} />;
}

