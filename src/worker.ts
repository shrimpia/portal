import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { URL_EMPIRE } from './const';
import { generateToken } from './services/generate-token';

import { getShrimpiaPlus } from './services/get-shrimpia-plus';
import { MisskeyUser } from './models/user';

const app = new Hono<{
	Bindings: {
		DB: D1Database;
	};
}>();

app.use('*', cors());

app.post('/miauth', async c => {
	const { sessionId } = await c.req.json<{sessionId: string}>();
	if (sessionId == null) {
		c.status(400);
		return c.json({
			error: 'Missing sessionId',
		});
	}

	const res = await fetch(`${URL_EMPIRE}/api/miauth/${sessionId}/check`, {
		method: 'POST',
	});

	if (!res.ok) {
		c.status(400);
		return c.json({
			error: 'Failed to check MiAuth session',
		});
	}

	const data = await res.json() as { token: string, user: Record<string, unknown> };
	console.log(`username: ${data.user.username}`);
	const user = await c.env.DB.prepare('SELECT * FROM user WHERE username = ?')
		.bind(data.user.username)
		.first();

	let portalToken: string;

	if (user) {
		portalToken = user.portal_token as string;
		await c.env.DB.prepare('UPDATE user SET misskey_token = ?')
			.bind(data.token)
			.run();
	} else {
		portalToken = generateToken();
		await c.env.DB.prepare('INSERT INTO user (portal_token, misskey_token, username) VALUES (?, ?, ?)')
			.bind(portalToken, data.token, data.user.username)
			.run();
	}

	return c.json({
		token: portalToken,
	});
});

app.get('/misskey-user', async c => {
	const token = c.req.header('X-Shrimpia-Token');
	if (token == null) {
		c.status(400);
		return c.json({
			error: 'Missing token',
		});
	}
	const results = await c.env.DB.prepare('SELECT misskey_token FROM user WHERE portal_token = ?')
		.bind(token)
		.first();

	if (results == null) {
		c.status(400);
		return c.json({
			error: 'Invalid token',
		});
	}

	const i: MisskeyUser = await fetch(`${URL_EMPIRE}/api/i`, {
		headers: {
			'Content-Type': 'application/json'
		},
		method: 'POST',
		body: JSON.stringify({
			i: results.misskey_token,
		}),
	}).then(res => res.json());

	return c.json({
		username: i.username,
		name: i.name || i.username,
		shrimpiaPlus: getShrimpiaPlus(i),
		isEmperor: i.isAdmin,
	});
});

export default app;
