import type { DemoRole } from '@/types/auth';

type SignInPanelProps = {
  currentRole: DemoRole;
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

export function SignInPanel({ currentRole }: SignInPanelProps) {
  return (
    <section aria-labelledby="demo-sign-in-heading">
      <h2 id="demo-sign-in-heading">Demo role options</h2>
      <p>Current demo role: {currentRole}.</p>
      <ul>
        {roleActions.map((action) => (
          <li key={action.role}>
            <a href={`/sign-in?role=${action.role}`}>{action.label}</a>
            <p>{action.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
