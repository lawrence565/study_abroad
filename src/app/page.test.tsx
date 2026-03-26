import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import RootLayout from '@/app/layout';
import Page from '@/app/page';
import { resolveDemoSession } from '@/lib/auth/demo-session';

vi.mock('@/lib/auth/demo-session', () => ({
  resolveDemoSession: vi.fn(),
}));

describe('landing page', () => {
  const resolveDemoSessionMock = vi.mocked(resolveDemoSession);

  beforeEach(() => {
    resolveDemoSessionMock.mockResolvedValue({
      role: 'verified',
      isVerified: true,
      displayName: 'Verified',
    });
  });

  it('shows the MVP navigation and summary', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(await RootLayout({ children: Page() }));

    consoleErrorSpy.mockRestore();

    expect(
      screen.getByRole('heading', { name: /studyabroad hub/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/current demo role: verified/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/verified status: yes/i)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /school explorer/i }),
    ).toHaveAttribute('href', '/explorer');
    expect(
      screen.getByRole('link', { name: /profile match/i }),
    ).toHaveAttribute('href', '/profile-match');
    expect(
      screen.getByRole('link', { name: /verification/i }),
    ).toHaveAttribute('href', '/verification');
    expect(
      screen.getByRole('link', { name: /sign in/i }),
    ).toHaveAttribute('href', '/sign-in');
    expect(
      screen.getByRole('link', { name: /home/i }),
    ).toHaveAttribute('href', '/');
    expect(
      screen.getByText(/community modules are deferred/i),
    ).toBeInTheDocument();
  });
});
