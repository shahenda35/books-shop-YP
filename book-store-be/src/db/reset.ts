import dotenv from 'dotenv';
import { sql } from 'drizzle-orm';
import { db } from './index';
import postgres from 'postgres';

dotenv.config();

async function reset() {
  try {
    console.log('🔥 Resetting database...');

    await db.execute(sql`DROP SCHEMA IF EXISTS public CASCADE`);
    await db.execute(sql`CREATE SCHEMA public`);

    console.log('✅ Database reset');
    process.exit(0);
  } catch (err) {
    console.error('❌ Reset failed:', err);
    process.exit(1);
  }
}

reset();
