import { render, screen, within } from '@testing-library/react';
import { vi } from 'vitest';
import RootLayout from '@/app/layout';
import Page from '@/app/page';

const cookiesMock = vi.hoisted(() => vi.fn());
const cookieGetMock = vi.hoisted(() => vi.fn());

vi.mock('next/headers', () => ({
  cookies: cookiesMock,
}));

describe('landing page integration', () => {
  beforeEach(() => {
    cookieGetMock.mockReset();
    cookiesMock.mockResolvedValue({
      get: cookieGetMock,
    } as never);
    cookieGetMock.mockReturnValue({ value: 'verified' });
  });

  it('renders the MVP dashboard, deferred modules, demo auth note, and real shell routes', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(await RootLayout({ children: Page() }));

    consoleErrorSpy.mockRestore();

    const main = within(screen.getByRole('main'));
    const primaryNav = within(
      screen.getByRole('navigation', { name: /primary/i }),
    );

    expect(
      screen.getByRole('heading', { name: /studyabroad hub/i }),
    ).toBeInTheDocument();
    expect(
      main.getByRole('heading', { name: /active mvp routes/i }),
    ).toBeInTheDocument();
    expect(
      main.getByRole('link', { name: /school explorer/i }),
    ).toHaveAttribute('href', '/explorer');
    expect(
      main.getByRole('link', { name: /profile match/i }),
    ).toHaveAttribute('href', '/profile-match');
    expect(
      main.getByRole('link', { name: /verification/i }),
    ).toHaveAttribute('href', '/verification');
    expect(
      main.getByRole('link', { name: /sign in/i }),
    ).toHaveAttribute('href', '/sign-in');
    expect(
      primaryNav.getByRole('link', { name: /home/i }),
    ).toHaveAttribute('href', '/');
    expect(
      primaryNav.getByRole('link', { name: /school explorer/i }),
    ).toHaveAttribute('href', '/explorer');
    expect(
      main.getByRole('heading', { name: /deferred modules/i }),
    ).toBeInTheDocument();
    expect(
      main.getByText(/area guide/i),
    ).toBeInTheDocument();
    expect(
      main.getByText(/marketplace/i),
    ).toBeInTheDocument();
    expect(
      main.getByText(/events/i),
    ).toBeInTheDocument();
    expect(
      main.getByRole('heading', { name: /demo auth/i }),
    ).toBeInTheDocument();
    expect(
      main.getByText(/firebase/i),
    ).toBeInTheDocument();
  });
});
