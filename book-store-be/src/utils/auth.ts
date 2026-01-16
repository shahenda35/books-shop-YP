import jwt from 'jsonwebtoken';
import * as argon2 from 'argon2';
import { config } from '../config';

export const hashPassword = async (password: string): Promise<string> => {
    return argon2.hash(password, {
        type: argon2.argon2id,
        hashLength: 32,
    });
};

export const validatePassword = async (
    password: string,
    hashedPassword: string
): Promise<boolean> => {
    return argon2.verify(hashedPassword, password);
};

export const generateToken = (userId: number) => {
  const jti = crypto.randomUUID();

  const token = jwt.sign(
    { userId, jti },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );

  return { token, jti };
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, config.jwt.secret) as {
    userId: number;
    jti: string;
  };
};