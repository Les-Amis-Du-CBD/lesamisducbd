
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(request) {
    // Only protect /admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Allow access to login page
        if (request.nextUrl.pathname === '/admin/login') {
            return NextResponse.next();
        }

        const token = request.cookies.get('admin_token')?.value;

        console.log(`Middleware: Checking access to ${request.nextUrl.pathname}`);
        console.log('Middleware: Token found?', !!token);

        const verified = token && await verifyToken(token);
        console.log('Middleware: Token verified?', verified);

        if (!verified) {
            console.log('Middleware: Access denied, redirecting to login');
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*'],
};
