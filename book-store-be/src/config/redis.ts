import { createClient } from 'redis';
import { config } from './index';

const redisClient = createClient({
    socket: {
        host: config.redis.host,
        port: config.redis.port,
        reconnectStrategy: (retries) => {
            if (retries > 3) {
                console.warn('Redis connection failed after 3 attempts. Continuing without Redis caching.');
                return new Error('Max retries reached');
            }
            return Math.min(retries * 100, 3000);
        },
    },
    password: config.redis.password,
});

let hasLoggedError = false;

redisClient.on('error', (err) => {
    if (!hasLoggedError) {
        console.warn('Redis Client Warning: Connection failed');
        console.warn('The app will work but session storage is disabled. Install Redis for full functionality.');
        hasLoggedError = true;
    }
});
redisClient.on('connect', () => {
    console.log('Redis Client Connected');
    hasLoggedError = false;
});

await redisClient.connect();

export const redis = redisClient;
