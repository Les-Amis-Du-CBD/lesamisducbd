import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";

export const dynamic = 'force-dynamic';

// Country ID mapping for France (most common) and key European countries
// PrestaShop uses numeric IDs for countries
const COUNTRY_IDS = {
    'FR': 8,   // France
    'BE': 3,   // Belgique
    'CH': 19,  // Suisse
    'LU': 12,  // Luxembourg
    'DE': 1,   // Allemagne
    'ES': 6,   // Espagne
    'IT': 10,  // Italie
    'NL': 13,  // Pays-Bas
    'PT': 17,  // Portugal
    'GB': 7,   // Royaume-Uni
};

// Helper to get country code from PrestaShop country ID
const COUNTRY_CODES = Object.fromEntries(Object.entries(COUNTRY_IDS).map(([k, v]) => [v, k]));

async function getCustomerIds(prestaUrl, prestaKey, email) {
    const res = await fetch(`${prestaUrl}/customers?ws_key=${prestaKey}&output_format=JSON&display=full&filter[email]=${encodeURIComponent(email)}`);
    const data = await res.json();
    return data?.customers?.map(c => ({ id: c.id, email: c.email })) || [];
}

// GET — Fetch all addresses for the logged-in user from PrestaShop
export async function GET(request) {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
        }

        const prestaUrl = process.env.PRESTASHOP_API_URL;
        const prestaKey = process.env.PRESTASHOP_API_KEY;

        const customers = await getCustomerIds(prestaUrl, prestaKey, session.user.email);
        if (!customers.length) return NextResponse.json({ success: true, addresses: [] });

        // Fetch addresses for all customer IDs (in case of duplicates)
        const promises = customers.map(c =>
            fetch(`${prestaUrl}/addresses?ws_key=${prestaKey}&output_format=JSON&display=full&filter[id_customer]=${c.id}`)
                .then(r => r.json()).catch(() => null)
        );
        const results = await Promise.all(promises);

        let allAddresses = [];
        results.forEach(data => {
            if (data?.addresses?.length) allAddresses = [...allAddresses, ...data.addresses];
        });

        // Map Presta fields to our frontend model, filtering out soft-deleted addresses
        // Note: PrestaShop returns deleted as a number (1), not a string ('1')
        const mapped = allAddresses
            .filter(a => Number(a.deleted) !== 1)
            .map(a => ({
                ps_id: a.id,
                alias: a.alias || 'Domicile',
                firstname: a.firstname,
                lastname: a.lastname,
                company: a.company || '',
                vat_number: a.vat_number || '',
                address1: a.address1,
                address2: a.address2 || '',
                postcode: a.postcode,
                city: a.city,
                country_code: COUNTRY_CODES[parseInt(a.id_country)] || 'FR',
                phone: a.phone || a.phone_mobile || '',
            }));

        return NextResponse.json({ success: true, addresses: mapped });

    } catch (error) {
        console.error("[api/user/addresses GET] Error:", error);
        return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
    }
}

// POST — Create a new address in PrestaShop for the logged-in user
export async function POST(request) {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
        }

        const body = await request.json();
        const { alias, firstname, lastname, company, vat_number, address1, address2, postcode, city, country_code, phone } = body;

        if (!address1 || !postcode || !city) {
            return NextResponse.json({ success: false, error: "Champs obligatoires manquants" }, { status: 400 });
        }

        const prestaUrl = process.env.PRESTASHOP_API_URL;
        const prestaKey = process.env.PRESTASHOP_API_KEY;

        const customers = await getCustomerIds(prestaUrl, prestaKey, session.user.email);
        if (!customers.length) {
            return NextResponse.json({ success: false, error: "Compte PrestaShop introuvable" }, { status: 404 });
        }

        // Use the first (most recent) customer ID
        const customerId = customers[customers.length - 1].id;
        const countryId = COUNTRY_IDS[country_code] || 8; // Default to France

        // Build name parts
        const nameParts = ((session.user.name || '').trim()).split(' ');
        const safeFirstname = firstname || nameParts[0] || 'Client';
        const safeLastname = lastname || nameParts.slice(1).join(' ') || session.user.name || 'CBD';

        const xmlBody = `<?xml version="1.0" encoding="UTF-8"?>
<prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
<address>
    <id_customer>${customerId}</id_customer>
    <id_country>${countryId}</id_country>
    <alias>${(alias || 'Domicile').replace(/[<>&'"]/g, '')}</alias>
    <lastname>${safeLastname.replace(/[<>&'"]/g, '')}</lastname>
    <firstname>${safeFirstname.replace(/[<>&'"]/g, '')}</firstname>
    <company>${(company || '').replace(/[<>&'"]/g, '')}</company>
    <vat_number>${(vat_number || '').replace(/[<>&'"]/g, '')}</vat_number>
    <address1>${address1.replace(/[<>&'"]/g, '')}</address1>
    <address2>${(address2 || '').replace(/[<>&'"]/g, '')}</address2>
    <postcode>${postcode.replace(/[<>&'"]/g, '')}</postcode>
    <city>${city.replace(/[<>&'"]/g, '')}</city>
    <phone>${(phone || '').replace(/[<>&'"]/g, '')}</phone>
</address>
</prestashop>`;

        const res = await fetch(`${prestaUrl}/addresses?ws_key=${prestaKey}&output_format=JSON`, {
            method: 'POST',
            headers: { 'Content-Type': 'text/xml' },
            body: xmlBody
        });

        const data = await res.json();

        if (data?.address?.id) {
            return NextResponse.json({ success: true, ps_id: data.address.id });
        } else {
            console.error("[api/user/addresses POST] PrestaShop error:", JSON.stringify(data));
            return NextResponse.json({ success: false, error: "Erreur lors de la création de l'adresse" }, { status: 500 });
        }

    } catch (error) {
        console.error("[api/user/addresses POST] Error:", error);
        return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
    }
}

// PUT — Update an existing address by deleting and recreating it
export async function PUT(request) {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
        }

        const body = await request.json();
        const { ps_id, ...addressData } = body;

        if (!ps_id) {
            return NextResponse.json({ success: false, error: "ID adresse manquant" }, { status: 400 });
        }

        const prestaUrl = process.env.PRESTASHOP_API_URL;
        const prestaKey = process.env.PRESTASHOP_API_KEY;

        // Delete old address first
        await fetch(`${prestaUrl}/addresses/${ps_id}?ws_key=${prestaKey}`, { method: 'DELETE' });

        // Create new one via the POST handler logic — call our own POST internally
        const newRequest = new Request(request.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(addressData)
        });
        // Re-use session logic by calling the same API
        const customers = await getCustomerIds(prestaUrl, prestaKey, session.user.email);
        const customerId = customers[customers.length - 1]?.id;
        const countryId = COUNTRY_IDS[addressData.country_code] || 8;
        const nameParts = ((session.user.name || '').trim()).split(' ');
        const safeFirstname = addressData.firstname || nameParts[0] || 'Client';
        const safeLastname = addressData.lastname || nameParts.slice(1).join(' ') || 'CBD';

        const xmlBody = `<?xml version="1.0" encoding="UTF-8"?>
<prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
<address>
    <id_customer>${customerId}</id_customer>
    <id_country>${countryId}</id_country>
    <alias>${(addressData.alias || 'Domicile').replace(/[<>&'"]/g, '')}</alias>
    <lastname>${safeLastname.replace(/[<>&'"]/g, '')}</lastname>
    <firstname>${safeFirstname.replace(/[<>&'"]/g, '')}</firstname>
    <company>${(addressData.company || '').replace(/[<>&'"]/g, '')}</company>
    <vat_number>${(addressData.vat_number || '').replace(/[<>&'"]/g, '')}</vat_number>
    <address1>${addressData.address1.replace(/[<>&'"]/g, '')}</address1>
    <address2>${(addressData.address2 || '').replace(/[<>&'"]/g, '')}</address2>
    <postcode>${addressData.postcode.replace(/[<>&'"]/g, '')}</postcode>
    <city>${(addressData.city || '').replace(/[<>&'"]/g, '')}</city>
    <phone>${(addressData.phone || '').replace(/[<>&'"]/g, '')}</phone>
</address>
</prestashop>`;

        const res = await fetch(`${prestaUrl}/addresses?ws_key=${prestaKey}&output_format=JSON`, {
            method: 'POST',
            headers: { 'Content-Type': 'text/xml' },
            body: xmlBody
        });

        const data = await res.json();

        if (data?.address?.id) {
            return NextResponse.json({ success: true, ps_id: data.address.id });
        } else {
            return NextResponse.json({ success: false, error: "Erreur lors de la mise à jour" }, { status: 500 });
        }

    } catch (error) {
        console.error("[api/user/addresses PUT] Error:", error);
        return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
    }
}

// DELETE — Delete an address by its PrestaShop ID (?id=<ps_id>)
export async function DELETE(request) {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const psId = searchParams.get('id');

        if (!psId) {
            return NextResponse.json({ success: false, error: "ID manquant" }, { status: 400 });
        }

        const prestaUrl = process.env.PRESTASHOP_API_URL;
        const prestaKey = process.env.PRESTASHOP_API_KEY;

        // PrestaShop DELETE returns HTTP 200 with an EMPTY body (not JSON)
        // So we can't do res.json() — we check the status code instead
        const res = await fetch(`${prestaUrl}/addresses/${psId}?ws_key=${prestaKey}`, { method: 'DELETE' });
        const text = await res.text();
        if (res.ok || res.status === 200 || res.status === 204) {
            return NextResponse.json({ success: true });
        } else {
            console.error(`[api/user/addresses DELETE] Status: ${res.status}, Body: ${text}`);
            return NextResponse.json({ success: false, error: "Erreur lors de la suppression" }, { status: 500 });
        }

    } catch (error) {
        console.error("[api/user/addresses DELETE] Error:", error);
        return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
    }
}
