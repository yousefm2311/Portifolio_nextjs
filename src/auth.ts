import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { z } from 'zod';
import { verifyAdmin } from '@/lib/admin-service';
import { isEmailAllowed } from '@/lib/allowlist';

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const providers = [
  Credentials({
    name: 'Credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' }
    },
    async authorize(credentials) {
      const parsed = credentialsSchema.safeParse(credentials);
      if (!parsed.success) return null;
      const { email, password } = parsed.data;
      if (!isEmailAllowed(email)) return null;
      return verifyAdmin(email, password);
    }
  })
];

const googleProvider =
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? Google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
      })
    : null;

export const authConfig = {
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  trustHost: true,
  providers: googleProvider ? [...providers, googleProvider] : providers,
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/studio/login'
  },
  callbacks: {
    async signIn({ user }) {
      return isEmailAllowed(user.email);
    },
    async jwt({ token, user }) {
      if (user?.email) token.email = user.email;
      token.role = 'admin';
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.email) {
        session.user.email = token.email as string;
      }
      (session as any).role = token.role;
      return session;
    }
  }
} satisfies Parameters<typeof NextAuth>[0];

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
