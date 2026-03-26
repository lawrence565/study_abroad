import { vi } from 'vitest';

const cookiesMock = vi.hoisted(() => vi.fn());
const cookieGetMock = vi.hoisted(() => vi.fn());
const cacheMock = vi.hoisted(() => vi.fn());

vi.mock('react', async () => {
  const actual = await vi.importActual<typeof import('react')>('react');

  return {
    ...actual,
    cache: (fn: (...args: Array<unknown>) => unknown) => {
      cacheMock(fn);
      let cachedResult: unknown;
      let hasCached = false;

      return (...args: Array<unknown>) => {
        if (!hasCached) {
          hasCached = true;
          cachedResult = fn(...args);
        }

        return cachedResult;
      };
    },
  };
});

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
    expect(cacheMock).toHaveBeenCalledTimes(1);

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
