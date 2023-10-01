import type { ShrimpiaPlus } from '@/types/shrimpia-plus';

export interface Session {
    username: string;
    name: string;
    shrimpiaPlus: ShrimpiaPlus;
    isEmperor: boolean;
    avatarUrl: string;
    canManageCustomEmojis: boolean;
}
