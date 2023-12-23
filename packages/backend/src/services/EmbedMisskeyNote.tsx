import type { MisskeyNote } from '../types/note';

const style = `
	body {
		--accent: rgb(134, 179, 0);
		--fg: rgb(103, 103, 103);
		--bg: rgb(249, 249, 249);
		--panel: rgb(255, 255, 255);

		margin: 0;
		border: 1px solid var(--accent);
		border-radius: 10px;
		background: var(--panel);
		color: var(--fg);
		padding: 16px 24px;
		font-size: 16px;
		max-width: 480px;
	}

	header.header {
		display: flex;
		gap: 16px;
		margin-bottom: 16px;
		align-items: center;
	}

	.avatar {
		width: 64px;
		height: 64px;
		position: relative;
		overflow: visible;
	}

	.avatar-image {
		width: 100%;
		height: 100%;
		border-radius: 999px;
	}

	.decoration {
		position: absolute;
		top: -50%;
		left: -50%;
		width: 200%;
		height: 200%;
	}

	.name {
		font-weight: bold;
	}

	.user {
		flex: 1;
	}

	.time {
		margin-top: 16px;
		font-size: 0.8em;
	}

	.time a {
		color: var(--fg);
	}

	.content p {
		margin: 0;
	}

	.media {
		aspect-ratio: 16 / 9;
		display: grid;
		grid-gap: 8px;
		grid-template-columns: repeat(2, 1fr);
		grid-template-rows: repeat(2, 1fr);
	}

	.media.size-1 {
		grid-template-rows: 1fr;
		grid-template-columns: 1fr;
	}

	.media.size-2 {
		grid-template-rows: 1fr;
	}

	.media.size-3 {
		grid-template-columns: 1fr .5fr;
	}

	.media-size-3 > .media-item:first-child {
		grid-row: 1 / 3;
	}

	.media-item {
		overflow: hidden;
		background: var(--bg);
		border-radius: 6px;
		width: 100%;
		height: 100%;
	}

	.media-item > * {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.show-on-misskey a {
		display: block;
		width: fit-content;
		margin-top: 16px;
		border-radius: 6px;
		padding: 8px 20px;
		text-decoration: none;
		background: var(--accent);
		color: white;
		font-weight: bold;
	}

	.skeleton.image {
		width: 64px;
		height: 64px;
		border-radius: 999px;
		background: #ccc;
	}

	.skeleton.text {
		width: 100%;
		height: 1em;
		background: #ccc;
		border-radius: 6px;
		margin-bottom: 3px;
	}
`;

export const toEmbed404 = async () => {
  return (
    <html>
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>404</title>
        <style dangerouslySetInnerHTML={{ __html: style }} />

      </head>
      <body>
        <header class="header">
          <div class="avatar">
            <div class="skeleton image" />
          </div>
          <div class="user">
            <div class="skeleton text" />
            <div class="skeleton text" />
          </div>
        </header>
        <div class="content">
					ノートを取得できませんでした。
        </div>
      </body>
    </html>
  );
};

export const toEmbedMisskeyNote = async (note: MisskeyNote, host: string) => {

  return (
    <html>
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Note of {note.user.username}</title>
        <style dangerouslySetInnerHTML={{ __html: style }} />

      </head>
      <body>
        <header class="header">
          <div class="avatar">
            <img src={note.user.avatarUrl} class="avatar-image" alt={note.user.username}/>
            { note.user.avatarDecorations.map(d => (
              <img src={d.url} class="decoration" style={`${d.angle ? `rotate: ${Math.floor(d.angle * 360)}deg;` : ''} ${d.flipH ? 'scale: -1 1;' : ''}`}/>
            ))}
          </div>
          <div class="user">
            <div class="name">{note.user.name || note.user.username}</div>
            <div class="username">@{note.user.username}@{host}</div>
          </div>
        </header>
        <div class="content">
          {note.text?.split('\n').map(line => (
            <p>{line}</p>
          ))}
        </div>
        {note.files.length > 0 && (
          <div class={`media size-${note.files.length}`}>
            {note.files.map(file => (
              <div class="media-item">
                {file.type.startsWith('image/') && (
                  <img src={file.url} alt={file.name}/>
                )}
                {file.type.startsWith('video/') && (
                  <video src={file.url} controls/>
                )}
                {file.type.startsWith('audio/') && (
                  <audio src={file.url} controls/>
                )}
              </div>
            ))}
          </div>
        )}
        <div class="time">
          <a href={`https://${host}/notes/${note.id}`} target="_blank" rel="noopener noreferrer">
            <time datetime={note.createdAt}>
              {new Date(note.createdAt).toLocaleString()}
            </time>
          </a>
        </div>
        <div class="show-on-misskey">
          <a class="show-on-misskey" href={`https://${host}/notes/${note.id}`} target="_blank" rel="noopener noreferrer">
						Misskey で表示する
          </a>
        </div>
      </body>
    </html>
  );
};
