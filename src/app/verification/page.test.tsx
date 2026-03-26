import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import RootLayout from '@/app/layout';
import Page from '@/app/verification/page';
import { resolveDemoSession } from '@/lib/auth/demo-session';

vi.mock('@/lib/auth/demo-session', () => ({
  resolveDemoSession: vi.fn(),
}));

describe('verification page', () => {
  const resolveDemoSessionMock = vi.mocked(resolveDemoSession);

  beforeEach(() => {
    resolveDemoSessionMock.mockResolvedValue({
      role: 'basic',
      isVerified: false,
      displayName: 'Basic',
    });
  });

  it('shows the verification form and explains verified-only publishing permissions', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      await RootLayout({
        children: await Page({
          searchParams: Promise.resolve({ role: 'basic' }),
        }),
      }),
    );

    consoleErrorSpy.mockRestore();

    expect(
      screen.getByRole('heading', { name: /^verification$/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/^school$/i)).toBeInTheDocument();
    expect(
      screen.getByRole('radio', { name: /school email/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('radio', { name: /manual review/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/marketplace and event-hosting permissions require verified status/i),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(/current demo role: basic/i),
    ).toHaveLength(2);
  });
});
