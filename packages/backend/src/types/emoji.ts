/**
 * Misskey の絵文字データ
 */
export interface Emoji {
	/** 名前 */
	name: string;

	/** カテゴリ */
	category: string | null;

	/** タグ一覧 */
	aliases: string[];

	/** URL */
	url: string;
}
