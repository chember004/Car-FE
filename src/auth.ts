import NextAuth, { type DefaultSession } from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { signInSchema } from './lib/zod';
import { users } from '@/drizzle/schema';
import { db } from './drizzle/db';
import { compare } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { userDTO } from './types/dto';
// Your own logic for dealing with plaintext password strings; be careful!
declare module 'next-auth' {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        id: { label: 'Id', type: 'id' },
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (credentials === null) return null;

        const { email, password } = await signInSchema.parseAsync(credentials);
        const user = await db.query.users.findFirst({
          where: eq(users.email, email),
          columns: {
            id: true,
            password: true,
            email: true,
          },
        });
        // If user is not found, return early
        if (!user) {
          throw new Error('Invalid email or password');
        }
        // 3. Compare the user's password with the hashed password in the database
        const passwordMatch = await compare(password, user.password);
        console.log('passwordMatch in login nextAuth? ', passwordMatch);
        // If the password does not match, return early
        if (!passwordMatch) {
          throw new Error('Invalid email or password');
        }

        console.log('user found in login nextAuth? ', user);
        const filteredUser = userDTO({ ...user, id: user?.id.toString() });

        // return user object with their profile data
        return filteredUser;
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      async profile(profile) {
        return { ...profile };
      },
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        // User is available during sign-in
        token.id = user.id;
      }
      return token;
    },
    // session({ session, token }) {
    //   // session.user.id = user.id //if using db session strategy
    //   session.user.id = token.id;
    //   return session;
    // },
  },
});
