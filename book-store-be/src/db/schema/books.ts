import { pgTable, text, varchar, timestamp, decimal, integer } from 'drizzle-orm/pg-core';
import { users } from './users';
import { categories } from './categories';
import { authors } from './authors';

export const books = pgTable('books', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    price: decimal('price', { precision: 10, scale: 2 }).notNull(),
    thumbnail: text('thumbnail'),
    authorId: integer('author_id')
        .notNull()
        .references(() => authors.id, { onDelete: 'cascade' }),
    categoryId: integer('category_id')
        .notNull()
        .references(() => categories.id, { onDelete: 'cascade' }),
    userId: integer('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Book = typeof books.$inferSelect;
export type NewBook = typeof books.$inferInsert;
