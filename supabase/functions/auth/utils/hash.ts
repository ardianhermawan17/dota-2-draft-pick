// utils/hash.ts
// Hash implementation using Web Crypto (PBKDF2 + SHA-256).
// Stored format: pbkdf2$<iterations>$<salt_hex>$<hash_hex>

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const DEFAULT_ITER = 100_000;
const SALT_BYTES = 16;
const KEY_LEN = 32; // 32 bytes = 256 bits

function toHex(buf: ArrayBuffer) {
    const bytes = new Uint8Array(buf);
    return Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
}
function fromHex(hex: string) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return bytes.buffer;
}

export async function createPasswordHash(password: string) {
    const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
    const iterations = DEFAULT_ITER;

    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveBits"]
    );

    const derivedBits = await crypto.subtle.deriveBits(
        {
            name: "PBKDF2",
            salt: salt.buffer,
            iterations,
            hash: "SHA-256",
        },
        keyMaterial,
        KEY_LEN * 8
    );

    const hashHex = toHex(derivedBits);
    const saltHex = toHex(salt.buffer);

    return `pbkdf2$${iterations}$${saltHex}$${hashHex}`;
}

export async function verifyPassword(password: string, stored: string) {
    // Expected format: pbkdf2$<iterations>$<salt_hex>$<hash_hex>
    if (!stored || !stored.startsWith("pbkdf2$")) return false;
    const parts = stored.split("$");
    if (parts.length !== 4) return false;
    const iterations = parseInt(parts[1], 10);
    const saltHex = parts[2];
    const hashHex = parts[3];

    const saltBuf = fromHex(saltHex);
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveBits"]
    );

    const derivedBits = await crypto.subtle.deriveBits(
        {
            name: "PBKDF2",
            salt: saltBuf,
            iterations,
            hash: "SHA-256",
        },
        keyMaterial,
        KEY_LEN * 8
    );

    const derivedHex = toHex(derivedBits);
    // Constant-time comparison
    if (derivedHex.length !== hashHex.length) return false;
    let diff = 0;
    for (let i = 0; i < derivedHex.length; i++) {
        diff |= derivedHex.charCodeAt(i) ^ hashHex.charCodeAt(i);
    }
    return diff === 0;
}