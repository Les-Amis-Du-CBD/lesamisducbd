
import { signToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request) {
    const body = await request.json();
    const { password } = body;

    // Hardcoded password for simplicity - in production use env var
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

    if (password === ADMIN_PASSWORD) {
        const token = await signToken({ role: 'admin' });

        const response = NextResponse.json({ success: true });

        response.cookies.set('admin_token', token, {
            httpOnly: true,
            secure: false, // Force false for local dev to avoid issues
            sameSite: 'lax', // Strict can sometimes block redirect cookies
            path: '/',
            maxAge: 60 * 60 * 24 // 1 day
        });

        return response;
    }

    return NextResponse.json({ success: false, message: 'Mot de passe incorrect' }, { status: 401 });
}
