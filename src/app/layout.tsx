import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AppShell } from '@/components/app-shell';
import { resolveDemoSession } from '@/lib/auth/demo-session';

export const metadata: Metadata = {
  title: 'StudyAbroad Hub',
  description: 'Minimal MVP foundation for study abroad planning.',
};

type RootLayoutProps = {
  children: ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
  const session = await resolveDemoSession();

  return (
    <html lang="en">
      <body>
        <AppShell session={session}>{children}</AppShell>
      </body>
    </html>
  );
}
