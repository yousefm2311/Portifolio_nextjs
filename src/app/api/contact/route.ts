import { NextResponse } from 'next/server';
import { z } from 'zod';
import nodemailer from 'nodemailer';
import { enforceRateLimit } from '@/lib/api-helpers';
import { sanitizeObject } from '@/lib/sanitize';

export const runtime = 'nodejs';

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(160),
  message: z.string().min(10).max(3000)
});

function getContactTo() {
  const direct = process.env.CONTACT_TO?.trim();
  if (direct) return direct;
  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map((email) => email.trim()).filter(Boolean);
  return adminEmails?.[0] ?? null;
}

function getTransportConfig() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !port || Number.isNaN(port) || !user || !pass) return null;
  return {
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  };
}

export async function POST(req: Request) {
  const limited = enforceRateLimit(req, 'contact', 8);
  if (limited) return limited;

  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const cleaned = sanitizeObject(parsed.data);
  const contactTo = getContactTo();
  const transportConfig = getTransportConfig();
  const from = process.env.SMTP_FROM?.trim() || process.env.SMTP_USER?.trim();

  if (!contactTo || !transportConfig || !from) {
    return NextResponse.json(
      { error: 'Email provider is not configured.' },
      { status: 500 }
    );
  }

  const transporter = nodemailer.createTransport(transportConfig);
  const subject = `New contact message from ${cleaned.name}`;
  const text = [
    `Name: ${cleaned.name}`,
    `Email: ${cleaned.email}`,
    '',
    cleaned.message
  ].join('\n');

  try {
    await transporter.sendMail({
      from,
      to: contactTo,
      replyTo: `${cleaned.name} <${cleaned.email}>`,
      subject,
      text
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact email failed', error);
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}
