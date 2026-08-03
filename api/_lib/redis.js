const UPSTASH_URL = (process.env.UPSTASH_REDIS_REST_URL || '').replace(/\/$/, '');
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function redisCommand(command, ...args) {
    if (!UPSTASH_URL || !UPSTASH_TOKEN) {
        throw new Error('Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN');
    }
    const path = [command, ...args.map(a => encodeURIComponent(String(a)))].join('/');
    const response = await fetch(`${UPSTASH_URL}/${path}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${UPSTASH_TOKEN}`,
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
