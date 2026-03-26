import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import RootLayout from '@/app/layout';
import Page from '@/app/verification/page';
import { VerificationForm } from '@/components/verification-form';
import { loadSchoolSeed } from '@/lib/schools/load-seed';
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

  it('renders the form with compact school options and the shared shell role', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const schools = loadSchoolSeed();

    render(
      await RootLayout({
        children: await Page({
          searchParams: Promise.resolve({}),
        }),
      }),
    );

    consoleErrorSpy.mockRestore();

    expect(
      screen.getByRole('heading', { name: /^verification$/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/^school$/i)).toBeInTheDocument();
    expect(screen.getByRole('option', { name: schools[0].name })).toHaveValue(
      schools[0].id,
    );
    expect(
      screen.getAllByText(/current demo role: basic/i),
    ).toHaveLength(2);
  });

  it('shows a normalized request summary for a successful school_email submission', () => {
    render(
      <VerificationForm
        schools={[
          {
            id: 'boston-university',
            name: 'Boston University',
          },
        ]}
        currentRole="basic"
        action={vi.fn()}
        initialState={{
          status: 'success',
          message: 'Verification request submitted.',
          request: {
            id: 'request-1',
            schoolId: 'boston-university',
            schoolName: 'Boston University',
            schoolDomain: 'bu.edu',
            method: 'school_email',
            schoolEmail: 'student@bu.edu',
            submittedAt: '2026-03-26T00:00:00.000Z',
          },
        }}
      />,
    );

    expect(
      screen.getByText(/verification request submitted\./i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/boston university \(bu\.edu\)/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/student@bu\.edu/i)).toBeInTheDocument();
  });

  it('shows a validation message for an inline error state', () => {
    render(
      <VerificationForm
        schools={[
          {
            id: 'boston-university',
            name: 'Boston University',
          },
        ]}
        currentRole="basic"
        action={vi.fn()}
        initialState={{
          status: 'error',
          message: 'School email is required for school_email verification.',
        }}
      />,
    );

    expect(
      screen.getByText(
        /school email is required for school_email verification\./i,
      ),
    ).toBeInTheDocument();
  });
});
