import { PORTAL_FRONTEND_URL } from '../const';

import { getMisskeyUser } from './misskey-api';

import type { User } from '../db/models/user';

/**
 * Discord の Markdown として解釈される記号をエスケープします。
 */
const escapeMarkdown = (text: string) => text.replace(/[\\*_~`|>[\]()#-]/g, '\\$&');

/**
 * Discord Webhook にメッセージを送信します。ユーザー入力によるメンションは常に無効化されます。
 */
const postToDiscord = async (webhook: string, body: Record<string, unknown>) => {
  await fetch(webhook, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...body,
      allowed_mentions: { parse: [] },
    }),
  });
};

export const postNewEmojiRequestToDiscord = async (webhook: string, user: User, data: {
	id: string,
	name: string,
	comment: string,
	imageUrl: string,
}) => {
  const misskeyUser = await getMisskeyUser(user.misskey_token);
  if (!misskeyUser) throw new Error('Failed to get Misskey account.');
  const body = {
    'content': `🚀 新しい絵文字申請 \`:${data.name}:\` が届いています！\n[**ポータルを開く**](${PORTAL_FRONTEND_URL}/admin/emoji-requests/${data.id})`,
    'embeds': [
      {
        'color': 12140099,
        'fields': [
          {
            'name': '名前',
            'value': data.name,
          },
          {
            'name': 'コメント',
            'value': escapeMarkdown(data.comment),
          },
        ],
        'author': {
          'name': `${escapeMarkdown(misskeyUser.name ?? misskeyUser.username)} (@${misskeyUser.username})`,
          'icon_url': misskeyUser.avatarUrl,
        },
        'thumbnail': {
          'url': data.imageUrl,
        },
      },
    ],
  };

  await postToDiscord(webhook, body);
};

export const postNewAvatarDecorationRequestToDiscord = async (webhook: string, user: User, data: {
	id: string,
	name: string,
	description: string,
	imageUrl: string,
}) => {
  const misskeyUser = await getMisskeyUser(user.misskey_token);
  if (!misskeyUser) throw new Error('Failed to get Misskey account.');
  const body = {
    'content': `🎨 新しいアバターデコレーション申請「${escapeMarkdown(data.name)}」が届いています！\n[**ポータルを開く**](${PORTAL_FRONTEND_URL}/admin/avatar-decoration-requests/${data.id})`,
    'embeds': [
      {
        'color': 15844367,
        'fields': [
          {
            'name': '名前',
            'value': escapeMarkdown(data.name),
          },
          {
            'name': '説明',
            'value': escapeMarkdown(data.description) || 'なし',
          },
        ],
        'author': {
          'name': `${escapeMarkdown(misskeyUser.name ?? misskeyUser.username)} (@${misskeyUser.username})`,
          'icon_url': misskeyUser.avatarUrl,
        },
        'thumbnail': {
          'url': data.imageUrl,
        },
      },
    ],
  };

  await postToDiscord(webhook, body);
};
