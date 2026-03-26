import {
  createDemoSession,
  demoRoleCookieName,
  normalizeDemoRole,
} from '@/lib/auth/session';

describe('demo session', () => {
  it('uses demo_role as the cookie key', () => {
    expect(demoRoleCookieName).toBe('demo_role');
  });

  it.each([undefined, 'not-a-role'])(
    'normalizes %p to guest',
    (value) => {
      expect(normalizeDemoRole(value)).toBe('guest');
    },
  );

  it.each([
    ['guest', false, 'Guest'],
    ['basic', false, 'Basic'],
    ['verified', true, 'Verified'],
  ] as const)('creates a complete session for %s', (role, isVerified, displayName) => {
    expect(createDemoSession(role)).toEqual({
      role,
      isVerified,
      displayName,
    });
  });
});
