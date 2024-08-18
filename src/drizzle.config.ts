import '@/drizzle/envConfig';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});

// export default defineConfig({
//   schema: './drizzle/schema.ts',
//   driver: 'pg',
//   dbCredentials: {
//     host: 'localhost',
//     port: '5432',
//     user: 'postgres',
//     password: 'admin',
//     database: 'car_be',
//     ssl: true, // can be
//   },
// });
