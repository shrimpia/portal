export interface Env {
	portal: KVNamespace;
}

export default {
	async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
		console.log(`${event.cron} が発火しました。`);

		const res = await fetch('https://mk.shrimpia.network/api/emojis', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: '{}',
		});

		if (!res.ok) {
			console.error('Misskeyへのリクエストに失敗しました。処理を中断します。');
			return;
		}

		const emojis = await res.json();

		await env.portal.put('emojis', JSON.stringify(emojis));
		console.info('絵文字キャッシュを更新しました。');
	},
};
