import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Force dynamic execution to prevent caching content
export const dynamic = 'force-dynamic';

const dataFilePath = path.join(process.cwd(), 'data', 'home.json');

// GET: Retrieve the full home.json content
export async function GET() {
    try {
        const fileContent = await fs.readFile(dataFilePath, 'utf8');
        const data = JSON.parse(fileContent);
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error reading home.json:', error);
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

        // 1. Read current file
        const fileContent = await fs.readFile(dataFilePath, 'utf8');
        const data = JSON.parse(fileContent);

        // 2. Find and update the section
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

        // 3. Write back to file
        await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8');

        return NextResponse.json({
            success: true,
            updatedSection: data.sections[sectionIndex]
        });

    } catch (error) {
        console.error('Error updating home.json:', error);
        return NextResponse.json(
            { error: 'Failed to update content' },
            { status: 500 }
        );
    }
}
