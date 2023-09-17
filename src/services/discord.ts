import { PORTAL_FRONTEND_URL } from '../const';

import { getMisskeyUser } from './misskey-api';

import type { User } from '../db/models/user';

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
            'value': data.comment,
          },
        ],
        'author': {
          'name': `${misskeyUser.name ?? misskeyUser.username} (@${misskeyUser.username})`,
          'icon_url': misskeyUser.avatarUrl,
        },
        'thumbnail': {
          'url': data.imageUrl,
        },
      },
    ],
  };

  await fetch(webhook, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
};
