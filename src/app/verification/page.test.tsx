import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import RootLayout from '@/app/layout';
import Page from '@/app/verification/page';

describe('verification page', () => {
  it('shows the verification form and explains verified-only publishing permissions', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <RootLayout>
        {await Page({
          searchParams: Promise.resolve({ role: 'basic' }),
        })}
      </RootLayout>,
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
      screen.getByText(/current demo role: basic/i),
    ).toBeInTheDocument();
  });
});
