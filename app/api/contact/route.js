import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { buildMail, mailErrorDetails, parseContact, rateLimited } from '@/lib/contact';

export const dynamic = 'force-dynamic';

const reply = (message, status = 200) => NextResponse.json({ message }, { status });

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return reply('Invalid request.', 400);
  }

  // Honeypot: real visitors never see or fill this field. Pretend it worked.
  if (typeof body['bot-field'] === 'string' && body['bot-field'].trim()) {
    return reply('Email sent successfully');
  }

  const ip =
    req.headers.get('x-real-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    'unknown';
  if (rateLimited(ip)) {
    return reply('Too many messages. Please try again later.', 429);
  }

  const parsed = parseContact(body);
  if (!parsed.ok) return reply(parsed.message, 400);

  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  if (!user || !pass) {
    console.error('SMTP credentials missing in environment variables');
    return reply('Server email configuration error', 500);
  }

  const port = Number.parseInt(process.env.SMTP_PORT || '465', 10);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  try {
    await transporter.sendMail(
      buildMail(parsed.data, {
        from: user,
        to: process.env.CONTACT_EMAIL?.trim() || user,
      })
    );
    return reply('Email sent successfully');
  } catch (error) {
    console.error('Nodemailer error:', mailErrorDetails(error));
    return reply('Failed to send email', 500);
  }
}
