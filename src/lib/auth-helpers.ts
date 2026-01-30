import { auth } from '@/auth';
import { isEmailAllowed } from '@/lib/allowlist';

export async function requireAdminSession() {
  const session = await auth();
  if (!session?.user?.email || !isEmailAllowed(session.user.email)) {
    return null;
  }
  return session;
}
