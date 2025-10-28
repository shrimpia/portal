-- Migration number: 0010 	 2025-10-28T14:33:00.000Z

-- avatar_decoration_request テーブルを作成
CREATE TABLE avatar_decoration_request (
	-- リクエストID
	id TEXT PRIMARY KEY,

	-- デコレーションの名前
	name TEXT NOT NULL,

	-- デコレーションの説明
	description TEXT NOT NULL,

	-- デコレーション画像のR2 バケットキー
	image_key TEXT NOT NULL,

	-- リクエストしたユーザーのID
	user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,

	-- リクエスト作成年
	created_year INT NOT NULL,

	-- リクエスト作成月
	created_month INT NOT NULL,

	-- ステータス
	--  pending: 承認待ち
	--  approved: 承認済み
	--  rejected: 却下済み
	status TEXT NOT NULL DEFAULT 'pending',

	-- スタッフコメント（拒否時に使用、最大500文字）
	staff_comment TEXT NOT NULL DEFAULT '',

	-- 申請日時（UNIX timestamp）
	created_at INT NOT NULL,

	-- 処理したスタッフのID
	processer_id TEXT REFERENCES user(id) ON DELETE SET NULL,

	-- 処理日時（UNIX timestamp）
	processed_at INT
);
