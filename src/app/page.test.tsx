import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import RootLayout from '@/app/layout';
import Page from '@/app/page';

const cookiesMock = vi.hoisted(() => vi.fn());
const cookieGetMock = vi.hoisted(() => vi.fn());

vi.mock('next/headers', () => ({
  cookies: cookiesMock,
}));

describe('landing page', () => {
  beforeEach(() => {
    cookieGetMock.mockReset();
    cookiesMock.mockResolvedValue({
      get: cookieGetMock,
    } as never);
    cookieGetMock.mockReturnValue({ value: 'verified' });
  });

  it('shows the MVP navigation and reads the cookie-backed session on /', async () => {
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
    expect(cookiesMock).toHaveBeenCalledTimes(1);
    expect(cookieGetMock).toHaveBeenCalledWith('demo_role');
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
