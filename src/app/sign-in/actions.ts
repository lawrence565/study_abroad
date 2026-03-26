'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { demoRoleCookieName, normalizeDemoRole } from '@/lib/auth/session';

export async function setDemoRoleAction(formData: FormData) {
  const submittedRole = formData.get('role');
  const role = normalizeDemoRole(
    typeof submittedRole === 'string' ? submittedRole : undefined,
  );
  const cookieStore = await cookies();

  cookieStore.set({
    name: demoRoleCookieName,
    value: role,
    path: '/',
    sameSite: 'lax',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });

  redirect('/sign-in');
}
