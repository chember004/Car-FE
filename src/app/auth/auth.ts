'use server';

// import '@/drizzle/envConfig';
import { db } from '@/drizzle/db';
import { users } from '@/drizzle/schema';
import {
  FormState,
  LoginFormSchema,
  SignupFormSchema,
} from '@/app/auth/definitions';
import { createSession, deleteSession } from '@/app/auth/stateless-session';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import axios from 'axios';
import { CredentialsSignin } from 'next-auth';
import { signIn, signOut } from '@/auth';
import { redirect } from 'next/navigation';

export async function signup(
  state: FormState,
  formData: FormData,
): Promise<FormState> {
  // 1. Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 2. Prepare data for insertion into database
  const { username, email, password } = validatedFields.data;

  // 3. Check if the user's email already exists
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existingUser) {
    return {
      message: 'Email already exists, please use a different email or login.',
    };
  }

  // Hash the user's password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Insert the user into the database or call an Auth Provider's API
  const data = await db
    .insert(users)
    .values({
      username,
      email,
      password: hashedPassword,
    })
    .returning({ id: users.id });

  const user = data[0];

  if (!user) {
    return {
      message: 'An error occurred while creating your account.',
    };
  }

  // 4. Create a session for the user
  // const userId = user.id.toString();
  // const cookie = await getCookie();
  // await createSession(userId);

  //for next-auth
  redirect('/login');
}
export async function login(
  state: FormState,
  formData: FormData,
): Promise<FormState> {
  // 1. Validate form fields
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  const errorMessage = { message: 'Invalid login credentials.' };
  // console.log('validatedFields', validatedFields);

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 2. Query the database for the user with the given email
  const user = await db.query.users.findFirst({
    where: eq(users.email, validatedFields.data.email),
  });
  console.log('user found in login func? ', user);
  // If user is not found, return early
  if (!user) {
    return errorMessage;
  }
  // 3. Compare the user's password with the hashed password in the database
  const passwordMatch = await bcrypt.compare(
    validatedFields.data.password,
    user.password,
  );
  console.log('passwordMatch in login? ', passwordMatch);
  // If the password does not match, return early
  if (!passwordMatch) {
    return errorMessage;
  }

  // 4. If login successful, create a session for the user and redirect
  const userId = user.id.toString();
  await createSession(userId);
}
export async function logout() {
  // const { data }: any = await axios.get(
  //   `${process.env.BASE_URL}/api/auth/logout`,
  // );
  // if (!data) {
  //   return {
  //     message: 'An error occurred while logging out your account.',
  //   };
  // }
  deleteSession();
  redirect('/');
}

//next-auth login
export const nextAuthLogin = async (
  state: FormState,
  formData: FormData,
): Promise<FormState> => {
  // 1. Validate form fields
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  const errorMessage = { message: 'Invalid login credentials.' };
  // console.log('validatedFields', validatedFields);

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  try {
    const { email, password } = validatedFields.data;
    await signIn('credentials', {
      redirect: false,
      redirectTo: '/home',
      callbackUrl: '/',
      email,
      password,
    });
  } catch (error) {
    const someError = error as CredentialsSignin;
    console.log('someError', someError);
    return someError;
  }

  redirect('/home');
};
//next-auth logout
export const nextAuthLogout = async () => {
  await signOut();
  redirect('/');
};
export const loginAccount = async (
  state: FormState,
  formData: FormData,
): Promise<FormState> => {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  const errorMessage = { message: 'Invalid login credentials.' };
  // console.log('validatedFields', validatedFields);

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const { email, password } = validatedFields.data;

  //API Call for the login authentication in the Back-end
  const { data }: any = await axios.post(
    `${process.env.BASE_URL}/api/auth`,
    {
      email,
      password,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  if (!data) {
    return errorMessage;
  }
  console.log('test', data);
  // 4. If login successful, create a session for the user and redirect
  const userId = data._id.toString();
  const cookie = await getCookie();
  await createSession(userId, cookie);
};

export const signUpAccount = async (
  state: FormState,
  formData: FormData,
): Promise<FormState> => {
  // 1. Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 2. Prepare data for insertion into database
  const { username, email, password } = validatedFields.data;
  // 3. Check if the user's email already exists
  const { data: userExist }: any = await axios.get(
    `${process.env.BASE_URL}/api/users/${email}`,
  );
  if (userExist) {
    return {
      message: 'Email already exists, please use a different email or login.',
    };
  }

  // 3. Insert the user into the database or call an Auth Provider's API
  //Call the Back-end API to call my nurse to register account
  const { data: newUSer }: any = await axios.post(
    `${process.env.BASE_URL}/api/user`,
    {
      username,
      email,
      password,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  if (!newUSer) {
    return {
      message: 'An error occurred while creating your account.',
    };
  }

  // 4. Create a session for the user
  const userId = newUSer._id.toString();
  const cookie = await getCookie();
  await createSession(userId, cookie);
};
export const getCookie = async (): Promise<any> => {
  const { data } = await axios.get(`${process.env.BASE_URL}/api/auth/session`);
  console.log('check session', data);
  return data;
};
export const checkStatus = async (): Promise<any> => {
  const { data } = await axios.get(`${process.env.BASE_URL}/api/auth/status`);
  console.log('checkStatus', data);
  return data;
};
