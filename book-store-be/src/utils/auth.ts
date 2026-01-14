import jwt from 'jsonwebtoken';
import * as argon2 from 'argon2';
import { config } from '../config';

export const hashPassword = async (password: string): Promise<string> => {
    return argon2.hash(password, {
        type: argon2.argon2id,
        hashLength: 32,
    });
};

export const comparePassword = async (
    password: string,
    hashedPassword: string
): Promise<boolean> => {
    return argon2.verify(hashedPassword, password);
};

export const generateToken = (userId: string): string => {
    return jwt.sign(
        { userId },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
    );
};

export const verifyToken = (token: string): { userId: string } => {
    const payload = jwt.verify(token, config.jwt.secret) as jwt.JwtPayload;

    if (!payload.userId) {
        throw new Error('Invalid token payload');
    }

    return { userId: payload.userId as string };
};
