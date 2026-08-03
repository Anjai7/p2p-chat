import { redisCommand } from './_lib/redis.js';

const ROOM_EXPIRE = 3600;

export default async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { roomCode, userId } = req.query;

        if (!roomCode || !userId) {
            return res.status(400).json({ error: 'Room code and user ID are required' });
        }

        await redisCommand('expire', `room:${roomCode}:members`, ROOM_EXPIRE);

        const messages = await redisCommand('lpop', `room:${roomCode}:signals:${userId}`, 10);

        if (!messages) {
            return res.status(200).json({ signals: [] });
        }

        const parsedSignals = messages.map(msg => JSON.parse(msg));

        return res.status(200).json({ signals: parsedSignals });
    } catch (error) {
        console.error('Error polling signals:', error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}
