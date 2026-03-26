export default function Page() {
  const activeRoutes = [
    {
      href: '/explorer',
      label: 'School Explorer',
      description: 'Search and filter the seeded school catalog.',
    },
    {
      href: '/profile-match',
      label: 'Profile Match',
      description: 'Compare GPA and test scores against school bands.',
    },
    {
      href: '/verification',
      label: 'Verification',
      description: 'Review the demo school-email verification flow.',
    },
    {
      href: '/sign-in',
      label: 'Sign In',
      description: 'Switch the cookie-backed demo role for this session.',
    },
  ] as const;

  const deferredModules = ['Area Guide', 'Marketplace', 'Events'] as const;

  return (
    <section aria-labelledby="landing-heading">
      <h1 id="landing-heading">StudyAbroad Hub</h1>
      <p>
        School Explorer, Profile Match, and Verification are the MVP entry
        points. Community modules are deferred for now.
      </p>

      <section aria-labelledby="active-mvp-routes-heading">
        <h2 id="active-mvp-routes-heading">Active MVP Routes</h2>
        <ul>
          {activeRoutes.map((route) => (
            <li key={route.href}>
              <a href={route.href}>{route.label}</a>
              <p>{route.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="deferred-modules-heading">
        <h2 id="deferred-modules-heading">Deferred Modules</h2>
        <ul>
          {deferredModules.map((module) => (
            <li key={module}>{module}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="demo-auth-heading">
        <h2 id="demo-auth-heading">Demo Auth</h2>
        <p>
          Demo auth is cookie-backed for the web MVP, and Firebase Auth plus
          Firestore are the planned replacement once the real backend lands.
        </p>
      </section>
    </section>
  );
}
