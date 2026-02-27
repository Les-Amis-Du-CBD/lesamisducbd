import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';

const PAGES_KEY = 'builder_pages';

// GET: Retrieve all pages or a specific page
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get('slug');

        const pages = await kv.get(PAGES_KEY) || {};

        if (slug) {
            if (!pages[slug]) {
                return NextResponse.json({ error: 'Page not found' }, { status: 404 });
            }
            return NextResponse.json(pages[slug]);
        }

        return NextResponse.json(pages);
    } catch (error) {
        console.error('Builder API GET error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST: Create or update a page
export async function POST(request) {
    try {
        const body = await request.json();
        const { slug, title, sections } = body;

        if (!slug || !title) {
            return NextResponse.json({ error: 'Slug and Title are required' }, { status: 400 });
        }

        const pages = await kv.get(PAGES_KEY) || {};

        pages[slug] = {
            slug,
            title,
            sections: sections || [],
            updatedAt: new Date().toISOString()
        };

        await kv.set(PAGES_KEY, pages);

        // Update global footer links
        try {
            const globalContent = await kv.get('global_content') || {};
            const footerLinks = globalContent.footerLinks || [];
            const pageHref = `/p/${slug}`;

            const linkExists = footerLinks.some(link => link.href === pageHref);
            if (!linkExists) {
                footerLinks.push({ label: title, href: pageHref });
                globalContent.footerLinks = footerLinks;
                await kv.set('global_content', globalContent);
            }
        } catch (footerError) {
            console.error('Error updating global footer links:', footerError);
            // Don't fail the whole request if footer update fails
        }

        return NextResponse.json({ success: true, page: pages[slug] });
    } catch (error) {
        console.error('Builder API POST error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE: Remove a page
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get('slug');

        if (!slug) {
            return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
        }

        const pages = await kv.get(PAGES_KEY) || {};

        if (!pages[slug]) {
            return NextResponse.json({ error: 'Page not found' }, { status: 404 });
        }

        delete pages[slug];

        await kv.set(PAGES_KEY, pages);

        // Remove from global footer links
        try {
            const globalContent = await kv.get('global_content');
            if (globalContent && globalContent.footerLinks) {
                const pageHref = `/p/${slug}`;
                globalContent.footerLinks = globalContent.footerLinks.filter(link => link.href !== pageHref);
                await kv.set('global_content', globalContent);
            }
        } catch (footerError) {
            console.error('Error removing global footer link:', footerError);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Builder API DELETE error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
