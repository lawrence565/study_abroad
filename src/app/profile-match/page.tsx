import { ProfileForm } from '@/components/profile-form';
import { ProfileResults } from '@/components/profile-results';
import { loadSchoolSeed } from '@/lib/schools/load-seed';
import { scoreProfile } from '@/lib/profile-match/score-profile';
import type { SchoolCountry } from '@/types/schools';

type SearchParams = {
  gpa?: string | string[];
  testScore?: string | string[];
  country?: string | string[];
};

type ProfileMatchPageProps = {
  searchParams?: Promise<SearchParams>;
};

function firstValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }

  return value ?? '';
}

function parseNumber(value: string): number | undefined {
  if (!value.trim()) {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
}

function ProfileMatchPageContent({ searchParams }: { searchParams: SearchParams }) {
  const schools = loadSchoolSeed();
  const gpa = firstValue(searchParams.gpa);
  const testScore = firstValue(searchParams.testScore);
  const targetCountry = firstValue(searchParams.country);
  const countries = Array.from(new Set(schools.map((school) => school.country)));
  const results = scoreProfile(
    {
      gpa: parseNumber(gpa),
      testScore: parseNumber(testScore),
      targetCountry: targetCountry as SchoolCountry | '',
    },
    schools,
  );

  return (
    <section aria-labelledby="profile-match-heading" id="profile-match">
      <h1 id="profile-match-heading">Profile Match</h1>
      <p>Compare a student profile against the seeded school programs.</p>
      <ProfileForm
        gpa={gpa}
        testScore={testScore}
        targetCountry={targetCountry}
        countries={countries}
      />
      <ProfileResults results={results} />
    </section>
  );
}

export default async function Page({ searchParams }: ProfileMatchPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};

  return <ProfileMatchPageContent searchParams={resolvedSearchParams} />;
}
