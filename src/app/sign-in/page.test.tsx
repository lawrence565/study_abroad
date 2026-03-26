import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import RootLayout from '@/app/layout';
import Page from '@/app/sign-in/page';

describe('sign-in page', () => {
  it('shows role-based sign-in options for MVP demo usage', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <RootLayout>
        {await Page({
          searchParams: Promise.resolve({ role: 'guest' }),
        })}
      </RootLayout>,
    );

    consoleErrorSpy.mockRestore();

    expect(
      screen.getByRole('heading', { name: /^sign in$/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /continue as guest/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /switch to basic/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /switch to verified/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/current demo role: guest/i),
    ).toBeInTheDocument();
  });
});
