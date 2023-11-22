-- Migration number: 0004 	 2023-11-21T12:19:44.322Z

DROP TABLE IF EXISTS event;

CREATE TABLE event (
	-- ID
	id TEXT PRIMARY KEY,
	-- イベント名
	name TEXT NOT NULL,
	-- イベントの説明
	description TEXT DEFAULT '',
	-- イベントの開始日時
	start_date TEXT NOT NULL,
	-- イベントの終了日時
	end_date TEXT,
	-- イベントが終日かどうか
	is_all_day BOOLEAN NOT NULL,
	-- イベントが公式かどうか
	is_official BOOLEAN NOT NULL,
	-- イベント作成日時
	created_at TEXT NOT NULL,
	-- イベントを作成したユーザーのID
	author_id TEXT REFERENCES user(id) ON DELETE SET NULL
);
