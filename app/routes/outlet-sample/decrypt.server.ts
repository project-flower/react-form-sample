import { decrypt } from "~/.server/crypto";

/** ローカル ストレージに保存された情報を復号します。 */
export function decryptSavedInformation(value: string) {
  const decrypted = decrypt(value);
  const parsed = JSON.parse(decrypted);

  if (parsed.name && parsed.telephone && parsed.address) {
    return {
      name: parsed.name,
      telephone: parsed.telephone,
      address: parsed.address,
    };
  }
}
