import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

const PAGE_KEY = 'content:usages';

export async function GET() {
    try {
        const data = await kv.get(PAGE_KEY) || {};
        return NextResponse.json(data);
    } catch (error) {
        console.error(`[API] Erreur GET ${PAGE_KEY}:`, error);
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        // Authenticate admin request
        const token = req.cookies.get('admin_token')?.value;
        if (!token) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        const decoded = await verifyToken(token);
        if (!decoded || decoded.role !== 'admin') {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const body = await req.json();

        // Retrieve existing and merge
        const existingData = await kv.get(PAGE_KEY) || {};
        const mergedData = { ...existingData, ...body };

        // Save
        await kv.set(PAGE_KEY, mergedData);

        return NextResponse.json({ success: true, data: mergedData });
    } catch (error) {
        console.error(`[API] Erreur POST ${PAGE_KEY}:`, error);
        return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
    }
}
