/**
 * emoji_request テーブルの型定義。
 */
export interface EmojiRequest {
	id: number;
	name: string;
	image_url: string;
	user_id: number;
	created_year: number;
	created_month: number;
	status: 'pending' | 'approved' | 'rejected';
}
