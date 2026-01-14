import { pgTable, uuid, primaryKey, timestamp } from 'drizzle-orm/pg-core';
import { books } from './books';
import { tags } from './tags';

export const bookTags = pgTable(
    'book_tags',
    {
        bookId: uuid('book_id')
            .notNull()
            .references(() => books.id, { onDelete: 'cascade' }),
        tagId: uuid('tag_id')
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
