import type { Emoji } from '../../types/emoji';

export class KeyValueRepository {
  async getEmojis(kv: KVNamespace) {
    const data = await kv.get('emojis', { cacheTtl: 120 });
    if (!data) return [];
    return JSON.parse(data) as Emoji[];
  }
}
