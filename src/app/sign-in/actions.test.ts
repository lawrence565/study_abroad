import { vi } from 'vitest';

const setCookieMock = vi.hoisted(() => vi.fn());
const cookiesMock = vi.hoisted(() => vi.fn());
const redirectMock = vi.hoisted(() =>
  vi.fn((path: string) => {
    throw new Error(`REDIRECT:${path}`);
  }),
);

vi.mock('next/headers', () => ({
  cookies: cookiesMock,
}));

vi.mock('next/navigation', () => ({
  redirect: redirectMock,
}));

import { setDemoRoleAction } from '@/app/sign-in/actions';

describe('setDemoRoleAction', () => {
  beforeEach(() => {
    setCookieMock.mockReset();
    cookiesMock.mockResolvedValue({ set: setCookieMock } as never);
    redirectMock.mockClear();
  });

  it.each([
    ['guest'],
    ['basic'],
    ['verified'],
  ] as const)('writes the demo_role cookie for %s and redirects', async (role) => {
    const formData = new FormData();
    formData.set('role', role);

    await expect(setDemoRoleAction(formData)).rejects.toThrow(
      'REDIRECT:/sign-in',
    );

    expect(setCookieMock).toHaveBeenCalledWith({
      name: 'demo_role',
      value: role,
      path: '/',
      sameSite: 'lax',
      httpOnly: true,
      secure: false,
    });
    expect(redirectMock).toHaveBeenCalledWith('/sign-in');
  });

  it('normalizes invalid submitted roles to guest', async () => {
    const formData = new FormData();
    formData.set('role', 'spacewizard');

    await expect(setDemoRoleAction(formData)).rejects.toThrow(
      'REDIRECT:/sign-in',
    );

    expect(setCookieMock).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'demo_role',
        value: 'guest',
      }),
    );
  });

  it('preserves the session cookie contract for cross-route persistence', async () => {
    const formData = new FormData();
    formData.set('role', 'basic');

    await expect(setDemoRoleAction(formData)).rejects.toThrow(
      'REDIRECT:/sign-in',
    );

    expect(setCookieMock).toHaveBeenCalledTimes(1);

    const [cookie] = setCookieMock.mock.calls[0];

    expect(cookie).toMatchObject({
      name: 'demo_role',
      value: 'basic',
      path: '/',
      sameSite: 'lax',
      httpOnly: true,
      secure: false,
    });
    expect(cookie).not.toHaveProperty('expires');
    expect(cookie).not.toHaveProperty('maxAge');
  });
});
