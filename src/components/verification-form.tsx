import type { DemoRole } from '@/types/auth';
import type { School } from '@/types/schools';

type VerificationFormProps = {
  schools: School[];
  currentRole: DemoRole;
};

export function VerificationForm({ schools, currentRole }: VerificationFormProps) {
  return (
    <section aria-labelledby="verification-form-heading">
      <h2 id="verification-form-heading">Verification form</h2>
      <p>Current demo role: {currentRole}.</p>
      <form>
        <div>
          <label htmlFor="school">School</label>
          <select id="school" name="schoolId" defaultValue={schools[0]?.id ?? ''}>
            {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
        </div>
        <fieldset>
          <legend>Verification method</legend>
          <label htmlFor="school-email-method">
            <input
              id="school-email-method"
              type="radio"
              name="method"
              value="school_email"
              defaultChecked
            />
            School email
          </label>
          <label htmlFor="manual-review-method">
            <input
              id="manual-review-method"
              type="radio"
              name="method"
              value="manual_review"
            />
            Manual review
          </label>
        </fieldset>
        <div>
          <label htmlFor="school-email">School email</label>
          <input id="school-email" name="schoolEmail" type="email" />
        </div>
        <div>
          <label htmlFor="evidence-summary">Evidence summary</label>
          <textarea id="evidence-summary" name="evidenceSummary" />
        </div>
        <button type="submit">Request verification</button>
      </form>
    </section>
  );
}
