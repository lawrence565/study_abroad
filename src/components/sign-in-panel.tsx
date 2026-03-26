import type { DemoRole } from '@/types/auth';

type SignInPanelProps = {
  currentRole: DemoRole;
  action: (formData: FormData) => void | Promise<void>;
};

const roleActions: Array<{
  role: DemoRole;
  label: string;
  description: string;
}> = [
  {
    role: 'guest',
    label: 'Continue as Guest',
    description: 'Preview the app without publishing permissions.',
  },
  {
    role: 'basic',
    label: 'Switch to Basic',
    description: 'Use the demo with limited account access.',
  },
  {
    role: 'verified',
    label: 'Switch to Verified',
    description: 'Unlock verified-only workflows for testing.',
  },
];

export function SignInPanel({ currentRole, action }: SignInPanelProps) {
  return (
    <section aria-labelledby="demo-sign-in-heading">
      <h2 id="demo-sign-in-heading">Demo role options</h2>
      <p>Current demo role: {currentRole}.</p>
      <ul>
        {roleActions.map((roleAction) => (
          <li key={roleAction.role}>
            <form action={action}>
              <input type="hidden" name="role" value={roleAction.role} />
              <button type="submit">{roleAction.label}</button>
            </form>
            <p>{roleAction.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
