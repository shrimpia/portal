-- Migration number: 0001 	 2023-09-06T09:38:00.192Z

---- 初期化用のSQL
----  初期のスキーマを追加します。
----  追加バージョン: 2023.9.0

-- 1. 既に user テーブルが存在する場合は削除
DROP TABLE IF EXISTS user;

-- 2. user テーブルを作成
CREATE TABLE user (
	-- ユーザーID
	id TEXT PRIMARY KEY,

	-- ユーザー名
	username TEXT NOT NULL UNIQUE,

	-- ポータル トークン
	portal_token TEXT NOT NULL UNIQUE,

	-- Misskey API トークン
	misskey_token TEXT NOT NULL,

	-- Misskey API トークンのバージョン。
	--  1: 現行バージョン
	misskey_token_version INT NOT NULL DEFAULT 1
);

-- 3. 既に emoji_request テーブルが存在する場合は削除
DROP TABLE IF EXISTS emoji_request;

-- 4. emoji_request テーブルを作成
CREATE TABLE emoji_request (
	-- リクエストID
	id TEXT PRIMARY KEY,

	-- 絵文字の名前
	name TEXT NOT NULL,

	-- コメント
	comment TEXT NOT NULL,

	-- 絵文字のR2 バケットキー
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
	status TEXT NOT NULL DEFAULT 'pending'
);

-- 5. 既に account_deletion_request テーブルが存在する場合は削除
DROP TABLE IF EXISTS account_deletion_request;

-- 6. account_deletion_request テーブルを作成
CREATE TABLE account_deletion_request (
	-- リクエストID
	id TEXT PRIMARY KEY,

	-- 削除をリクエストしたユーザーのID
	user_id TEXT NOT NULL UNIQUE REFERENCES user(id) ON DELETE CASCADE,

	-- コメント
	comment TEXT NOT NULL,

	-- 完了済みフラグ
	--  0: 未完了
	--  1: 完了
	is_completed INT NOT NULL DEFAULT 0
);
