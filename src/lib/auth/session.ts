import type { DemoRole, DemoSession } from '@/types/auth';

export const demoRoleCookieName = 'demo_role';

const demoRoleLabels: Record<DemoRole, string> = {
  guest: 'Guest',
  basic: 'Basic',
  verified: 'Verified',
};

export function isDemoRole(value: string): value is DemoRole {
  return value === 'guest' || value === 'basic' || value === 'verified';
}

export function normalizeDemoRole(value: string | string[] | undefined): DemoRole {
  const firstValue = Array.isArray(value) ? value[0] : value;

  return firstValue && isDemoRole(firstValue) ? firstValue : 'guest';
}

export function createDemoSession(role: DemoRole): DemoSession {
  return {
    role,
    isVerified: role === 'verified',
    displayName: demoRoleLabels[role],
  };
}
