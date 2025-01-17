-- Migration number: 0007 	 2025-01-16T06:44:32.250Z

DROP TABLE IF EXISTS minecraft_accounts;

CREATE TABLE minecraft_accounts (
	-- Minecraft UUID。主キー。
	id TEXT PRIMARY KEY,

	-- 認証コード。認証を通すために使用する。
	auth_code TEXT NOT NULL UNIQUE,

	-- プレイヤー名。
	player_name TEXT,

	-- シュリンピアポータルのユーザーID。これがnullでなければ認証済み扱いになる。
	user_id TEXT REFERENCES user(id) ON DELETE SET NULL
);
