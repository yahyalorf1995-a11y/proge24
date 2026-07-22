/**
 * Minimal signed-session tokens (HMAC-SHA256), built entirely on the Web
 * Crypto API so this file works unmodified in both:
 *   - the Node runtime (Server Actions, Server Components)
 *   - the Edge runtime (src/proxy.ts)
 * No extra dependency needed — avoids pulling in an auth library whose
 * compatibility with Next 16 / React 19 can't be verified offline.
 *
 * Token shape: base64url(payloadJson) + "." + base64url(hmacSignature)
 * Payload: { sub: userId, exp: unixSeconds }
 */

export const SESSION_COOKIE_NAME = "pos_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(value: string): Uint8Array {
  const padLength = (4 - (value.length % 4)) % 4;
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat(padLength);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error(
      "AUTH_SECRET is not set. Generate one with `openssl rand -base64 32` and add it to .env / your host's environment variables."
    );
  }
  return secret;
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret) as BufferSource,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function createSessionToken(userId: string): Promise<string> {
  const secret = getAuthSecret();
  const payload = JSON.stringify({
    sub: userId,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  });
  const payloadB64 = base64UrlEncode(encoder.encode(payload));

  const key = await getHmacKey(secret);
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payloadB64) as BufferSource
  );
  const signatureB64 = base64UrlEncode(new Uint8Array(signature));

  return `${payloadB64}.${signatureB64}`;
}

/** Returns the userId encoded in the token, or null if missing/invalid/expired. */
export async function verifySessionToken(token: string | undefined | null): Promise<string | null> {
  if (!token) return null;

  const [payloadB64, signatureB64] = token.split(".");
  if (!payloadB64 || !signatureB64) return null;

  try {
    const secret = getAuthSecret();
    const key = await getHmacKey(secret);
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      base64UrlDecode(signatureB64) as BufferSource,
      encoder.encode(payloadB64) as BufferSource
    );
    if (!isValid) return null;

    const payload = JSON.parse(
      decoder.decode(base64UrlDecode(payloadB64) as BufferSource)
    ) as {
      sub: string;
      exp: number;
    };

    if (typeof payload.exp !== "number" || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload.sub;
  } catch {
    // Malformed token (tampered, corrupted, wrong secret after rotation, etc.)
    return null;
  }
}
