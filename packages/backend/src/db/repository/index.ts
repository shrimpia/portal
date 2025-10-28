import { AccountDeletionRequestRepository } from './account-deletion-request';
import { AvatarDecorationRequestRepository } from './avatar-decoration-request';
import { R2BucketRepository } from './bucket';
import { EmojiRequestRepository } from './emoji-request';
import { EventRepository } from './event';
import { HintRepository } from './hint';
import { KeyValueRepository } from './kv';
import { MinecraftAccountRepository } from './minecraft-account';
import { SurveyAnswerRepository } from './survey-answer';
import { UserRepository } from './user';

export const Users = new UserRepository();
export const EmojiRequests = new EmojiRequestRepository();
export const AvatarDecorationRequests = new AvatarDecorationRequestRepository();
export const AccountDeletionRequests = new AccountDeletionRequestRepository();
export const Events = new EventRepository();
export const Hints = new HintRepository();
export const MinecraftAccounts = new MinecraftAccountRepository();
export const SurveyAnswers = new SurveyAnswerRepository();

export const Bucket = new R2BucketRepository();
export const KeyValue = new KeyValueRepository();
