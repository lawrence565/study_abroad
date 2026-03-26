import { cookies } from 'next/headers';
import type { DemoSession } from '@/types/auth';
import {
  createDemoSession,
  demoRoleCookieName,
  normalizeDemoRole,
} from '@/lib/auth/session';

export async function resolveDemoSession(): Promise<DemoSession> {
  const cookieStore = await cookies();
  const role = normalizeDemoRole(cookieStore.get(demoRoleCookieName)?.value);

  return createDemoSession(role);
}

export { createDemoSession, demoRoleCookieName, normalizeDemoRole };
