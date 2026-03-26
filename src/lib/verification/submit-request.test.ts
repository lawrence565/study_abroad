import { loadSchoolSeed } from '@/lib/schools/load-seed';
import { submitVerificationRequest } from '@/lib/verification/submit-request';

describe('submitVerificationRequest', () => {
  it('rejects empty evidence for manual_review', () => {
    const schools = loadSchoolSeed();

    expect(() =>
      submitVerificationRequest(
        {
          schoolId: 'boston-university',
          method: 'manual_review',
          evidenceSummary: '   ',
        },
        {
          schools,
          now: () => new Date('2026-03-26T00:00:00.000Z'),
        },
      ),
    ).toThrow(/evidence/i);
  });

  it('rejects school_email submissions whose domain does not match the selected school record', () => {
    const schools = loadSchoolSeed();

    expect(() =>
      submitVerificationRequest(
        {
          schoolId: 'boston-university',
          method: 'school_email',
          schoolEmail: 'student@mit.edu',
        },
        {
          schools,
          now: () => new Date('2026-03-26T00:00:00.000Z'),
        },
      ),
    ).toThrow(/domain/i);
  });

  it('returns normalized school_email fields through the repository seam', () => {
    const dependencies = {
      schoolRepository: {
        findById(schoolId: string) {
          return schoolId === 'boston-university'
            ? {
                id: 'boston-university',
                name: 'Boston University',
                country: 'US',
                city: 'Boston',
                ranking: 27,
                emailDomain: 'BU.EDU',
                website: 'https://www.bu.edu',
                programs: [],
              }
            : undefined;
        },
      },
      verificationRequestRepository: {
        create(request: {
          id: string;
          schoolId: string;
          schoolName: string;
          schoolDomain: string;
          method: 'school_email' | 'manual_review';
          status: 'pending' | 'approved' | 'rejected';
          schoolEmail?: string;
          evidenceSummary?: string;
          submittedAt: string;
        }) {
          return request;
        },
      },
      now: () => new Date('2026-03-26T00:00:00.000Z'),
    } satisfies Parameters<typeof submitVerificationRequest>[1];

    const request = submitVerificationRequest(
      {
        schoolId: 'boston-university',
        method: 'school_email',
        schoolEmail: '  Student@BU.EDU  ',
      },
      dependencies,
    );

    expect(request).toEqual({
      id: expect.any(String),
      schoolId: 'boston-university',
      schoolName: 'Boston University',
      schoolDomain: 'bu.edu',
      method: 'school_email',
      schoolEmail: 'student@bu.edu',
      submittedAt: '2026-03-26T00:00:00.000Z',
    });
  });

  it('returns normalized manual_review fields through the repository seam', () => {
    const dependencies = {
      schoolRepository: {
        findById(schoolId: string) {
          return schoolId === 'boston-university'
            ? {
                id: 'boston-university',
                name: 'Boston University',
                country: 'US',
                city: 'Boston',
                ranking: 27,
                emailDomain: 'bu.edu',
                website: 'https://www.bu.edu',
                programs: [],
              }
            : undefined;
        },
      },
      verificationRequestRepository: {
        create(request: {
          id: string;
          schoolId: string;
          schoolName: string;
          schoolDomain: string;
          method: 'school_email' | 'manual_review';
          status: 'pending' | 'approved' | 'rejected';
          schoolEmail?: string;
          evidenceSummary?: string;
          submittedAt: string;
        }) {
          return request;
        },
      },
      now: () => new Date('2026-03-26T00:00:00.000Z'),
    } satisfies Parameters<typeof submitVerificationRequest>[1];

    const request = submitVerificationRequest(
      {
        schoolId: 'boston-university',
        method: 'manual_review',
        evidenceSummary: '  transcript and passport   ',
      },
      dependencies,
    );

    expect(request).toEqual({
      id: expect.any(String),
      schoolId: 'boston-university',
      schoolName: 'Boston University',
      schoolDomain: 'bu.edu',
      method: 'manual_review',
      evidenceSummary: 'transcript and passport',
      submittedAt: '2026-03-26T00:00:00.000Z',
    });
  });
});
