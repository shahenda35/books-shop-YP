import { db } from '../../db';
import { books, authors, categories } from '../../db/schema';
import { eq, like, sql, and } from 'drizzle-orm';
import type { NewBook } from '../../db/schema/books';

export class BooksService {
  async listBooks(query: { page?: number; limit?: number; search?: string; sort?: 'asc' | 'desc' }) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const offset = (page - 1) * limit;

    const searchFilter = query.search
      ? like(books.title, `%${query.search}%`)
      : undefined;

    const sortOrder = query.sort === 'desc' ? sql`${books.title} DESC` : sql`${books.title} ASC`;

    const bookList = await db
      .select()
      .from(books)
      .leftJoin(authors, eq(authors.id, books.authorId))
      .leftJoin(categories, eq(categories.id, books.categoryId))
      .where(searchFilter ? searchFilter : undefined)
      .orderBy(sortOrder)
      .limit(limit)
      .offset(offset);

    return bookList.map((b) => ({
      id: b.books.id,
      title: b.books.title,
      description: b.books.description,
      price: Number(b.books.price),
      thumbnail: b.books.thumbnail,
      author: b.authors?.name,
      category: b.categories?.name,
    }));
  }

  async getBook(bookId: number) {
    const book = await db
      .select()
      .from(books)
      .leftJoin(authors, eq(authors.id, books.authorId))
      .leftJoin(categories, eq(categories.id, books.categoryId))
      .where(eq(books.id, bookId))
      .limit(1);

    if (!book[0]) throw new Error('Book not found');

    return {
      id: book[0].books.id,
      title: book[0].books.title,
      description: book[0].books.description,
      price: Number(book[0].books.price),
      thumbnail: book[0].books.thumbnail,
      author: book[0].authors?.name,
      category: book[0].categories?.name,
    };
  }

  async createBook(userId: string, data: NewBook) {
    const [book] = await db.insert(books).values({ ...data, userId: Number(userId) }).returning();
    return book;
  }

  async updateBook(userId: string, bookId: number, data: Partial<NewBook>) {
    const [book] = await db
      .update(books)
      .set(data)
      .where(and(eq(books.id, bookId), eq(books.userId, Number(userId))))
      .returning();

    if (!book) throw new Error('Book not found or not owned by you');
    return book;
  }

  async deleteBook(userId: string, bookId: number) {
    const deleted = await db
      .delete(books)
      .where(and(eq(books.id, bookId), eq(books.userId, Number(userId))))
      .returning();


    if (!deleted.length) throw new Error('Book not found or not owned by you');
    return { message: 'Book deleted successfully' };
  }
}
