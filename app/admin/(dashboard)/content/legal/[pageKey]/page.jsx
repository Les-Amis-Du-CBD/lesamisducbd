import { kv } from '@vercel/kv';
import LegalEditor from './LegalEditor';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
    const { pageKey } = await params;
    return { title: `Editeur ${pageKey.toUpperCase()} | Admin` };
}

const DEFAULT_MAP = {
    cgv: { hero: { title: "CGV", subtitle: "Conditions Générales de Vente" }, markdown: "" },
    livraison: { hero: { title: "Livraison", subtitle: "Informations sur l'expédition" }, markdown: "" },
    privacy: { hero: { title: "Confidentialité", subtitle: "Traitement de vos données" }, markdown: "" }
};

export default async function LegalContentPage({ params }) {
    const { pageKey } = await params;

    if (!DEFAULT_MAP[pageKey]) {
        notFound();
    }

    let data = DEFAULT_MAP[pageKey];

    try {
        const kvData = await kv.get(`${pageKey}_content`);
        if (kvData) {
            data = kvData;
            // Backwards compat if a field is missing
            data.hero = kvData.hero || DEFAULT_MAP[pageKey].hero;
            data.markdown = kvData.markdown || "";
        }
    } catch (error) {
        console.error(`KV Error (legal page ${pageKey}):`, error);
    }

    return <LegalEditor pageKey={pageKey} initialData={data} />;
}
