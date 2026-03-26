import { loadSchoolSeed } from '@/lib/schools/load-seed';

describe('loadSchoolSeed', () => {
  it('parses school and program records from the seed file', () => {
    const schools = loadSchoolSeed();

    expect(schools).toHaveLength(4);

    const school = schools.find((entry) => entry.id === 'boston-university');
    expect(school).toMatchObject({
      id: 'boston-university',
      name: 'Boston University',
      country: 'US',
      ranking: 27,
      emailDomain: 'bu.edu',
    });
    expect(school?.programs).toHaveLength(2);
    expect(school?.programs[0]).toMatchObject({
      code: 'BS-CS',
      name: 'Computer Science',
      level: 'undergraduate',
    });
    expect(school?.programs[0].requirements).toEqual([
      'High school transcript',
      'SAT or ACT',
    ]);
  });
});
