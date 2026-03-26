import type { DemoRole, DemoSession } from '@/types/auth';
import { createDemoSession, normalizeDemoRole } from '@/lib/auth/session';

export function resolveDemoSession(role: string | string[] | undefined): DemoSession {
  return createDemoSession(normalizeDemoRole(role));
}

export { createDemoSession };
