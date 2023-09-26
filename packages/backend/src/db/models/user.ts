/**
 * userテーブルの型定義。
 */
export interface User {
	id: string;
	username: string;
	portal_token: string;
	misskey_token: string;
	misskey_token_version: 1;
}
