/** Misskey の aid が基準にしている 2000-01-01T00:00:00Z のエポックミリ秒 */
const TIME2000 = 946684800000;
/** aid のうち時刻を表す先頭部分の文字数 */
const TIME_LENGTH = 8;

/**
 * Misskey の aid から生成時刻（エポックミリ秒）を取り出す。
 * aid は先頭8文字が「2000年からの経過ミリ秒」の36進数表現で、残りはランダム値。
 * aid として解釈できない場合は NaN を返す。
 */
export const parseAidTime = (id: string) => {
  return parseInt(id.slice(0, TIME_LENGTH), 36) + TIME2000;
};
