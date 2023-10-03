import { EmojiRequests, KeyValue } from '../db/repository';

/**
 * 絵文字の名前が、Misskey上および、申請中の絵文字とかぶっているかどうかを取得します。
 * @param name 絵文字の名前
 * @param kv
 * @param db
 * @returns
 */
export const isDuplicatedEmojiName = async (name: string, kv: KVNamespace, db: D1Database): Promise<boolean> => {
  const emojis = await KeyValue.getEmojis(kv);
  const pendingRequests = await EmojiRequests.readAllPendings(db);

  const sets = new Set([
    ...emojis.map((emoji) => emoji.name),
    ...pendingRequests.map((request) => request.name),
  ]);

  return sets.has(name);
};
