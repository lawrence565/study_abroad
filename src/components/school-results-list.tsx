import type { School } from '@/types/schools';

type SchoolResultsListProps = {
  schools: readonly School[];
  hasActiveFilters: boolean;
};

export function SchoolResultsList({
  schools,
  hasActiveFilters,
}: SchoolResultsListProps) {
  if (schools.length === 0 && hasActiveFilters) {
    return (
      <p>No schools match your search. Try a different country or query.</p>
    );
  }

  return (
    <ol>
      {schools.map((school) => (
        <li key={school.id}>
          <article>
            <h2>{school.name}</h2>
            <p>
              Ranked #{school.ranking} in {school.country}
            </p>
            <p>
              {school.city} · Email domain: {school.emailDomain}
            </p>
            <div>
              {school.programs.map((program) => (
                <section key={program.code}>
                  <h3>{program.name}</h3>
                  <p>{program.level}</p>
                  <ul>
                    {program.requirements.map((requirement) => (
                      <li key={requirement}>{requirement}</li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </article>
        </li>
      ))}
    </ol>
  );
}

