import type { ShrimpiaPlus } from './shrimpia-plus';

export interface Session {
    username: string;
    name: string;
    shrimpiaPlus: ShrimpiaPlus;
    isEmperor: boolean;
    avatarUrl: string;
    canManageCustomEmojis: boolean;
}
