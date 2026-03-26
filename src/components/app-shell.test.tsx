import { render, screen } from '@testing-library/react';
import type { DemoSession } from '@/types/auth';
import { AppShell } from '@/components/app-shell';

describe('app shell', () => {
  it('shows the current demo role and real route navigation', () => {
    const session: DemoSession = {
      role: 'verified',
      isVerified: true,
      displayName: 'Verified',
    };

    render(
      <AppShell session={session}>
        <p>Shell body</p>
      </AppShell>,
    );

    expect(
      screen.getByText(/current demo role: verified/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/verified status: yes/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute(
      'href',
      '/',
    );
    expect(screen.getByRole('link', { name: /school explorer/i })).toHaveAttribute(
      'href',
      '/explorer',
    );
    expect(screen.getByRole('link', { name: /profile match/i })).toHaveAttribute(
      'href',
      '/profile-match',
    );
    expect(screen.getByRole('link', { name: /verification/i })).toHaveAttribute(
      'href',
      '/verification',
    );
    expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute(
      'href',
      '/sign-in',
    );
  });
});
