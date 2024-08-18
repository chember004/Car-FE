import '@/drizzle/envConfig';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import { users, NewUser } from './schema';
import * as schema from './schema';

export const db = drizzle(sql, { schema });

export const insertUser = async (user: NewUser) => {
  return db.insert(users).values(user).returning();
};

// import { sql } from '@vercel/postgres';
// import { drizzle } from 'drizzle-orm/vercel-postgres';
// import { config } from 'dotenv';
// config({ path: '.env.local' }); // or .env
// export const db = drizzle(sql);
