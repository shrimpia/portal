const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Date を `<input type="date">` / `<input type="datetime-local">` の value 形式に変換する。ローカルタイムゾーン基準。
 * @param allDay true なら `YYYY-MM-DD`、false なら `YYYY-MM-DDTHH:mm`
 */
export const toInputValue = (date: Date, allDay: boolean): string => {
  const d = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  return allDay ? d : `${d}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

/**
 * `<input type="date">` / `<input type="datetime-local">` の value を Date に変換する。ローカルタイムゾーン基準。
 * 入力途中などで空・不正な場合は null。
 */
export const fromInputValue = (value: string): Date | null => {
  if (!value) return null;
  const date = new Date(value.includes('T') ? value : `${value}T00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
};
