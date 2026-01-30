import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    role?: string;
    user: {
      email?: string | null;
    } & DefaultSession['user'];
  }
}
