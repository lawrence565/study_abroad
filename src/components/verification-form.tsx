'use client';

import { useActionState } from 'react';
import type { DemoRole } from '@/types/auth';
import type {
  VerificationActionState,
  VerificationSchoolOption,
} from '@/types/verification';

type VerificationFormProps = {
  schools: VerificationSchoolOption[];
  currentRole: DemoRole;
  action: (
    previousState: VerificationActionState,
    formData: FormData,
  ) => Promise<VerificationActionState>;
  initialState?: VerificationActionState;
};

function formatRequestSummary(state: Extract<VerificationActionState, { status: 'success' }>) {
  const { request } = state;

  return (
    <>
      <p>{state.message}</p>
      <p>
        {request.schoolName} ({request.schoolDomain})
      </p>
      <p>Method: {request.method}</p>
      {request.schoolEmail ? <p>School email: {request.schoolEmail}</p> : null}
      {request.evidenceSummary ? (
        <p>Evidence summary: {request.evidenceSummary}</p>
      ) : null}
      <p>Submitted at: {request.submittedAt}</p>
    </>
  );
}

export function VerificationForm({
  schools,
  currentRole,
  action,
  initialState = { status: 'idle' },
}: VerificationFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <section aria-labelledby="verification-form-heading">
      <h2 id="verification-form-heading">Verification form</h2>
      <p>Current demo role: {currentRole}.</p>
      <form action={formAction}>
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

        {state.status === 'success' ? (
          <div role="status">{formatRequestSummary(state)}</div>
        ) : null}
        {state.status === 'error' ? (
          <p role="alert">{state.message}</p>
        ) : null}

        <button type="submit" disabled={pending}>
          {pending ? 'Requesting verification...' : 'Request verification'}
        </button>
      </form>
    </section>
  );
}
