---- 初期化用のSQL

-- 1. 既に user テーブルが存在する場合は削除
DROP TABLE IF EXISTS user;

-- 2. user テーブルを作成
CREATE TABLE user (
	-- ユーザーID
	id INTEGER PRIMARY KEY AUTOINCREMENT,

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
	id INTEGER PRIMARY KEY AUTOINCREMENT,

	-- 絵文字の名前
	name TEXT NOT NULL,

	-- 絵文字の画像URL
	image_url TEXT NOT NULL,

	-- カテゴリ
	category TEXT NOT NULL,

	-- タグ
	tags TEXT NOT NULL,

	-- リクエストしたユーザーのID
	user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- 5. 既に delete_request テーブルが存在する場合は削除
DROP TABLE IF EXISTS delete_request;

-- 6. delete_request テーブルを作成
CREATE TABLE delete_request (
	-- リクエストID
	id INTEGER PRIMARY KEY AUTOINCREMENT,

	-- 削除をリクエストしたユーザーのID
	user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE
);
