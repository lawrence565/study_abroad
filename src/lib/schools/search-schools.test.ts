import { loadSchoolSeed } from '@/lib/schools/load-seed';
import { searchSchools } from '@/lib/schools/search-schools';

describe('searchSchools', () => {
  it('returns only schools matching the country and query term', () => {
    const schools = loadSchoolSeed();

    const results = searchSchools(schools, {
      country: 'US',
      query: 'engineering',
    });

    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      id: 'massachusetts-institute-of-technology',
      country: 'US',
    });
  });

  it('sorts multiple matches by lower ranking first', () => {
    const schools = loadSchoolSeed();

    const results = searchSchools(schools, {
      query: 'computer science',
    });

    expect(results.map((school) => school.id)).toEqual([
      'massachusetts-institute-of-technology',
      'boston-university',
      'imperial-college-london',
    ]);
    expect(results[0].ranking).toBeLessThan(results[1].ranking);
    expect(results[1].ranking).toBeLessThan(results[2].ranking);
  });
});
