import { pgTable, text, varchar, timestamp, uuid, integer } from 'drizzle-orm/pg-core';

export const refreshToken = pgTable('refresh_token', {
     id:integer("id")
        .primaryKey()
        .generatedAlwaysAsIdentity(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    name: varchar('name', { length: 100 }).notNull().unique(),
    token: text('token').notNull(),
    jti: varchar('jti', { length: 255 }).notNull().unique(),
    userId: integer('user_id').notNull(),
});

export type refreshToken = typeof refreshToken.$inferSelect;
export type newRefreshToken = typeof refreshToken.$inferInsert;
