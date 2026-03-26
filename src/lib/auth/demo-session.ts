import { cookies } from 'next/headers';
import { cache } from 'react';
import type { DemoSession } from '@/types/auth';
import {
  createDemoSession,
  demoRoleCookieName,
  normalizeDemoRole,
} from '@/lib/auth/session';

// Server-only: resolves the current request's demo role from cookies.
export const resolveDemoSession = cache(async (): Promise<DemoSession> => {
  const cookieStore = await cookies();
  const role = normalizeDemoRole(cookieStore.get(demoRoleCookieName)?.value);

  return createDemoSession(role);
});
