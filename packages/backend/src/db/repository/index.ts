import { AccountDeletionRequestRepository } from './account-deletion-request';
import { R2BucketRepository } from './bucket';
import { EmojiRequestRepository } from './emoji-request';
import { KeyValueRepository } from './kv';
import { UserRepository } from './user';

export const Users = new UserRepository();
export const EmojiRequests = new EmojiRequestRepository();
export const AccountDeletionRequests = new AccountDeletionRequestRepository();
export const Bucket = new R2BucketRepository();
export const KeyValue = new KeyValueRepository();
