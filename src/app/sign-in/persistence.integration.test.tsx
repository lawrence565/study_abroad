import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

const demoRoleState = vi.hoisted(() => ({
  value: 'guest',
}));
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

describe('sign-in persistence integration', () => {
  beforeEach(() => {
    demoRoleState.value = 'guest';
    cookiesMock.mockReset();
    redirectMock.mockClear();
    vi.resetModules();

    cookiesMock.mockImplementation(async () => ({
      get(name: string) {
        if (name !== 'demo_role' || !demoRoleState.value) {
          return undefined;
        }

        return { value: demoRoleState.value };
      },
      set(cookie: { name: string; value: string }) {
        if (cookie.name === 'demo_role') {
          demoRoleState.value = cookie.value;
        }
      },
    }));
  });

  it('shows the updated demo role on another route after sign-in writes the cookie', async () => {
    const { setDemoRoleAction } = await import('@/app/sign-in/actions');
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const formData = new FormData();
    formData.set('role', 'verified');

    await expect(setDemoRoleAction(formData)).rejects.toThrow(
      'REDIRECT:/sign-in',
    );
    expect(demoRoleState.value).toBe('verified');

    const { default: RootLayout } = await import('@/app/layout');
    const { default: ExplorerPage } = await import('@/app/explorer/page');

    render(
      await RootLayout({
        children: await ExplorerPage({ searchParams: Promise.resolve({}) }),
      }),
    );
    consoleErrorSpy.mockRestore();

    expect(
      screen.getByRole('heading', { name: /school explorer/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/current demo role: verified/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/verified status: yes/i)).toBeInTheDocument();
  });
});
