import { loadSchoolSeed } from '@/lib/schools/load-seed';
import { scoreProfile } from '@/lib/profile-match/score-profile';

describe('scoreProfile', () => {
  it('normalizes GPA and language score into deterministic numeric scores', () => {
    const schools = loadSchoolSeed();

    const results = scoreProfile(
      {
        gpa: 4,
        testScore: 120,
        targetCountry: 'US',
      },
      schools,
    );

    expect(results[0]).toMatchObject({
      schoolId: 'boston-university',
      band: 'Safety',
      score: 95,
    });
  });

  it('maps recommendation bands to Reach Match and Safety', () => {
    const schools = loadSchoolSeed();

    const results = scoreProfile(
      {
        gpa: 2.1,
        testScore: 55,
        targetCountry: 'UK',
      },
      schools,
    );

    expect(results.map((result) => result.band)).toContain('Reach');
    expect(results.map((result) => result.band)).toContain('Match');
    expect(results.map((result) => result.band)).toContain('Safety');
  });

  it('does not crash when optional fields are missing', () => {
    const schools = loadSchoolSeed();

    expect(() =>
      scoreProfile(
        {
          targetCountry: 'US',
        },
        schools,
      ),
    ).not.toThrow();
  });

  it('includes human-readable reasons for each result', () => {
    const schools = loadSchoolSeed();

    const results = scoreProfile(
      {
        gpa: 3,
        testScore: 70,
        targetCountry: 'US',
      },
      schools,
    );

    expect(results[0].reasons.length).toBeGreaterThan(0);
    expect(results[0].reasons.join(' ')).toMatch(/gpa|test score|country/i);
  });
});
