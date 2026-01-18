import dotenv from 'dotenv';
import type { Secret, SignOptions } from 'jsonwebtoken';

dotenv.config();

export const config = {
    port: Number(process.env.PORT ?? 3000),
    nodeEnv: process.env.NODE_ENV ?? 'development',

    databaseUrl: process.env.DATABASE_URL ?? '',

    jwt: {
    secret: process.env.JWT_SECRET as Secret,
    expiresIn: (process.env.JWT_EXPIRES_IN ?? '7d') as SignOptions['expiresIn'],
    expiresInSeconds: Number(process.env.JWT_EXPIRES_IN_SECONDS ?? 60 * 60 * 24 * 7),
  },

    redis: {
        host: process.env.REDIS_HOST ?? 'localhost',
        port: Number(process.env.REDIS_PORT ?? 6379),
        password: process.env.REDIS_PASSWORD || undefined,
    },

    otp: {
        static: '123456',
    },
};
