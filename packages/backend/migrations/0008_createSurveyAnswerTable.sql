-- Migration number: 0007 	 2025-01-16T06:44:32.250Z

DROP TABLE IF EXISTS survey_answers;

CREATE TABLE survey_answers (
	-- UUID。主キー。
	id TEXT PRIMARY KEY,

	-- 作成日時。
	created_at TEXT NOT NULL,

	-- 質問タイプ
	question_type TEXT NOT NULL,

	-- 回答。
	body TEXT NOT NULL,

	-- ユーザーID。これがnullであれば、匿名の回答扱いになる。
	user_id TEXT REFERENCES user(id) ON DELETE SET NULL
);
