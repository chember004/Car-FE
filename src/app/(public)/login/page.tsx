import { redirect } from 'next/navigation';
import { LoginForm } from './form';
import Link from 'next/link';
import { getSession } from '@/app/utils/getSession';

export default async function Page() {
  const session = await getSession();
  console.log('/login ', session);
  const user = session?.user;
  if (user) redirect('/home');

  return (
    <div className="flex flex-col p-4 lg:w-1/3">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-gray-500">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="mt-6">
        <LoginForm />
      </div>
      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?
        <Link className="underline" href="/signup">
          Sign up
        </Link>
      </div>
    </div>
  );
}
