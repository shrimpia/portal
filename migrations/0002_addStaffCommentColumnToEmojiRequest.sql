-- Migration number: 0002 	 2023-09-13T12:12:21.762Z
ALTER TABLE emoji_request ADD COLUMN "staff_comment" TEXT NOT NULL DEFAULT '';
