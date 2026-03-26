import type { SchoolCountry } from '@/types/schools';

type ProfileFormProps = {
  gpa: string;
  standardizedScore: string;
  targetCountry: string;
  countries: readonly SchoolCountry[];
};

export function ProfileForm({
  gpa,
  standardizedScore,
  targetCountry,
  countries,
}: ProfileFormProps) {
  return (
    <form action="/profile-match" method="get">
      <label htmlFor="profile-gpa">GPA</label>
      <input
        id="profile-gpa"
        name="gpa"
        type="number"
        min="0"
        max="4"
        step="0.01"
        defaultValue={gpa}
        placeholder="3.7"
      />

      <label htmlFor="profile-standardized-score">Standardized score</label>
      <p>
        Use one comparable score for SAT, ACT, TOEFL, IELTS, GRE, or similar
        standardized requirements.
      </p>
      <input
        id="profile-standardized-score"
        name="standardizedScore"
        type="number"
        min="0"
        max="120"
        step="1"
        defaultValue={standardizedScore}
        placeholder="95"
      />

      <label htmlFor="profile-target-country">Target country</label>
      <select
        id="profile-target-country"
        name="country"
        defaultValue={targetCountry}
      >
        <option value="">All countries</option>
        {countries.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>

      <button type="submit">Match schools</button>
    </form>
  );
}
