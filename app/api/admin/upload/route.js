import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Convert the File to a Buffer to be able to upload to Cloudinary
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary using a promise wrapper since the stream API is callback-based
        const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'lesamisducbd/partners' },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
            uploadStream.end(buffer);
        });

        // Return the secure URL from Cloudinary to the frontend
        return NextResponse.json({ url: uploadResult.secure_url }, { status: 200 });
    } catch (error) {
        console.error('Upload Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error during file upload', details: error.message, stack: error.stack },
            { status: 500 }
        );
    }
}
