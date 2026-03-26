import type { SchoolCountry } from '@/types/schools';

type SchoolSearchFormProps = {
  query: string;
  country: string;
  countries: readonly SchoolCountry[];
};

export function SchoolSearchForm({
  query,
  country,
  countries,
}: SchoolSearchFormProps) {
  return (
    <form action="/explorer" method="get">
      <label htmlFor="school-search-query">Search schools</label>
      <input
        id="school-search-query"
        name="q"
        type="search"
        defaultValue={query}
        placeholder="School name, program, city, or email domain"
      />

      <label htmlFor="school-search-country">Country</label>
      <select id="school-search-country" name="country" defaultValue={country}>
        <option value="">All countries</option>
        {countries.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>

      <button type="submit">Search</button>
    </form>
  );
}

