/**
 * 配列を指定した数で分割します。
 * @param array 分割する配列
 * @param size 分割単位
 * @returns 分割された配列
 */
export const sliceByCount = <T>(array: T[], size: number): T[][] => {
  return array.flatMap((_, i, a) => i % size ? [] : [a.slice(i, i + size)]);
};

