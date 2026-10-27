import crypto from 'crypto';

export function signJwt(payload: Record<string, any>, secret: string, expiresInDays = 30): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');

  const exp = Math.floor(Date.now() / 1000) + expiresInDays * 24 * 60 * 60;
  const body = { ...payload, exp };
  const encodedPayload = Buffer.from(JSON.stringify(body)).toString('base64url');

  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export function verifyJwt(token: string, secret: string): any {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, payload, sig] = parts;

  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(`${header}.${payload}`)
    .digest('base64url');

  if (sig !== expectedSig) return null;

  try {
    const body = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (body.exp && body.exp < Math.floor(Date.now() / 1000)) return null;
    return body;
  } catch (e) {
    return null;
  }
}
