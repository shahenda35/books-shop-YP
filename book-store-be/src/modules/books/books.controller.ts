import type { Context } from 'hono';
import { BooksService } from './books.service';
import { successResponse, errorResponse } from '../../utils/response';

const booksService = new BooksService();

export class BooksController {
  async list(c: Context) {
    try {
      const query = c.req.query();
      const books = await booksService.listBooks({
        page: Number(query.page) || 1,
        limit: Number(query.limit) || 10,
        search: query.search,
        sort: query.sort as 'asc' | 'desc' | undefined,
        categoryId: query.categoryId ? Number(query.categoryId) : undefined,
        minPrice: query.minPrice ? Number(query.minPrice) : undefined,
        maxPrice: query.maxPrice ? Number(query.maxPrice) : undefined,
      });
      return successResponse(c, books);
    } catch (err) {
      return errorResponse(c, err instanceof Error ? err.message : 'Failed to list books');
    }
  }

  async get(c: Context) {
    try {
      const bookId = Number(c.req.param('id'));
      const book = await booksService.getBook(bookId);
      return successResponse(c, book);
    } catch (err) {
      return errorResponse(c, err instanceof Error ? err.message : 'Failed to get book');
    }
  }

  async create(c: Context) {
    try {
      const userId = c.get('userId');
      const data = c.get('validatedData');
      const book = await booksService.createBook(userId, data);
      return successResponse(c, book, 'Book created');
    } catch (err) {
      return errorResponse(c, err instanceof Error ? err.message : 'Failed to create book');
    }
  }

  async update(c: Context) {
    try {
      const userId = c.get('userId');
      const bookId = Number(c.req.param('id'));
      const data = c.get('validatedData');
      const book = await booksService.updateBook(userId, bookId, data);
      return successResponse(c, book, 'Book updated');
    } catch (err) {
      return errorResponse(c, err instanceof Error ? err.message : 'Failed to update book');
    }
  }

  async delete(c: Context) {
    try {
      const userId = c.get('userId');
      const bookId = Number(c.req.param('id'));
      const result = await booksService.deleteBook(userId, bookId);
      return successResponse(c, result, 'Book deleted');
    } catch (err) {
      return errorResponse(c, err instanceof Error ? err.message : 'Failed to delete book');
    }
  }

   async myBooks(c: Context) {
    try {
      const userId = Number(c.get('userId'));
      const query = c.req.query();

      const books = await booksService.myBooks(userId, {
        page: Number(query.page),
        limit: Number(query.limit),
        search: query.search,
        sort: query.sort as 'asc' | 'desc',
      });

      return successResponse(c, books);
    } catch{
      return errorResponse(c, 'Failed to fetch my books');
    }
  }
}
