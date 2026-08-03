import { redisCommand } from './_lib/redis.js';

const ROOM_EXPIRE = 3600;

function generateRoomCode() {
    return Math.floor(10000 + Math.random() * 90000).toString();
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { userId, nickname } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        let roomCode;
        let isUnique = false;

        while (!isUnique) {
            roomCode = generateRoomCode();
            const exists = await redisCommand('exists', `room:${roomCode}:members`);
            if (!exists) {
                isUnique = true;
            }
        }

        await redisCommand('sadd', `room:${roomCode}:members`, userId);
        await redisCommand('expire', `room:${roomCode}:members`, ROOM_EXPIRE);
        await redisCommand('hset', `room:${roomCode}:info:${userId}`, 'nickname', nickname || 'Anonymous');
        await redisCommand('expire', `room:${roomCode}:info:${userId}`, ROOM_EXPIRE);

        return res.status(200).json({ roomCode, message: 'Room created successfully' });
    } catch (error) {
        console.error('Error creating room:', error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}
