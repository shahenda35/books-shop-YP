import { describe, it, expect } from 'vitest';
import { CreateBookSchema } from './books.validation';

describe('Book Validation', () => {
  describe('bookSchema validation', () => {
    it('should validate a correct book object', () => {
      const validBook = {
        title: 'Test Book',
        description: 'A test book',
        price: 29.99,
        thumbnail: 'https://example.com/image.jpg',
        authorId: 1,
        categoryId: 1,
        tagIds: [1, 2],
      };

      const result = CreateBookSchema.safeParse(validBook);
      expect(result.success).toBe(true);
    });

    it('should fail validation if title is empty', () => {
      const invalidBook = {
        title: '',
        description: 'A test book',
        price: 29.99,
        thumbnail: 'https://example.com/image.jpg',
        authorId: 1,
        categoryId: 1,
        tagIds: [],
      };

      const result = CreateBookSchema.safeParse(invalidBook);
      expect(result.success).toBe(false);
    });

    it('should fail validation if price is negative', () => {
      const invalidBook = {
        title: 'Test Book',
        description: 'A test book',
        price: -10,
        thumbnail: 'https://example.com/image.jpg',
        authorId: 1,
        categoryId: 1,
      };

      const result = CreateBookSchema.safeParse(invalidBook);
      expect(result.success).toBe(false);
    });

    it('should fail validation if authorId or categoryId is missing', () => {
      const invalidBook = {
        title: 'Test Book',
        description: 'A test book',
        price: 29.99,
        thumbnail: 'https://example.com/image.jpg',
      } as any;

      const result = CreateBookSchema.safeParse(invalidBook);
      expect(result.success).toBe(false);
    });

    it('should accept optional thumbnail and description', () => {
      const validBook = {
        title: 'Test Book',
        price: 29.99,
        authorId: 1,
        categoryId: 1,
      };

      const result = CreateBookSchema.safeParse(validBook);
      expect(result.success).toBe(true);
    });

    it('should fail if thumbnail URL is invalid', () => {
      const invalidBook = {
        title: 'Test Book',
        description: 'A test book',
        price: 29.99,
        thumbnail: 'not-a-valid-url',
        authorId: 1,
        categoryId: 1,
      };

      const result = CreateBookSchema.safeParse(invalidBook);
      expect(result.success).toBe(false);
    });
  });
});
