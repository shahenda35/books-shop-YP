import { db } from '../../db';
import { users, passwordResetTokens } from '../../db/schema';
import { eq, or, and } from 'drizzle-orm';
import { hashPassword, validatePassword, generateToken } from '../../utils/auth';
import { redis } from '../../config/redis';
import { config } from '../../config';
import type { ForgetPasswordInput, LoginInput, RegisterInput, ResetPasswordInput } from './auth.validation';

export class AuthService {
    async login(data: LoginInput) {
        const { identifier, password } = data;

        const user = await db.query.users.findFirst({
            where: or(eq(users.username, identifier), eq(users.email, identifier)),
        });

        if (!user) 
            throw new Error('Invalid credentials');
        
        const isPasswordValid = await validatePassword(password, user.password);
        if (!isPasswordValid) 
            throw new Error('Invalid credentials');

          const { token, jti } = generateToken(user.id);
        
         await redis.setEx(
    `auth:${jti}`,
    config.jwt.expiresInSeconds,
    user.id.toString()
  );
        return {
    token,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      fullName: user.fullName,
    },
  };
    }

    async register(data: RegisterInput) {
  const existingUser = await db.query.users.findFirst({
    where: or(eq(users.username, data.username), eq(users.email, data.email)),
  });

  if (existingUser) throw new Error('User already exists');

  const hashedPassword = await hashPassword(data.password);

  const [user] = await db.insert(users).values({
    ...data,
    password: hashedPassword,
  }).returning();

  const { token, jti } = generateToken(user.id);

  await redis.setEx(
    `auth:${jti}`,
    config.jwt.expiresInSeconds,
    user.id.toString()
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
    },
  };
}


 async logout(jti: string) {
  await redis.del(`auth:${jti}`);
  return { message: 'Logged out successfully' };
}
    async forgetPassword(data: ForgetPasswordInput) {
        const { email } = data;

        const user = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (!user) 
            throw new Error('User not found');
        
        const otp = config.otp.static;
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

         await db
    .delete(passwordResetTokens)
    .where(eq(passwordResetTokens.userId, user.id));


         await db.insert(passwordResetTokens).values({
    userId: user.id,
    otp,
    expiresAt,
  });

        return {
            message: 'OTP sent successfully',
            otp, 
        };
    }

    async resetPassword(data: ResetPasswordInput) {
        const { email, otp, newPassword } = data;

        const user = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (!user) 
            throw new Error('User not found');
        
         const resetToken = await db.query.passwordResetTokens.findFirst({
    where: and(
      eq(passwordResetTokens.userId, user.id),
      eq(passwordResetTokens.otp, otp)
    ),
  });

        if (!resetToken) 
            throw new Error('Invalid OTP');
        

        if (resetToken.expiresAt < new Date()) 
    throw new Error('OTP expired');
  
          const hashedPassword = await hashPassword(newPassword);

        await db
            .update(users)
            .set({
                password: hashedPassword,
                updatedAt: new Date(),
            })
            .where(eq(users.id, user.id));

        await db
    .delete(passwordResetTokens)
    .where(eq(passwordResetTokens.id, resetToken.id));

        return { message: 'Password reset successfully' };
    }
}