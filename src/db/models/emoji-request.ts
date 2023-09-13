/**
 * emoji_request テーブルの型定義。
 */
export interface EmojiRequest {
	id: string;
	name: string;
	comment: string;
	image_key: string;
	user_id: string;
	created_year: number;
	created_month: number;
	status: 'pending' | 'approved' | 'rejected';
}
