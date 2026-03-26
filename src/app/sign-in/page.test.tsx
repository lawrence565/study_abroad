import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import Page from '@/app/sign-in/page';
import { resolveDemoSession } from '@/lib/auth/demo-session';

vi.mock('@/lib/auth/demo-session', () => ({
  resolveDemoSession: vi.fn(),
}));

describe('sign-in page', () => {
  const resolveDemoSessionMock = vi.mocked(resolveDemoSession);

  beforeEach(() => {
    resolveDemoSessionMock.mockResolvedValue({
      role: 'basic',
      isVerified: false,
      displayName: 'Basic',
    });
  });

  it('resolves the cookie-backed session seam instead of search params', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      await Page({
        searchParams: Promise.resolve({ role: 'guest' }),
      }),
    );

    consoleErrorSpy.mockRestore();

    expect(resolveDemoSessionMock).toHaveBeenCalledTimes(1);
    expect(resolveDemoSessionMock.mock.calls[0]).toEqual([]);
    expect(
      screen.getByRole('heading', { name: /^sign in$/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /continue as guest/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /switch to basic/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /switch to verified/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/current demo role: basic/i),
    ).toBeInTheDocument();
  });
});
