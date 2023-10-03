import { EmojiRequests, KeyValue } from '../db/repository';

export const isDuplicatedEmojiName = async (name: string, kv: KVNamespace, db: D1Database): Promise<boolean> => {
  const emojis = await KeyValue.getEmojis(kv);
  const pendingRequests = await EmojiRequests.readAllPendings(db);

  const sets = new Set([
    ...emojis.map((emoji) => emoji.name),
    ...pendingRequests.map((request) => request.name),
  ]);

  console.log(`DEBUG: ${name} is ${sets.has(name) ? '' : 'not'} duplicated.`);

  return sets.has(name);
};
