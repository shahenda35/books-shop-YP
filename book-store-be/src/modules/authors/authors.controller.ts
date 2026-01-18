import type { Context } from 'hono';
import { db } from '../../db';
import { authors } from '../../db/schema';
import { successResponse, errorResponse } from '../../utils/response';

export class AuthorsController {
  async list(c: Context) {
    try {
      const allAuthors = await db.select().from(authors);
      return successResponse(c, allAuthors);
    } catch (err) {
      return errorResponse(c, err instanceof Error ? err.message : 'Failed to list authors');
    }
  }
}
