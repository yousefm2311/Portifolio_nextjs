import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { isEmailAllowed } from '@/lib/allowlist';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isStudio = pathname.startsWith('/studio');
  const isStudioLogin = pathname === '/studio/login';
  const isApiStudio = pathname.startsWith('/api/studio');

  const email = req.auth?.user?.email;
  const isAllowed = isEmailAllowed(email ?? undefined);

  if ((isStudio && !isStudioLogin) || isApiStudio) {
    if (!req.auth || !isAllowed) {
      if (isApiStudio) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/studio/login', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/studio/:path*', '/api/studio/:path*']
};
