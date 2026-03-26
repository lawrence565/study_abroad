import type { ReactNode } from 'react';
import type { DemoSession } from '@/types/auth';

const navigationItems = [
  { href: '/', label: 'Home' },
  { href: '/explorer', label: 'School Explorer' },
  { href: '/profile-match', label: 'Profile Match' },
  { href: '/verification', label: 'Verification' },
  { href: '/sign-in', label: 'Sign In' },
] as const;

type AppShellProps = {
  children: ReactNode;
  session: DemoSession;
};

export function AppShell({ children, session }: AppShellProps) {
  return (
    <div>
      <header>
        <p>Current demo role: {session.role}</p>
        <p>Verified status: {session.isVerified ? 'Yes' : 'No'}</p>
        <nav aria-label="Primary">
          {navigationItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
