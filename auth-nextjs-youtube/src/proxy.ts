// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function proxy(request: NextRequest) {

    const path = request.nextUrl.pathname
    const isPublicPath = path === '/login' || path === '/signup'
    const isVerifyPath = path === '/verifyemail'

    const token = request.cookies.get('token')?.value || '';

    // Always allow access to verify email page
    if (isVerifyPath) {
        return NextResponse.next();
    }

    // If user has token and tries to access public paths, redirect to profile
    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/profile', request.nextUrl));
    }

    // If user doesn't have token and tries to access protected paths, redirect to login
    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/login', request.nextUrl))
    }

    // Allow the request to continue
    return NextResponse.next();
}



// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/',
        '/profile',
        '/login',
        '/signup',
        '/verifyemail'
    ]
}