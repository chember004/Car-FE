import { getSession } from '@/app/utils/getSession';
import SignIn from '@/components/authentication/sign-in';
import { redirect } from 'next/navigation';
import React from 'react';

const GoogleSignin = async () => {
  const session = await getSession();
  console.log('/google/sign-in ', session);
  const user = session?.user;
  if (user) redirect('/home');
  return (
    <div>
      <SignIn />
    </div>
  );
};

export default GoogleSignin;
