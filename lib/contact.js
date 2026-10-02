// Pure helpers for /api/contact: validation, sanitising and the mail itself.
// Kept free of I/O so they can be tested without an SMTP server.

export const TOPICS = {
  qa: 'Test Automation & QA',
  consulting: 'Quality Engineering Consulting',
  cicd: 'CI/CD Integration',
  other: 'Other',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s\-+()]+$/;

export const LIMITS = { name: 80, email: 254, phone: 30, message: 5000 };

const str = (v) => (typeof v === 'string' ? v.trim() : '');

// Header values must never carry line breaks (header injection).
export const oneLine = (v) => v.replace(/[\r\n]+/g, ' ').trim();

export const escapeHtml = (v) =>
  v
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

// Returns { ok: true, data } or { ok: false, message }.
export function parseContact(body) {
  const data = {
    firstname: str(body.firstname),
    lastname: str(body.lastname),
    email: str(body.email),
    phone: str(body.phone),
    topic: str(body.topic),
    message: str(body.message),
  };

  if (data.firstname.length < 2 || data.firstname.length > LIMITS.name)
    return { ok: false, message: 'First name must be 2 to 80 characters.' };
  if (data.lastname.length < 2 || data.lastname.length > LIMITS.name)
    return { ok: false, message: 'Last name must be 2 to 80 characters.' };
  if (data.email.length > LIMITS.email || !EMAIL_REGEX.test(data.email))
    return { ok: false, message: 'Invalid email address.' };
  if (data.phone && (data.phone.length > LIMITS.phone || !PHONE_REGEX.test(data.phone)))
    return { ok: false, message: 'Invalid phone number.' };
  if (!Object.hasOwn(TOPICS, data.topic))
    return { ok: false, message: 'Please select a topic.' };
  if (data.message.length < 10 || data.message.length > LIMITS.message)
    return { ok: false, message: 'Message must be 10 to 5000 characters.' };

  return { ok: true, data };
}

// Gmail rewrites From to the authenticated account, so the visitor goes in
// Reply-To and the body.
export function buildMail(data, { from, to }) {
  const fullName = oneLine(`${data.firstname} ${data.lastname}`);
  const topic = TOPICS[data.topic];
  const e = escapeHtml;

  return {
    from: `"Portfolio contact" <${from}>`,
    to,
    replyTo: `"${fullName.replaceAll('"', '')}" <${data.email}>`,
    subject: `[Portfolio] ${topic} - ${fullName}`,
    text: [
      `Name: ${fullName}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone || 'N/A'}`,
      `Topic: ${topic}`,
      '',
      'Message:',
      data.message,
    ].join('\n'),
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #222; line-height: 1.5;">
        <h2 style="color: #0b8fb3; margin-top: 0;">New message from the portfolio</h2>
        <p><strong>Name:</strong> ${e(fullName)}</p>
        <p><strong>Email:</strong> ${e(data.email)}</p>
        <p><strong>Phone:</strong> ${e(data.phone || 'N/A')}</p>
        <p><strong>Topic:</strong> ${e(topic)}</p>
        <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;" />
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${e(data.message)}</p>
      </div>`,
  };
}

// Tiny in-memory limiter: fine for a single container behind nginx.
const hits = new Map();
export function rateLimited(key, { max = 5, windowMs = 60 * 60 * 1000, now = Date.now() } = {}) {
  const recent = (hits.get(key) || []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= windowMs)) hits.delete(k);
  }
  return false;
}

export function mailErrorDetails(error) {
  if (!error || typeof error !== 'object') return { name: 'UnknownError' };
  const out = {};
  for (const k of ['name', 'code', 'command', 'responseCode']) {
    if (typeof error[k] === 'string' || typeof error[k] === 'number') out[k] = error[k];
  }
  return out;
}
