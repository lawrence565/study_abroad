import type { ReactNode } from 'react';

const navigationItems = [
  { href: '#school-explorer', label: 'School Explorer' },
  { href: '#profile-match', label: 'Profile Match' },
  { href: '#verification', label: 'Verification' },
] as const;

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div>
      <header>
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
