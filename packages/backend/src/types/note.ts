import type { MisskeyUser } from './user';

export interface MisskeyNote {
  id: string,
  createdAt: string,
  userId: string,
  user: MisskeyUser,
  text: string | null,
  cw: string | null,
  visibility: 'public' | 'home' | 'followers' | 'specified',
  localOnly: boolean,
  renoteCount: number,
  repliesCount: number,
  reactions: Record<string, number>,
  reactionEmojis: any,
  fileIds: string[],
  files: any[],
  replyId: string | null,
  renoteId: string | null,
	reply: MisskeyNote | null,
	renote: MisskeyNote | null,
  clippedCount: 0
}
