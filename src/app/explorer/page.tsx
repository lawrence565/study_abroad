import { SchoolResultsList } from '@/components/school-results-list';
import { SchoolSearchForm } from '@/components/school-search-form';
import { loadSchoolSeed } from '@/lib/schools/load-seed';
import { searchSchools } from '@/lib/schools/search-schools';
import type { SchoolCountry } from '@/types/schools';

type SearchParams = {
  q?: string | string[];
  country?: string | string[];
};

type ExplorerPageProps = {
  searchParams?: SearchParams;
};

function firstValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }

  return value ?? '';
}

export default function Page({ searchParams = {} }: ExplorerPageProps) {
  const schools = loadSchoolSeed();
  const query = firstValue(searchParams.q);
  const country = firstValue(searchParams.country);
  const countries = Array.from(new Set(schools.map((school) => school.country)));
  const filteredSchools = searchSchools(schools, {
    query,
    country: country as SchoolCountry | '',
  });
  const hasActiveFilters = Boolean(query.trim() || country);

  return (
    <section aria-labelledby="school-explorer-heading">
      <h1 id="school-explorer-heading">School Explorer</h1>
      <p>Browse seed schools by country, ranking, and program requirements.</p>
      <SchoolSearchForm query={query} country={country} countries={countries} />
      <SchoolResultsList
        schools={filteredSchools}
        hasActiveFilters={hasActiveFilters}
      />
    </section>
  );
}

