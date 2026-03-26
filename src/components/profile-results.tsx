import type { ProfileMatchBand, ProfileMatchResult } from '@/types/profile-match';

const bandOrder: ProfileMatchBand[] = ['Safety', 'Match', 'Reach'];

type ProfileResultsProps = {
  results: readonly ProfileMatchResult[];
};

export function ProfileResults({ results }: ProfileResultsProps) {
  return (
    <div>
      {bandOrder.map((band) => {
        const bandResults = results.filter((result) => result.band === band);

        return (
          <section key={band} aria-labelledby={`${band.toLowerCase()}-heading`}>
            <h2 id={`${band.toLowerCase()}-heading`}>{band}</h2>
            {bandResults.length === 0 ? (
              <p>No schools are currently in this band.</p>
            ) : (
              <ol>
                {bandResults.map((result) => (
                  <li key={`${result.schoolId}-${result.programCode}`}>
                    <article>
                      <h3>{result.schoolName}</h3>
                      <p>
                        {result.programName} · {result.score} score
                      </p>
                      <p>Program requirements: {result.programRequirements.join(', ')}</p>
                      <ul>
                        {result.reasons.map((reason) => (
                          <li key={reason}>{reason}</li>
                        ))}
                      </ul>
                    </article>
                  </li>
                ))}
              </ol>
            )}
          </section>
        );
      })}
    </div>
  );
}
