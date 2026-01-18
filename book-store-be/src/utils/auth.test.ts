import { describe, it, expect } from 'vitest';
import { hashPassword, validatePassword } from './auth';

describe('Password Hashing', () => {
  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'testPassword123';
      const hash = await hashPassword(password);
      
      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(typeof hash).toBe('string');
    });

    it('should produce different hashes for the same password', async () => {
      const password = 'testPassword123';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);
      
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('verifyPassword', () => {
    it('should verify a correct password', async () => {
      const password = 'testPassword123';
      const hash = await hashPassword(password);
      const isValid = await validatePassword(password, hash);
      
      expect(isValid).toBe(true);
    });

    it('should reject an incorrect password', async () => {
      const password = 'testPassword123';
      const wrongPassword = 'wrongPassword123';
      const hash = await hashPassword(password);
      const isValid = await validatePassword(wrongPassword, hash);
      
      expect(isValid).toBe(false);
    });

    it('should be case sensitive', async () => {
      const password = 'TestPassword123';
      const differentCase = 'testpassword123';
      const hash = await hashPassword(password);
      const isValid = await validatePassword(differentCase, hash);
      
      expect(isValid).toBe(false);
    });
  });
});
