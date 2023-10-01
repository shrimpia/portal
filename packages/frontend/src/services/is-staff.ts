import type { Session } from '@/types/session';

export const isStaff = (u: Session) => u.isEmperor || u.canManageCustomEmojis;
