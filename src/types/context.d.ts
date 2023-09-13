// eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports
import { Context } from 'hono';

import type { User } from '../db/models/user';

declare module 'hono' {
	interface Context {
		portalUser: User | null;
	}
}
