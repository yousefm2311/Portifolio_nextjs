import bcrypt from 'bcryptjs';
import { connectToDatabase } from './db';
import { AdminUser } from '@/models/AdminUser';

export async function getAdminByEmail(email: string) {
  await connectToDatabase();
  return AdminUser.findOne({ email: email.toLowerCase() }).lean();
}

export async function verifyAdmin(email: string, password: string) {
  const admin = await getAdminByEmail(email);
  if (!admin) return null;
  const match = await bcrypt.compare(password, admin.passwordHash);
  if (!match) return null;
  return { id: admin._id.toString(), email: admin.email, name: admin.name ?? 'Admin' };
}
