-- Migration number: 0003 	 2023-09-17T22:50:21.762Z

-- created_at を追加
ALTER TABLE emoji_request ADD COLUMN "created_at" INT;

-- processer_id を追加
ALTER TABLE emoji_request ADD COLUMN "processer_id" TEXT REFERENCES user(id) ON DELETE SET NULL;

-- processed_at を追加
ALTER TABLE emoji_request ADD COLUMN "processed_at" INT;
