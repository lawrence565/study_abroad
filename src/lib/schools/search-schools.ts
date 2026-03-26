import type { School, SchoolCountry } from '@/types/schools';

export type SchoolSearchFilters = {
  country?: SchoolCountry | '';
  query?: string;
};

function normalize(value: string | undefined): string {
  return value?.trim().toLowerCase() ?? '';
}

function matchesQuery(school: School, query: string): boolean {
  if (!query) {
    return true;
  }

  const searchableValues = [
    school.name,
    school.city,
    school.country,
    school.emailDomain,
    ...school.programs.flatMap((program) => [
      program.code,
      program.name,
      ...program.requirements,
    ]),
  ];

  return searchableValues.some((value) => value.toLowerCase().includes(query));
}

export function searchSchools(
  schools: readonly School[],
  filters: SchoolSearchFilters = {},
): School[] {
  const query = normalize(filters.query);
  const country = filters.country?.trim();

  return [...schools]
    .filter((school) => (country ? school.country === country : true))
    .filter((school) => matchesQuery(school, query))
    .sort((left, right) => {
      if (left.ranking !== right.ranking) {
        return left.ranking - right.ranking;
      }

      return left.name.localeCompare(right.name);
    });
}

