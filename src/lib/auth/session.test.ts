import { createDemoSession } from '@/lib/auth/demo-session';

describe('demo session', () => {
  it('can express guest, basic, and verified roles', () => {
    expect(createDemoSession('guest')).toMatchObject({
      role: 'guest',
      isVerified: false,
    });
    expect(createDemoSession('basic')).toMatchObject({
      role: 'basic',
      isVerified: false,
    });
    expect(createDemoSession('verified')).toMatchObject({
      role: 'verified',
      isVerified: true,
    });
  });
});
