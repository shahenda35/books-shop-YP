import type { Context } from 'hono';
import { successResponse, errorResponse } from '../../utils/response';
import { ProfileService } from './profile.service';

const profileService = new ProfileService();

export class ProfileController {
  async getProfile(c: Context) {
    try {
      const userId = c.get('userId');
      const user = await profileService.getProfile(userId);
      return successResponse(c, user, 'User profile fetched');
    } catch (err) {
      return errorResponse(c, err instanceof Error ? err.message : 'Failed to fetch profile', 400);
    }
  }

  async updateProfile(c: Context) {
    try {
      const userId = c.get('userId');
      const data = c.get('validatedData');
      const user = await profileService.updateProfile(userId, data);
      return successResponse(c, user, 'Profile updated successfully');
    } catch (err) {
      return errorResponse(c, err instanceof Error ? err.message : 'Failed to update profile', 400);
    }
  }

  async changePassword(c: Context) {
    try {
      const userId = c.get('userId');
      const { currentPassword, newPassword } = c.get('validatedData');
      const result = await profileService.changePassword(userId, currentPassword, newPassword);
      return successResponse(c, result, 'Password changed successfully');
    } catch (err) {
      return errorResponse(c, err instanceof Error ? err.message : 'Failed to change password', 400);
    }
  }
}
