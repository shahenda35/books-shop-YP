import { db } from '../../db';
import { books, authors, categories, bookTags, tags } from '../../db/schema';
import { eq, ilike, sql, and, count } from 'drizzle-orm';
import type { NewBook } from '../../db/schema/books';

type BookQuery = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: 'asc' | 'desc';
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
};


export class BooksService {
  async listBooks(query: BookQuery) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const offset = (page - 1) * limit;

    const searchFilter = query.search
      ? ilike(books.title, `%${query.search}%`)
      : undefined;

    const categoryFilter = query.categoryId ? eq(books.categoryId, query.categoryId) : undefined;

    const priceFilter = query.minPrice !== undefined && query.maxPrice !== undefined
      ? and(sql`${books.price} >= ${query.minPrice}`, sql`${books.price} <= ${query.maxPrice}`)
      : undefined;

    const sortOrder = query.sort === 'desc' ? sql`${books.title} DESC` : sql`${books.title} ASC`;

    const [{ totalCount }] = await db
      .select({ totalCount: count() })
      .from(books)
      .where(and(searchFilter, categoryFilter, priceFilter));

    const bookList = await db
      .select()
      .from(books)
      .leftJoin(authors, eq(authors.id, books.authorId))
      .leftJoin(categories, eq(categories.id, books.categoryId))
      .where(and(searchFilter, categoryFilter, priceFilter))
      .orderBy(sortOrder)
      .limit(limit)
      .offset(offset);

    const data = await Promise.all(bookList.map(async (b) => {
      const bookTagsList = await db
        .select({ id: tags.id, name: tags.name })
        .from(bookTags)
        .leftJoin(tags, eq(tags.id, bookTags.tagId))
        .where(eq(bookTags.bookId, b.books.id));

      return {
        id: b.books.id,
        title: b.books.title,
        description: b.books.description,
        price: Number(b.books.price),
        thumbnail: b.books.thumbnail,
        author: b.authors?.name,
        authorId: b.books.authorId,
        category: b.categories?.name,
        categoryId: b.books.categoryId,
        tags: bookTagsList.map(t => ({ id: t.id, name: t.name })),
      };
    }));

    return {
      data,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
    };
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

    const bookTagsList = await db
      .select({ id: tags.id, name: tags.name })
      .from(bookTags)
      .leftJoin(tags, eq(tags.id, bookTags.tagId))
      .where(eq(bookTags.bookId, bookId));

    return {
      id: book[0].books.id,
      title: book[0].books.title,
      description: book[0].books.description,
      price: Number(book[0].books.price),
      thumbnail: book[0].books.thumbnail,
      author: book[0].authors?.name,
      authorId: book[0].books.authorId,
      category: book[0].categories?.name,
      categoryId: book[0].books.categoryId,
      userId: book[0].books.userId,
      createdAt: book[0].books.createdAt,
      tags: bookTagsList.map(t => ({ id: t.id, name: t.name })),
    };
  }

  async createBook(userId: string, data: NewBook & { tagIds?: number[] }) {
    const [author] = await db.select().from(authors).where(eq(authors.id, data.authorId)).limit(1);
    if (!author) throw new Error('Author not found');

    const [category] = await db.select().from(categories).where(eq(categories.id, data.categoryId)).limit(1);
    if (!category) throw new Error('Category not found');

    const { tagIds, ...bookData } = data;

    const [book] = await db
      .insert(books)
      .values({
        ...bookData,
        userId: Number(userId),
      })
      .returning();

    if (tagIds?.length) 
      await db.insert(bookTags).values(
        tagIds.map((tagId: number) => ({
          bookId: book.id,
          tagId,
        }))
      );

    const bookTagsList = await db
      .select({ id: tags.id, name: tags.name })
      .from(bookTags)
      .leftJoin(tags, eq(tags.id, bookTags.tagId))
      .where(eq(bookTags.bookId, book.id));

    return {
      ...book,
      tags: bookTagsList.map(t => ({ id: t.id, name: t.name })),
    };
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

   async myBooks(
    userId: number,
    query: { page?: number; limit?: number; search?: string; sort?: 'asc' | 'desc' }
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const offset = (page - 1) * limit;

    const whereConditions = [
      eq(books.userId, userId),
      query.search ? ilike(books.title, `%${query.search}%`) : undefined,
    ].filter(Boolean);

    const orderBy =
      query.sort === 'desc'
        ? sql`${books.title} DESC`
        : sql`${books.title} ASC`;

    const [{ totalCount }] = await db
      .select({ totalCount: count() })
      .from(books)
      .where(and(...whereConditions));

    const rows = await db
      .select()
      .from(books)
      .leftJoin(authors, eq(authors.id, books.authorId))
      .leftJoin(categories, eq(categories.id, books.categoryId))
      .where(and(...whereConditions))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    const data = await Promise.all(rows.map(async (r) => {
      const bookTagsList = await db
        .select({ id: tags.id, name: tags.name })
        .from(bookTags)
        .leftJoin(tags, eq(tags.id, bookTags.tagId))
        .where(eq(bookTags.bookId, r.books.id));

      return {
        id: r.books.id,
        title: r.books.title,
        description: r.books.description,
        price: Number(r.books.price),
        thumbnail: r.books.thumbnail,
        author: r.authors?.name,
        authorId: r.books.authorId,
        category: r.categories?.name,
        categoryId: r.books.categoryId,
        tags: bookTagsList.map(t => ({ id: t.id, name: t.name })),
      };
    }));

    return {
      data,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
    };
  }
}
