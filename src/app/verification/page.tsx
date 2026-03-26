import { VerificationForm } from '@/components/verification-form';
import { resolveDemoSession } from '@/lib/auth/demo-session';
import { loadSchoolSeed } from '@/lib/schools/load-seed';

type SearchParams = {
  role?: string | string[];
};

type VerificationPageProps = {
  searchParams?: Promise<SearchParams>;
};

export default async function Page({ searchParams }: VerificationPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const session = resolveDemoSession(resolvedSearchParams.role);
  const schools = loadSchoolSeed();

  return (
    <section aria-labelledby="verification-heading" id="verification">
      <h1 id="verification-heading">Verification</h1>
      <p>
        Marketplace and event-hosting permissions require verified status, even
        though those modules are deferred.
      </p>
      <VerificationForm schools={schools} currentRole={session.role} />
    </section>
  );
}
