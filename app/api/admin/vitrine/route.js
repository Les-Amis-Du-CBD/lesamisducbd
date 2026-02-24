import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

const VITRINE_KEY = 'vitrine_config';
const HIDDEN_KEY = 'hidden_products';
const ORDER_KEY = 'product_order';

export async function GET() {
    try {
        const [vitrine, hidden, order] = await Promise.all([
            kv.get(VITRINE_KEY),
            kv.get(HIDDEN_KEY),
            kv.get(ORDER_KEY)
        ]);
        return NextResponse.json({
            flowers: vitrine?.flowers || [],
            resins: vitrine?.resins || [],
            hiddenIds: Array.isArray(hidden) ? hidden : [],
            productOrder: Array.isArray(order) ? order : []
        });
    } catch (error) {
        console.error('[Vitrine API] GET error:', error);
        return NextResponse.json({ flowers: [], resins: [], hiddenIds: [] });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();

        if (!body) {
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        }

        const ops = [];

        // Save vitrine config (flowers + resins featured on homepage)
        if (Array.isArray(body.flowers) || Array.isArray(body.resins)) {
            ops.push(kv.set(VITRINE_KEY, {
                flowers: Array.isArray(body.flowers) ? body.flowers : [],
                resins: Array.isArray(body.resins) ? body.resins : [],
            }));
        }

        // Save hidden product IDs (excluded from /produits listing)
        if (Array.isArray(body.hiddenIds)) {
            ops.push(kv.set(HIDDEN_KEY, body.hiddenIds));
        }

        // Save custom product display order
        if (Array.isArray(body.productOrder)) {
            ops.push(kv.set(ORDER_KEY, body.productOrder));
        }

        await Promise.all(ops);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[Vitrine API] POST error:', error);
        return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
    }
}
