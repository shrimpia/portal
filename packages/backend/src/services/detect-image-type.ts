export type ImageMimeType = 'image/png' | 'image/gif' | 'image/webp';

const startsWith = (bytes: Uint8Array, signature: number[], offset = 0) =>
  signature.every((b, i) => bytes[offset + i] === b);

/**
 * ファイル先頭のマジックバイトから画像形式を判定します。
 * APNG は PNG と同じシグネチャを持つため image/png として扱います。
 * @param data ファイルの中身（先頭 12 バイト以上）
 * @returns 判定できた MIME タイプ。対応形式でなければ null
 */
export const detectImageType = (data: ArrayBuffer): ImageMimeType | null => {
  const bytes = new Uint8Array(data, 0, Math.min(data.byteLength, 12));

  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return 'image/png';
  if (startsWith(bytes, [0x47, 0x49, 0x46, 0x38])) return 'image/gif';
  // RIFF....WEBP
  if (startsWith(bytes, [0x52, 0x49, 0x46, 0x46]) && startsWith(bytes, [0x57, 0x45, 0x42, 0x50], 8)) return 'image/webp';

  return null;
};
