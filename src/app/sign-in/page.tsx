import { SignInPanel } from '@/components/sign-in-panel';
import { resolveDemoSession } from '@/lib/auth/demo-session';
import { setDemoRoleAction } from '@/app/sign-in/actions';

type SearchParams = {
  role?: string | string[];
};

type SignInPageProps = {
  searchParams?: Promise<SearchParams>;
};

export default async function Page({ searchParams }: SignInPageProps) {
  await searchParams;
  const session = await resolveDemoSession();

  return (
    <section aria-labelledby="sign-in-heading" id="sign-in">
      <h1 id="sign-in-heading">Sign In</h1>
      <p>Use the demo roles to test route gating before Firebase exists.</p>
      <SignInPanel currentRole={session.role} action={setDemoRoleAction} />
    </section>
  );
}
