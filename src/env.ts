import type { Env } from 'hono';

export interface PortalEnv extends Env {
	Bindings: {
		DB: D1Database;
		BUCKET: R2Bucket;
		DISCORD_WEBHOOK_URL: string;
		MISSKEY_ADMIN_TOKEN: string;
	};
}
