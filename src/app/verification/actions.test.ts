import { vi } from 'vitest';

const resolveDemoSessionMock = vi.hoisted(() => vi.fn());
const loadSchoolSeedMock = vi.hoisted(() => vi.fn());
const submitVerificationRequestMock = vi.hoisted(() => vi.fn());

vi.mock('@/lib/auth/demo-session', () => ({
  resolveDemoSession: resolveDemoSessionMock,
}));

vi.mock('@/lib/schools/load-seed', () => ({
  loadSchoolSeed: loadSchoolSeedMock,
}));

vi.mock('@/lib/verification/submit-request', () => ({
  submitVerificationRequest: submitVerificationRequestMock,
}));

import { submitVerificationAction } from '@/app/verification/actions';

describe('submitVerificationAction', () => {
  beforeEach(() => {
    resolveDemoSessionMock.mockReset();
    loadSchoolSeedMock.mockReset();
    submitVerificationRequestMock.mockReset();
    loadSchoolSeedMock.mockReturnValue([
      {
        id: 'boston-university',
        name: 'Boston University',
        country: 'US',
        city: 'Boston',
        ranking: 27,
        emailDomain: 'bu.edu',
        website: 'https://www.bu.edu',
        programs: [],
      },
    ]);
    resolveDemoSessionMock.mockResolvedValue({
      role: 'basic',
      isVerified: false,
      displayName: 'Basic',
    });
  });

  it('validates the session role before submitting a school_email request', async () => {
    const callOrder: string[] = [];
    const formData = new FormData();

    resolveDemoSessionMock.mockImplementation(async () => {
      callOrder.push('session');
      return {
        role: 'basic',
        isVerified: false,
        displayName: 'Basic',
      };
    });
    loadSchoolSeedMock.mockImplementation(() => {
      callOrder.push('schools');
      return [
        {
          id: 'boston-university',
          name: 'Boston University',
          country: 'US',
          city: 'Boston',
          ranking: 27,
          emailDomain: 'bu.edu',
          website: 'https://www.bu.edu',
          programs: [],
        },
      ];
    });
    submitVerificationRequestMock.mockImplementation((input) => {
      callOrder.push('submit');
      return {
        id: 'request-1',
        schoolId: input.schoolId,
        schoolName: 'Boston University',
        schoolDomain: 'bu.edu',
        method: input.method,
        schoolEmail: input.schoolEmail,
        submittedAt: '2026-03-26T00:00:00.000Z',
      };
    });

    formData.set('schoolId', 'boston-university');
    formData.set('method', 'school_email');
    formData.set('schoolEmail', 'student@bu.edu');

    const result = await submitVerificationAction({ status: 'idle' }, formData);

    expect(callOrder).toEqual(['session', 'schools', 'submit']);
    expect(result).toEqual({
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
    });
  });

  it('returns the compact success payload for a manual_review request', async () => {
    const formData = new FormData();
    submitVerificationRequestMock.mockReturnValue({
      id: 'request-2',
      schoolId: 'boston-university',
      schoolName: 'Boston University',
      schoolDomain: 'bu.edu',
      method: 'manual_review',
      evidenceSummary: 'passport and transcript',
      submittedAt: '2026-03-26T00:00:00.000Z',
    });

    formData.set('schoolId', 'boston-university');
    formData.set('method', 'manual_review');
    formData.set('evidenceSummary', 'passport and transcript');

    const result = await submitVerificationAction({ status: 'idle' }, formData);

    expect(resolveDemoSessionMock).toHaveBeenCalledTimes(1);
    expect(submitVerificationRequestMock).toHaveBeenCalledWith(
      {
        schoolId: 'boston-university',
        method: 'manual_review',
        evidenceSummary: 'passport and transcript',
      },
      expect.objectContaining({
        schoolRepository: expect.any(Object),
        verificationRequestRepository: expect.any(Object),
      }),
    );
    expect(result).toEqual({
      status: 'success',
      message: 'Verification request submitted.',
      request: {
        id: 'request-2',
        schoolId: 'boston-university',
        schoolName: 'Boston University',
        schoolDomain: 'bu.edu',
        method: 'manual_review',
        evidenceSummary: 'passport and transcript',
        submittedAt: '2026-03-26T00:00:00.000Z',
      },
    });
  });

  it('returns inline error state for invalid form input without mutation', async () => {
    const formData = new FormData();
    formData.set('schoolId', 'boston-university');
    formData.set('method', 'school_email');
    formData.set('schoolEmail', '   ');

    const result = await submitVerificationAction({ status: 'idle' }, formData);

    expect(result).toEqual({
      status: 'error',
      message: 'School email is required for school_email verification.',
    });
    expect(submitVerificationRequestMock).not.toHaveBeenCalled();
  });
});
