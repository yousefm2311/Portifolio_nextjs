import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { isEmailAllowed } from '@/lib/allowlist';

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isStudio = pathname.startsWith('/studio');
  const isStudioLogin = pathname === '/studio/login';
  const isApiStudio = pathname.startsWith('/api/studio');

  if (!(isStudio || isApiStudio)) {
    return NextResponse.next();
  }

  try {
    const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
    const token = await getToken({ req, secret });
    const email = token?.email as string | undefined;
    const isAllowed = isEmailAllowed(email ?? undefined);

    if (!token || !isAllowed) {
      if (isApiStudio) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      if (!isStudioLogin) {
        return NextResponse.redirect(new URL('/studio/login', req.url));
      }
    }
  } catch {
    if (isApiStudio) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!isStudioLogin) {
      return NextResponse.redirect(new URL('/studio/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/studio/:path*', '/api/studio/:path*']
};
