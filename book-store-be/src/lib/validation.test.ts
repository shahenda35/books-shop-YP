import { describe, it, expect } from 'vitest';
import { loginSchema, forgetPasswordSchema, resetPasswordSchema } from '../modules/auth/auth.validation';
import { UpdateProfileSchema, ChangePasswordSchema } from '../modules/profile/profile.validation';

describe('Auth Validation Schemas', () => {
  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const validLogin = {
        identifier: 'testuser',
        password: 'password123',
      };

      const result = loginSchema.safeParse(validLogin);
      expect(result.success).toBe(true);
    });

    it('should fail if identifier is empty', () => {
      const invalidLogin = {
        identifier: '',
        password: 'password123',
      };

      const result = loginSchema.safeParse(invalidLogin);
      expect(result.success).toBe(false);
    });

    it('should fail if password is too short', () => {
      const invalidLogin = {
        identifier: 'testuser',
        password: '12345',
      };

      const result = loginSchema.safeParse(invalidLogin);
      expect(result.success).toBe(false);
    });
  });

  describe('profileSchema', () => {
    it('should validate correct profile data', () => {
      const validProfile = {
        fullName: 'John Doe',
        email: 'john@example.com',
      };

      const result = UpdateProfileSchema.safeParse(validProfile);
      expect(result.success).toBe(true);
    });

    it('should fail if email is invalid', () => {
      const invalidProfile = {
        fullName: 'John Doe',
        email: 'not-an-email',
      };

      const result = UpdateProfileSchema.safeParse(invalidProfile);
      expect(result.success).toBe(false);
    });

    it('should fail if fullName is too short', () => {
      const invalidProfile = {
        fullName: 'J',
        email: 'john@example.com',
      };

      const result = UpdateProfileSchema.safeParse(invalidProfile);
      expect(result.success).toBe(false);
    });
  });

  describe('forgetPasswordSchema', () => {
    it('should validate correct email', () => {
      const validData = {
        email: 'test@example.com',
      };

      const result = forgetPasswordSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail if email is invalid', () => {
      const invalidData = {
        email: 'invalid-email',
      };

      const result = forgetPasswordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('changePassword (profile) schema', () => {
    it('should validate correct password change data', () => {
      const validData = {
        currentPassword: 'oldPassword123',
        newPassword: 'newPassword123',
        confirmPassword: 'newPassword123',
      };

      const result = ChangePasswordSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail if passwords do not match', () => {
      const invalidData = {
        currentPassword: 'oldPassword123',
        newPassword: 'newPassword123',
        confirmPassword: 'differentPassword123',
      };

      const result = ChangePasswordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should fail if new password is too short', () => {
      const invalidData = {
        currentPassword: 'oldPassword123',
        newPassword: '12345',
        confirmPassword: '12345',
      };

      const result = ChangePasswordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('resetPasswordSchema', () => {
    it('should validate correct reset data', () => {
      const validData = {
        email: 'test@example.com',
        otp: '123456',
        newPassword: 'newPassword123',
        confirmPassword: 'newPassword123',
      };

      const result = resetPasswordSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail if otp length is not 6', () => {
      const invalidData = {
        email: 'test@example.com',
        otp: '12345',
        newPassword: 'newPassword123',
        confirmPassword: 'newPassword123',
      };

      const result = resetPasswordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should fail if passwords do not match', () => {
      const invalidData = {
        email: 'test@example.com',
        otp: '123456',
        newPassword: 'newPassword123',
        confirmPassword: 'differentPassword123',
      };

      const result = resetPasswordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
