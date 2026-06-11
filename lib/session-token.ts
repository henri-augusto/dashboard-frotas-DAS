const SESSION_MAX_AGE_SEC = 60 * 60 * 8;

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (process.env.NODE_ENV === "production" && !secret) {
    throw new Error("ADMIN_SESSION_SECRET is required in production.");
  }
  return secret ?? "das-viaturas-dev-secret";
}

function base64UrlEncode(data: Uint8Array): string {
  let binary = "";
  for (const byte of data) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const padLen = (4 - (padded.length % 4)) % 4;
  const base64 = padded + "=".repeat(padLen);
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

async function signPayload(payload: string, secret: string): Promise<string> {
  const key = await importHmacKey(secret);
  const encoder = new TextEncoder();
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payload)
  );
  return base64UrlEncode(new Uint8Array(signature));
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

type SessionPayload = {
  adminId: string;
  exp: number;
};

export async function signSessionToken(adminId: string): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SEC;
  const payload: SessionPayload = { adminId, exp };
  const payloadJson = JSON.stringify(payload);
  const encoder = new TextEncoder();
  const payloadPart = base64UrlEncode(encoder.encode(payloadJson));
  const signature = await signPayload(payloadPart, getSessionSecret());
  return `${payloadPart}.${signature}`;
}

export type VerifiedSession = {
  adminId: string;
  exp: number;
};

export async function verifySessionToken(
  token: string | undefined
): Promise<VerifiedSession | null> {
  if (!token) return null;

  const dot = token.indexOf(".");
  if (dot <= 0) return null;

  const payloadPart = token.slice(0, dot);
  const signaturePart = token.slice(dot + 1);
  if (!payloadPart || !signaturePart) return null;

  try {
    const expected = await signPayload(payloadPart, getSessionSecret());
    if (!timingSafeEqual(signaturePart, expected)) return null;

    const decoded = new TextDecoder().decode(base64UrlDecode(payloadPart));
    const payload = JSON.parse(decoded) as SessionPayload;

    if (!payload.adminId || typeof payload.exp !== "number") return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;

    return { adminId: payload.adminId, exp: payload.exp };
  } catch {
    return null;
  }
}

export { SESSION_MAX_AGE_SEC };
