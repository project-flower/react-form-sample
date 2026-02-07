import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "crypto";

const algorithm = "aes-256-cbc";
const encoding = "utf8";
const hex = "hex";

/**
 * 暗号化文字列を複合します。
 * @param value 暗号化された文字列。
 * @returns 複合された文字列。
 */
export function decrypt(value: string) {
  const parts = value.split(":");
  const iv = Buffer.from(parts[0], hex);
  const decipher = createDecipheriv(algorithm, getHash(), iv);
  return decipher.update(parts[1], hex, encoding) + decipher.final(encoding);
}

/**
 * 文字列を暗号化します。
 * @param value 文字列。
 * @returns 暗号化された文字列。
 */
export function encrypt(value: string) {
  const iv = randomBytes(16);
  const cipher = createCipheriv(algorithm, getHash(), iv);
  const encrypted = cipher.update(value, encoding, hex) + cipher.final(hex);
  return `${iv.toString(hex)}:${encrypted}`;
}

function getHash() {
  return createHash("sha256")
    .update("}zqobKjlMt-cs[dBd2dZ+ig79v\\[|wgL")
    .digest();
}
