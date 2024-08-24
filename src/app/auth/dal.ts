import 'server-only';

import { db } from '@/drizzle/db';
import { and, eq } from 'drizzle-orm';
import { cache } from 'react';
import { users } from '@/drizzle/schema';
import { verifySession } from '@/app/auth/stateless-session';

export const getUser = cache(async () => {
  const session = await verifySession();
  if (!session) return null;
  console.log('getUser func session', session);
  try {
    const data = await db.query.users.findMany({
      where: eq(users.id, session.userId),

      // Explicitly return the columns you need rather than the whole user object
      columns: {
        id: true,
        username: true,
        email: true,
      },
    });
    console.log('getUser func data ', data);
    const user = data[0];

    return user;
  } catch (error) {
    console.log('Failed to fetch user');
    return null;
  }
});

export const getUserCredentials = async (email: string, password: string) => {
  try {
    const data = await db.query.users.findMany({
      where: and(eq(users.email, email), eq(users.password, password)),

      // Explicitly return the columns you need rather than the whole user object
      columns: {
        // id: true,
        password: true,
        email: true,
      },
    });
    console.log('getUser func data ', data);
    const user = data[0];

    return user ? user : null;
  } catch (error) {
    console.log('Failed to fetch user');
    return null;
  }
};
