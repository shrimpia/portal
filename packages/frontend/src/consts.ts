export const URL_EMPIRE = 'https://mk.shrimpia.network';
export const URL_SHRIMPIA_PLUS = 'https://docs.shrimpia.network/services/shrimpia-plus/';
export const URL_EMOJI_REQUEST_GUIDELINES = 'https://docs.shrimpia.network/guidelines/emoji-request/';
export const URL_MISSKEY = 'https://mk.shrimpia.network';
export const URL_DISCORD = 'https://go.shrimpia.network/discord';
export const URL_DOCS = 'https://docs.shrimpia.network';

export const URL_PORTAL_BACKEND = import.meta.env.DEV ? 'http://localhost:8787' : 'https://portal-api.shrimpia.network';

export const SHRIMPIA_PLUS_PLAN_NAMES = {
  lite: 'Shrimpia+ Lite',
  normal: 'Shrimpia+',
  pro: 'Shrimpia+ Pro',
  'not-member': '',
} as const;
