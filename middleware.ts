import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;

  if (pathname === '/games&activities' || pathname === '/games%26activities') {
    const destination = new URL('/games-and-activities', url);
    destination.search = url.search;

    return NextResponse.redirect(destination, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/games&activities', '/games%26activities'],
};
