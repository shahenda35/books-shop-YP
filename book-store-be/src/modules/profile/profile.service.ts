import { db } from '../../db';
import { users } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, validatePassword } from '../../utils/auth';

export class ProfileService {
  async getProfile(userId: string) {
    const user = await db.query.users.findFirst({ where: eq(users.id, Number(userId)) });
    if (!user) throw new Error('User not found');
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
    };
  }

  async updateProfile(userId: string, data: { fullName?: string; phoneNumber?: string , username?: string}) {
    const [updatedUser] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, Number(userId)))
      .returning();
    return {
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      fullName: updatedUser.fullName,
      phoneNumber: updatedUser.phoneNumber,
    };
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await db.query.users.findFirst({ where: eq(users.id, Number(userId)) });
    if (!user) throw new Error('User not found');

    const valid = await validatePassword(currentPassword, user.password);
    if (!valid) throw new Error('Current password is incorrect');

    const hashedPassword = await hashPassword(newPassword);

    await db.update(users).set({ password: hashedPassword, updatedAt: new Date() }).where(eq(users.id, Number(userId)));

    return { message: 'Password changed successfully' };
  }
}
