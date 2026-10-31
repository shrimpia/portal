import { EmojiRequests } from '../db/repository';

import { callMisskeyApi } from './misskey-api';

import type { PortalEnv } from '../env';

const DAY_MS = 24 * 60 * 60 * 1000;
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
 * 直近24時間（scheduledTime の24時間前〜scheduledTime）に承認された絵文字を、ポータル公式アカウントで投稿する。
 * 該当がなければ何もしない。
 *
 * 注意: 複数ノートに分割した場合、途中のノートの投稿に失敗すると残りは投稿されない。
 * Cron は再実行されず、次回の集計期間は今回分を含まないため、その日の漏れ分は拾われない（頻度が低いため許容）。
 */
export const postDailyEmojiSummary = async (env: PortalEnv['Bindings'], scheduledTime: number) => {
  const names = await EmojiRequests.readApprovedNamesBetween(env.DB, scheduledTime - DAY_MS, scheduledTime);
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
