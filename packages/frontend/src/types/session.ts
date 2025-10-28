import type { ShrimpiaPlus } from '@/types/shrimpia-plus';

export interface Session {
    username: string;
    name: string;
    shrimpiaPlus: ShrimpiaPlus;
    isEmperor: boolean;
    isModerator: boolean;
    avatarUrl: string;
    canManageCustomEmojis: boolean;
    canManageAvatarDecorations?: boolean;
    misskeyTokenVersion: number;
}
