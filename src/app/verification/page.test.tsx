import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import RootLayout from '@/app/layout';
import Page from '@/app/verification/page';
import { loadSchoolSeed } from '@/lib/schools/load-seed';
import { resolveDemoSession } from '@/lib/auth/demo-session';

const useActionStateMock = vi.hoisted(() => vi.fn());

vi.mock('react', async () => {
  const actual = await vi.importActual<typeof import('react')>('react');

  return {
    ...actual,
    useActionState: useActionStateMock,
  };
});

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
    useActionStateMock.mockReset();
    useActionStateMock.mockImplementation((_action, initialState) => [
      initialState,
      vi.fn(),
      false,
    ]);
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

  it('shows a normalized request summary on the verification page', async () => {
    useActionStateMock.mockReturnValue([
      {
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
      },
      vi.fn(),
      false,
    ]);

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      await RootLayout({
        children: await Page({
          searchParams: Promise.resolve({}),
        }),
      }),
    );

    consoleErrorSpy.mockRestore();

    expect(
      screen.getByText(/verification request submitted\./i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/boston university \(bu\.edu\)/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/student@bu\.edu/i)).toBeInTheDocument();
  });

  it('shows a validation message on the verification page', async () => {
    useActionStateMock.mockReturnValue([
      {
        status: 'error',
        message: 'School email is required for school_email verification.',
      },
      vi.fn(),
      false,
    ]);

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      await RootLayout({
        children: await Page({
          searchParams: Promise.resolve({}),
        }),
      }),
    );

    consoleErrorSpy.mockRestore();

    expect(
      screen.getByText(
        /school email is required for school_email verification\./i,
      ),
    ).toBeInTheDocument();
  });
});
