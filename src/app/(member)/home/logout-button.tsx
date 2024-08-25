'use client';

import { logout, nextAuthLogout } from '@/app/auth/auth';
import { LogOutIcon } from '@/components/ui/icons';
import { useSession } from 'next-auth/react';

export default function LogoutButton() {
  const { data: session, update } = useSession();
  console.log(session); // console.log
  return (
    <button
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-all hover:text-gray-900"
      onClick={async () => {
        // 'use server';
        await nextAuthLogout();
      }}
    >
      <LogOutIcon className="h-4 w-4" />
      Logout
    </button>
  );
}
