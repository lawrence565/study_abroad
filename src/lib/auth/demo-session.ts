import { cookies } from 'next/headers';
import { AsyncLocalStorage } from 'node:async_hooks';
import type { DemoSession } from '@/types/auth';
import {
  createDemoSession,
  demoRoleCookieName,
  normalizeDemoRole,
} from '@/lib/auth/session';

type DemoSessionScope = {
  session?: Promise<DemoSession>;
};

const demoSessionScope = new AsyncLocalStorage<DemoSessionScope>();

export async function resolveDemoSession(): Promise<DemoSession> {
  let scope = demoSessionScope.getStore();

  if (!scope) {
    scope = {};
    demoSessionScope.enterWith(scope);
  }

  if (!scope.session) {
    scope.session = (async () => {
      const cookieStore = await cookies();
      const role = normalizeDemoRole(
        cookieStore.get(demoRoleCookieName)?.value,
      );

      return createDemoSession(role);
    })();
  }

  return scope.session;
}

export { createDemoSession, demoRoleCookieName, normalizeDemoRole };
