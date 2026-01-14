import { pgTable, varchar, timestamp, integer } from 'drizzle-orm/pg-core';

export const tags = pgTable('tags', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),    name: varchar('name', { length: 50 }).notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
