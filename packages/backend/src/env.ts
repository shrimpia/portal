import type { Env } from 'hono';

export interface PortalEnv extends Env {
	Bindings: {
		DB: D1Database;
		BUCKET: R2Bucket;
		KV: KVNamespace;
		DISCORD_WEBHOOK_URL: string;
		/** ポータルアカウントのトークン。絵文字のアップロードや、日次の絵文字告知ノートの投稿（write:notes）に使う */
		MISSKEY_ADMIN_TOKEN: string;
		DEV: boolean;
		MINECRAFT_SERVER_ACCEPTING_KEY: string;
	};
}
