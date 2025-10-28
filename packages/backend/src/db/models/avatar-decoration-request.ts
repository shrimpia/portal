/**
 * avatar_decoration_request テーブルの型定義。
 */
export interface AvatarDecorationRequest {
	id: string;
	name: string;
	description: string;
	image_key: string;
	user_id: string;
	created_year: number;
	created_month: number;
	staff_comment: string;
	status: 'pending' | 'approved' | 'rejected';
	created_at: number;
	processed_at: number;
	processer_id: string;
}
