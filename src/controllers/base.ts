import type { PortalEnv } from '../env';
import type { Context } from 'hono';

/**
 * コントローラーのベース型。
 */
export type Controller = (ctx: Context<PortalEnv>) => Response | Promise<Response>;
