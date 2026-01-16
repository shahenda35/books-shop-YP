import { z } from 'zod';

export const CreateBookSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive(),
  thumbnail: z.string().url().optional(),
  authorId: z.number(),
  categoryId: z.number(),
});

export const UpdateBookSchema = CreateBookSchema.partial();

export const BookListQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  sort: z.enum(['asc', 'desc']).optional(),
});
