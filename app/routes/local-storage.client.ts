import { KEY_OUTLET_SAMPLE } from "~/constants";

/** ローカル ストレージに保存するデータ */
type PageData = {
  /** 暗号化されたデータ */
  encrypted?: string;
  /** 補足情報 (暗号化されないデータ) */
  additional?: string;
};

/** ローカルストレージからこのページで利用するデータを読み込みます。 */
export function loadFromLocalStorage(): PageData | undefined {
  const value = localStorage.getItem(KEY_OUTLET_SAMPLE);

  if (!value) return undefined;

  try {
    const decoded = JSON.parse(value);
    return { encrypted: decoded.encrypted, additional: decoded.additional };
  } catch {
    console.error(
      `Failed to decode from local storage "${KEY_OUTLET_SAMPLE}".`,
    );
  }

  return undefined;
}

/** ローカルストレージにこのページで利用するデータを保存します。 */
export function saveToLocalStorage(value: PageData) {
  try {
    localStorage.setItem(KEY_OUTLET_SAMPLE, JSON.stringify(value));
  } catch {
    console.error(`Failed to save to local storage "${KEY_OUTLET_SAMPLE}".`);
  }
}
