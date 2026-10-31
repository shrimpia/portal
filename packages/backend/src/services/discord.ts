import { PORTAL_FRONTEND_URL } from '../const';

/**
 * Discord Webhook にメッセージを送信します。メンションは常に無効化されます。
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

/**
 * 未処理の申請件数と管理画面へのリンクを Discord に通知します。
 * 件数が 0 の種別は表示しません。
 */
export const postPendingRequestsSummaryToDiscord = async (webhook: string, counts: {
	emojiCount: number,
	avatarDecorationCount: number,
}) => {
  const lines = ['📬 未処理の申請があります'];
  if (counts.emojiCount > 0) {
    lines.push(`- 絵文字申請: **${counts.emojiCount}件** → [**ポータルを開く**](${PORTAL_FRONTEND_URL}/admin/emoji-requests)`);
  }
  if (counts.avatarDecorationCount > 0) {
    lines.push(`- アバターデコレーション申請: **${counts.avatarDecorationCount}件** → [**ポータルを開く**](${PORTAL_FRONTEND_URL}/admin/avatar-decoration-requests)`);
  }

  await postToDiscord(webhook, { content: lines.join('\n') });
};
