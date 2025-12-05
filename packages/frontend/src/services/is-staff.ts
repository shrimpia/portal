import type { Session } from '@/types/session';

export const isEmojiStaff = (u: Session) => u.isEmperor || u.canManageCustomEmojis;

export const isAvatarDecorationStaff = (u: Session) => u.isEmperor || u.canManageAvatarDecorations;
