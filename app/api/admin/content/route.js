import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { kv } from '@vercel/kv';

// Force dynamic execution to prevent caching content
export const dynamic = 'force-dynamic';

const dataFilePath = path.join(process.cwd(), 'data', 'home.json');
const KV_KEY = 'home_content';

// Helper function to get initial data from file
async function getInitialData() {
    try {
        const fileContent = await fs.readFile(dataFilePath, 'utf8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error('Error reading initial home.json:', error);
        return { sections: [] }; // Fallback
    }
}

// GET: Retrieve the full home content
export async function GET() {
    try {
        // Try to get data from KV first
        let data = await kv.get(KV_KEY);

        // If KV is empty (first time), load from local file and populate KV
        if (!data) {
            console.log('KV empty, loading initial data from local file');
            data = await getInitialData();
            await kv.set(KV_KEY, data);
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error reading content:', error);
        return NextResponse.json(
            { error: 'Failed to load content' },
            { status: 500 }
        );
    }
}

// POST: Update specific section content
export async function POST(request) {
    try {
        const body = await request.json();
        const { sectionId, newProps } = body;

        if (!sectionId || !newProps) {
            return NextResponse.json(
                { error: 'Missing sectionId or newProps' },
                { status: 400 }
            );
        }

        // 1. Read current data from KV
        let data = await kv.get(KV_KEY);

        // Fallback if KV was somehow cleared but we are trying to update
        if (!data) {
            data = await getInitialData();
        }

        // 2. Find and update the section
        if (!data || !data.sections) {
            return NextResponse.json({ error: 'Data structure invalid' }, { status: 500 });
        }

        const sectionIndex = data.sections.findIndex(s => s.id === sectionId);

        if (sectionIndex === -1) {
            return NextResponse.json(
                { error: `Section not found: ${sectionId}` },
                { status: 404 }
            );
        }

        // Merge new props deeply or shallowly?
        // For safety and simplicity, let's do a shallow merge of the props object,
        // so we don't accidentally delete unmentioned props if the UI sends partial data.
        // However, for lists (like FAQ items), the UI should send the *entire* new list.
        data.sections[sectionIndex].props = {
            ...data.sections[sectionIndex].props,
            ...newProps
        };

        // 3. Write back to KV
        await kv.set(KV_KEY, data);

        return NextResponse.json({
            success: true,
            updatedSection: data.sections[sectionIndex]
        });

    } catch (error) {
        console.error('Error updating content:', error);
        return NextResponse.json(
            { error: 'Failed to update content' },
            { status: 500 }
        );
    }
}
