import { describe, it, expect } from 'vitest';
import {
  bookSchema,
  changePasswordSchema,
  loginSchema,
  resetPasswordSchema,
} from './validation';

const validBook = {
  title: 'Clean Code',
  description: 'A book about writing better code',
  price: 25,
  thumbnail: 'https://example.com/image.jpg',
  authorId: 1,
  categoryId: 2,
  tagIds: [1, 2],
};

describe('validation schemas', () => {
  it('accepts a valid book payload and rejects invalid price/category', () => {
    const result = bookSchema.safeParse(validBook);
    expect(result.success).toBe(true);

    const badPrice = bookSchema.safeParse({ ...validBook, price: -5 });
    expect(badPrice.success).toBe(false);
    if (!badPrice.success) {
      expect(badPrice.error.issues[0].message).toBe('Price must be positive');
    }

    const missingCategory = bookSchema.safeParse({ ...validBook, categoryId: 0 });
    expect(missingCategory.success).toBe(false);
    if (!missingCategory.success) {
      expect(missingCategory.error.issues[0].message).toBe('Category is required');
    }
  });

  it('requires identifier and password lengths for login', () => {
    const ok = loginSchema.safeParse({ identifier: 'user@mail.com', password: '123456' });
    expect(ok.success).toBe(true);

    const shortId = loginSchema.safeParse({ identifier: 'ab', password: '123456' });
    expect(shortId.success).toBe(false);
    if (!shortId.success) {
      expect(shortId.error.issues[0].message).toBe('Please enter email or username');
    }
  });

  it("ensures reset password fields match and OTP length is correct", () => {
    const mismatch = resetPasswordSchema.safeParse({
      email: 'user@mail.com',
      otp: '123456',
      newPassword: '123456',
      confirmPassword: '654321',
    });
    expect(mismatch.success).toBe(false);
    if (!mismatch.success) {
      const messages = mismatch.error.issues.map((i) => i.message);
      expect(messages).toContain("Passwords don't match");
    }

    const shortOtp = resetPasswordSchema.safeParse({
      email: 'user@mail.com',
      otp: '123',
      newPassword: '123456',
      confirmPassword: '123456',
    });
    expect(shortOtp.success).toBe(false);
    if (!shortOtp.success) {
      expect(shortOtp.error.issues[0].message).toBe('OTP must be 6 digits');
    }
  });

  it('validates change password schema consistency', () => {
    const mismatch = changePasswordSchema.safeParse({
      currentPassword: '123456',
      newPassword: 'abcdef',
      confirmPassword: 'abcdeg',
    });
    expect(mismatch.success).toBe(false);
    if (!mismatch.success) {
      expect(mismatch.error.issues[0].message).toBe("Passwords don't match");
    }
  });
});
