import { callMisskeyApi } from './misskey-api';
import { parseAidTime } from './parse-aid';

import type { PortalEnv } from '../env';

const DAY_MS = 24 * 60 * 60 * 1000;
/** admin/emoji/list の1ページあたりの取得件数（Misskey側の上限） */
const EMOJI_LIST_LIMIT = 100;
/** Misskeyのノート文字数上限（デフォルト3000）に対する余裕を持たせた上限 */
const MAX_TEXT_LENGTH = 2800;

/**
 * 絵文字名の一覧から投稿本文を組み立てる。各絵文字は「:name: `:name:`」の形式で1行ずつ列挙する。
 * 長すぎる場合は行単位で複数ノートに分割し、先頭のノートにのみ見出しが付く。
 */
export const splitDailyEmojiSummaryText = (names: string[]) => {
  const header = `本日は${names.length}件の絵文字が登録されました！`;
  const chunks: string[] = [];
  let current = header;
  for (const n of names) {
    const line = `:${n}: \`:${n}:\``;
    if (current.length + 1 + line.length > MAX_TEXT_LENGTH) {
      chunks.push(current);
      current = line;
    } else {
      current += '\n' + line;
    }
  }
  chunks.push(current);
  return chunks;
};

/**
 * Misskey に登録された絵文字のうち、作成時刻が [from, to) の範囲にあるものの名前を、登録が古い順に返す。
 * 絵文字の ID（aid）から作成時刻を求めるため、ポータル経由かどうかを問わず管理画面から追加されたものも対象になる。
 */
const readEmojiNamesCreatedBetween = async (env: PortalEnv['Bindings'], from: number, to: number) => {
  const names: string[] = [];
  let untilId: string | undefined;
  for (;;) {
    // admin/emoji/list は ID の降順（新しい順）で返る
    const page = await callMisskeyApi<{id: string, name: string}[]>('admin/emoji/list', {
      i: env.MISSKEY_ADMIN_TOKEN,
      limit: EMOJI_LIST_LIMIT,
      ...(untilId ? { untilId } : {}),
    });
    for (const emoji of page) {
      const createdAt = parseAidTime(emoji.id);
      if (createdAt < from) return names.reverse();
      if (createdAt < to) names.push(emoji.name);
    }
    if (page.length < EMOJI_LIST_LIMIT) return names.reverse();
    untilId = page[page.length - 1].id;
  }
};

/**
 * 直近24時間（scheduledTime の24時間前〜scheduledTime）に Misskey へ登録された絵文字を、ポータル公式アカウントで投稿する。
 * 該当がなければ何もしない。
 *
 * 注意: 複数ノートに分割した場合、途中のノートの投稿に失敗すると残りは投稿されない。
 * Cron は再実行されず、次回の集計期間は今回分を含まないため、その日の漏れ分は拾われない（頻度が低いため許容）。
 */
export const postDailyEmojiSummary = async (env: PortalEnv['Bindings'], scheduledTime: number) => {
  const names = await readEmojiNamesCreatedBetween(env, scheduledTime - DAY_MS, scheduledTime);
  if (names.length === 0) {
    console.info('登録された絵文字がないため、投稿しません。');
    return;
  }

  let replyId: string | undefined;
  for (const text of splitDailyEmojiSummaryText(names)) {
    const res = await callMisskeyApi<{createdNote: {id: string}}>('notes/create', {
      i: env.MISSKEY_ADMIN_TOKEN,
      text,
      visibility: 'public',
      ...(replyId ? { replyId } : {}),
    });
    replyId = res.createdNote.id;
  }
};
