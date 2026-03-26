import { loadSchoolSeed } from '@/lib/schools/load-seed';
import { scoreProfile } from '@/lib/profile-match/score-profile';
import type { School } from '@/types/schools';

describe('scoreProfile', () => {
  it('scores GPA and language inputs deterministically for the same profile', () => {
    const schools = loadSchoolSeed();
    const profile = {
      gpa: 3.2,
      languageScore: 84,
      targetCountry: 'US' as const,
    };

    const firstRun = scoreProfile(profile, schools);
    const secondRun = scoreProfile(profile, schools);

    expect(secondRun).toEqual(firstRun);
    expect(firstRun.every((result) => Number.isFinite(result.score))).toBe(true);
  });

  it('surfaces multiple program-level results for a single school', () => {
    const schools = loadSchoolSeed();

    const results = scoreProfile(
      {
        gpa: 3.6,
        languageScore: 92,
        targetCountry: 'US',
      },
      schools,
    );

    const bostonUniversityResults = results.filter(
      (result) => result.schoolId === 'boston-university',
    );

    expect(bostonUniversityResults).toHaveLength(2);
    expect(
      bostonUniversityResults.map((result) => result.programCode),
    ).toEqual(expect.arrayContaining(['BS-CS', 'MS-DS']));
  });

  it('moves a program from Reach to Safety as the modeled inputs improve', () => {
    const schools: School[] = [
      {
        id: 'sample-school',
        name: 'Sample School',
        country: 'US',
        city: 'Boston',
        ranking: 12,
        emailDomain: 'sample.edu',
        website: 'https://sample.edu',
        programs: [
          {
            code: 'BA-ENG',
            name: 'English',
            level: 'undergraduate',
            requirements: ['High school transcript'],
          },
        ],
      },
    ];

    const lowProfile = scoreProfile(
      {
        gpa: 1,
        languageScore: 0,
        targetCountry: 'UK',
      },
      schools,
    );
    const highProfile = scoreProfile(
      {
        gpa: 4,
        languageScore: 120,
        targetCountry: 'US',
      },
      schools,
    );

    expect(lowProfile[0].band).toBe('Reach');
    expect(highProfile[0].band).toBe('Safety');
    expect(highProfile[0].score).toBeGreaterThan(lowProfile[0].score);
  });

  it('labels unmodeled requirements as context instead of scoring them', () => {
    const schools = loadSchoolSeed();

    const results = scoreProfile(
      {
        gpa: 3,
        languageScore: 70,
        targetCountry: 'UK',
      },
      schools,
    );

    const oxfordResult = results.find(
      (result) =>
        result.schoolId === 'university-of-oxford' &&
        result.programCode === 'MPhil-IR',
    );

    expect(oxfordResult).toBeDefined();
    expect(
      oxfordResult?.reasons.some((reason) =>
        /not modeled|context only|estimated/i.test(reason),
      ),
    ).toBe(true);
  });
});
