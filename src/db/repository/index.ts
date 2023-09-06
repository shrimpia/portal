import { EmojiRequestRepository } from './emoji-request';
import { UserRepository } from './user';

export const Users = new UserRepository();
export const EmojiRequests = new EmojiRequestRepository();
