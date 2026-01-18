import type { Context } from 'hono';
import { db } from '../../db';
import { categories } from '../../db/schema';
import { successResponse, errorResponse } from '../../utils/response';

export class CategoriesController {
  async list(c: Context) {
    try {
      const allCategories = await db.select().from(categories);
      return successResponse(c, allCategories);
    } catch (err) {
      return errorResponse(c, err instanceof Error ? err.message : 'Failed to list categories');
    }
  }
}
