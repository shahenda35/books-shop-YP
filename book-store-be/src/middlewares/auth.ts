import type { Context, Next } from 'hono';
import { redis } from '../config/redis';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export const authMiddleware = async (c : Context, next: Next) => {
  const authHeader = c.req.header('authorization');
  if (!authHeader) throw new Error('Unauthorized');

  const token = authHeader.replace('Bearer ', '');
 
  try {
    const payload = jwt.verify(token, config.jwt.secret) as { userId: string; jti?: string };
    if (!payload.userId) throw new Error();

    if (payload.jti) {
      const session = await redis.get(`auth:${payload.jti}`);
      if (!session) return c.json({ error: 'Session expired' }, 401);
    }

    c.set('userId', payload.userId);
    c.set('jti', payload.jti);
    await next();
  } catch {
    return c.json({ error: 'Invalid token' }, 401);
  }

};

