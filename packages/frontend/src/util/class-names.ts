/** falsy な値を除いて、クラス名を空白区切りで連結する */
export const classNames = (...names: (string | false | null | undefined)[]): string =>
  names.filter(Boolean).join(' ');
