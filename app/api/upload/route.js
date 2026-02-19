import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Define upload directory
        const uploadDir = path.join(process.cwd(), 'public/images/uploads');

        // Ensure directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Generate unique filename
        const uniqueFilename = `${uuidv4()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
        const filePath = path.join(uploadDir, uniqueFilename);

        // Write file
        fs.writeFileSync(filePath, buffer);

        // Return public URL
        const fileUrl = `/images/uploads/${uniqueFilename}`;

        return NextResponse.json({
            success: true,
            url: fileUrl
        });

    } catch (e) {
        console.error('Upload Process Error:', e);
        return NextResponse.json({
            success: false,
            message: "Server error: " + (e.message || 'Unknown error')
        }, { status: 500 });
    }
}
