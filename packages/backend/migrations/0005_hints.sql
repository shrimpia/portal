-- Migration number: 0005 	 2024-08-15T10:40:54.001Z

DROP TABLE IF EXISTS hints;
CREATE TABLE hints (
	-- ID
	id TEXT PRIMARY KEY,
	-- ヒントの内容
	content TEXT NOT NULL,
	-- ヒントの作成日時
	created_at TEXT NOT NULL,
	-- ヒントを作成したユーザーのID
	author_id TEXT REFERENCES user(id) ON DELETE SET NULL,
	-- ヒントが公開されているかどうか
	is_published BOOLEAN NOT NULL
);
