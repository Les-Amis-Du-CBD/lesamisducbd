import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function POST(req) {
    try {
        const data = await req.json();

        if (!data) {
            return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
        }

        await kv.set('transparence_content', data);

        return NextResponse.json({ success: true, message: 'Page Transparence sauvegardée' }, { status: 200 });
    } catch (error) {
        console.error('Erreur API /admin/content/transparence', error);
        return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
    }
}
