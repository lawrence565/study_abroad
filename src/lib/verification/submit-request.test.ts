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

  it('normalizes a valid submission into a pending request payload', () => {
    const schools = loadSchoolSeed();

    const request = submitVerificationRequest(
      {
        schoolId: 'boston-university',
        method: 'school_email',
        schoolEmail: 'student@bu.edu',
      },
      {
        schools,
        now: () => new Date('2026-03-26T00:00:00.000Z'),
      },
    );

    expect(request).toMatchObject({
      schoolId: 'boston-university',
      method: 'school_email',
      schoolEmail: 'student@bu.edu',
      status: 'pending',
      schoolDomain: 'bu.edu',
      submittedAt: '2026-03-26T00:00:00.000Z',
    });
    expect(request.id).toEqual(expect.any(String));
  });
});
