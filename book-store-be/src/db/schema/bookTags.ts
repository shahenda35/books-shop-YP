import { pgTable, primaryKey, timestamp, integer } from 'drizzle-orm/pg-core';
import { books } from './books';
import { tags } from './tags';

export const bookTags = pgTable(
    'book_tags',
    {
        bookId: integer('book_id')
            .notNull()
            .references(() => books.id, { onDelete: 'cascade' }),
        tagId: integer('tag_id')
            .notNull()
            .references(() => tags.id, { onDelete: 'cascade' }),
        createdAt: timestamp('created_at').defaultNow().notNull(),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.bookId, table.tagId] }),
    })
);

export type BookTag = typeof bookTags.$inferSelect;
export type NewBookTag = typeof bookTags.$inferInsert;
