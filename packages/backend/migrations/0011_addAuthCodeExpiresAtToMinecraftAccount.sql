-- Migration number: 0011 	 2026-10-05T00:00:00.000Z

---- 認証コードの有効期限
----  総当たり対策として、Minecraft 認証コードに有効期限を設けます。
----  既存のコードは NULL（失効扱い）となり、次回サーバー参加時に再発行されます。

ALTER TABLE minecraft_accounts ADD COLUMN auth_code_expires_at INTEGER;
