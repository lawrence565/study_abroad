import { vi } from 'vitest';

const cookiesMock = vi.hoisted(() => vi.fn());
const cookieGetMock = vi.hoisted(() => vi.fn());

vi.mock('next/headers', () => ({
  cookies: cookiesMock,
}));

import { resolveDemoSession } from '@/lib/auth/demo-session';

describe('resolveDemoSession', () => {
  beforeEach(() => {
    cookieGetMock.mockReset();
    cookiesMock.mockResolvedValue({
      get: cookieGetMock,
    } as never);
    cookieGetMock.mockReturnValue({ value: 'verified' });
  });

  it('dedupes cookie reads within a request', async () => {
    const [firstSession, secondSession] = await Promise.all([
      resolveDemoSession(),
      resolveDemoSession(),
    ]);

    expect(firstSession).toEqual({
      role: 'verified',
      isVerified: true,
      displayName: 'Verified',
    });
    expect(secondSession).toEqual(firstSession);
    expect(cookiesMock).toHaveBeenCalledTimes(1);
    expect(cookieGetMock).toHaveBeenCalledTimes(1);
    expect(cookieGetMock).toHaveBeenCalledWith('demo_role');
  });
});
