function getConfig() {
    const url = (
        process.env.KV_REST_API_URL ||
        process.env.UPSTASH_REDIS_REST_URL ||
        ''
    ).replace(/\/$/, '');
    const token = (
        process.env.KV_REST_API_TOKEN ||
        process.env.UPSTASH_REDIS_REST_TOKEN ||
        ''
    );
    return { url, token };
}

async function redisCommand(command, ...args) {
    const { url, token } = getConfig();
    if (!url || !token) {
        throw new Error('Missing KV/Upstash REST credentials in environment variables');
    }
    const path = [command, ...args.map(a => encodeURIComponent(String(a)))].join('/');
    const response = await fetch(`${url}/${path}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Upstash error ${response.status}: ${text}`);
    }
    const data = await response.json();
    if (data.error) {
        throw new Error(data.error);
    }
    return data.result;
}

export { redisCommand };
