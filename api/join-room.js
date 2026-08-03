import { redisCommand } from './_lib/redis.js';

const ROOM_EXPIRE = 3600;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { roomCode, userId, nickname } = req.body;

        if (!roomCode || !userId) {
            return res.status(400).json({ error: 'Room code and user ID are required' });
        }

        const roomExists = await redisCommand('exists', `room:${roomCode}:members`);
        if (!roomExists) {
            return res.status(404).json({ error: 'Room not found or expired' });
        }

        const members = await redisCommand('smembers', `room:${roomCode}:members`);

        for (const member of members) {
            if (member !== userId) {
                const signalMessage = JSON.stringify({
                    type: 'peer-joined',
                    from: userId,
                    nickname: nickname || 'Anonymous',
                });
                await redisCommand('rpush', `room:${roomCode}:signals:${member}`, signalMessage);
                await redisCommand('expire', `room:${roomCode}:signals:${member}`, ROOM_EXPIRE);
            }
        }

        await redisCommand('sadd', `room:${roomCode}:members`, userId);
        await redisCommand('hset', `room:${roomCode}:info:${userId}`, 'nickname', nickname || 'Anonymous');
        await redisCommand('expire', `room:${roomCode}:info:${userId}`, ROOM_EXPIRE);

        return res.status(200).json({
            message: 'Joined room successfully',
            existingMembers: members,
        });
    } catch (error) {
        console.error('Error joining room:', error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}
