import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

const PARTNERS_KEY = 'partners_locations';

export async function GET() {
    try {
        const partners = await kv.get(PARTNERS_KEY) || [];
        return NextResponse.json(partners);
    } catch (error) {
        console.error('[API/Partners] Get error:', error);
        return NextResponse.json({ error: 'Failed to fetch partners' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { id, name, address, zip, city, lat, lng } = await request.json();

        if (!name || !address || !zip || !city || lat === undefined || lng === undefined) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        let partners = await kv.get(PARTNERS_KEY) || [];

        if (id) {
            // Update
            partners = partners.map(p => p.id === id ? { id, name, address, zip, city, lat, lng } : p);
        } else {
            // Create
            const newPartner = {
                id: Date.now().toString(),
                name,
                address,
                zip,
                city,
                lat,
                lng
            };
            partners.push(newPartner);
        }

        await kv.set(PARTNERS_KEY, partners);
        return NextResponse.json({ success: true, partners });
    } catch (error) {
        console.error('[API/Partners] Post error:', error);
        return NextResponse.json({ error: 'Failed to save partner' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }

        let partners = await kv.get(PARTNERS_KEY) || [];
        partners = partners.filter(p => p.id !== id);

        await kv.set(PARTNERS_KEY, partners);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[API/Partners] Delete error:', error);
        return NextResponse.json({ error: 'Failed to delete partner' }, { status: 500 });
    }
}
