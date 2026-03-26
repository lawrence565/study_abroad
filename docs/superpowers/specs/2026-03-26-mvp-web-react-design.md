# StudyAbroad MVP Web / React Design Spec

> **Version**: v1.0
> **Date**: 2026-03-26
> **Scope**: React / Next.js Web version of the current demo-first MVP

---

## 1. Summary

This spec defines the Web implementation standard for the current MVP using React and Next.js App Router. It does **not** expand product scope. It reframes the current MVP as a **server-first Web application** that is demo-ready, internally coherent, and aligned with Vercel React / Next.js best practices.

The immediate goal is to close the current MVP on the Web while improving architecture quality at the same time:
- keep the product demo-first
- keep the current seed-data and fake-repository approach
- avoid external service coupling
- strengthen the React / Next.js implementation model so the current Web version can serve as the baseline for future growth

This spec is the Web-specific counterpart to the MVP closure spec. It focuses on React/Next.js component boundaries, server/client responsibilities, page data flow, bundle discipline, and performance-aware implementation constraints.

---

## 2. Goals And Non-Goals

### Goals

- Define the MVP Web app as a **server-first Next.js App Router application**.
- Close the current MVP gaps in a way that follows modern React / Next.js patterns.
- Keep state, data loading, and mutations structured so the app is easy to extend later.
- Minimize avoidable client JavaScript and serialization overhead.
- Preserve the existing delivered slices:
  - `School Explorer`
  - `Profile Match`
  - `Demo Sign-In`
  - `Verification`

### Non-Goals

- No Firebase integration in this spec.
- No mobile or React Native scope.
- No new feature modules beyond the current MVP.
- No redesign of the product concept or deferred modules.
- No attempt to make the current `Profile Match` heuristic production-grade beyond MVP coherence.

---

## 3. Architecture Position

The MVP Web app is explicitly **Server-first**.

### 3.1 Default Rendering Model

- Server Components are the default for pages and data-owning route composition.
- Client Components are only used for interaction islands that genuinely need client-side state or pending UI behavior.
- Domain logic must stay outside React components whenever possible.

### 3.2 Mutation Model

- Mutations must be implemented through **Server Actions**.
- Server Actions must be treated like public mutation endpoints and must verify auth/session state inside the action.
- No mutation flow should depend only on a page guard, layout assumption, or client-side state.

### 3.3 Data Transfer Model

- Props crossing the RSC boundary must be minimized to only the fields a client component actually needs.
- Full school objects, full session objects, or other oversized server data structures must not be passed into client components by default.

### 3.4 Async Model

- Independent server-side reads must run in parallel, not as serial `await` waterfalls.
- Repeated server-side reads within one request should be deduplicated where appropriate.

---

## 4. React / Next.js Design Constraints

This spec adopts the following Vercel-aligned implementation constraints:

### 4.1 Server-First By Default

- Server pages own query parsing, cookie parsing, and domain orchestration.
- Domain helpers remain plain TypeScript modules, not hooks or component-bound logic.

### 4.2 Minimal Client Surface

Allowed client responsibilities:
- form pending state
- local interactive UI state
- browser-only affordances

Disallowed client responsibilities by default:
- loading core route data
- computing business decisions already available on the server
- duplicating validation rules from the domain layer

### 4.3 No Barrel Imports

Imports should come from direct source files rather than local barrel files or broad package entrypoints. This keeps builds and cold starts predictable and aligns with bundle-size guidance.

### 4.4 Server Action Security

Every server action must:
- validate input
- verify session / authorization context
- perform the mutation only after those checks

This applies even in a demo-first MVP.

### 4.5 Minimal Serialization

Client islands should receive only small view-model props.

Examples:
- verification form gets school option labels and ids, not full school entities
- shell gets a compact session view model, not internal session helpers

### 4.6 Request-Level Deduplication

Server-side session resolution and other repeated non-`fetch` async work should be structured so they can be deduplicated per request, for example through `React.cache()` or an equivalent request-scoped helper.

### 4.7 Avoid Over-Hydration

No route should become a client component unless the whole page genuinely requires it.
`/`, `/explorer`, and `/profile-match` should remain fully server-first.

### 4.8 Dynamic Imports Only When Justified

`next/dynamic` should only be introduced for clearly heavy, non-critical UI. It is not required for the current MVP routes unless an actual heavy client dependency appears.

---

## 5. Route-Level Design

### 5.1 `/`

Purpose:
- MVP dashboard and demo entry page

Rendering model:
- Server page

Behavior:
- read current demo session on the server
- compose a lightweight dashboard summary
- render direct links to delivered routes
- render deferred-module summary
- explain that auth is demo-session based and Firebase is deferred

This page should not require client-side state.

### 5.2 `/explorer`

Purpose:
- school discovery and filtering

Rendering model:
- Server page with GET-driven filters

Behavior:
- read query params on the server
- load seed school data on the server
- filter and sort results on the server
- render the search form and results server-first

The form should prefer URL-driven state over a client-side store.

### 5.3 `/profile-match`

Purpose:
- deterministic recommendation flow

Rendering model:
- Server page with GET-driven input

Behavior:
- parse profile inputs from query params
- run the scoring engine on the server
- render grouped recommendations and reasons on the server

The scoring engine remains a pure TypeScript domain module outside React.

### 5.4 `/sign-in`

Purpose:
- demo session control surface

Rendering model:
- Server page plus server action

Behavior:
- read the current session from cookie-backed state
- render available demo role options
- update the role through a server action
- re-render with the new persisted role

`?role=` is not a runtime source of truth in this design.

### 5.5 `/verification`

Purpose:
- demo verification request flow

Rendering model:
- Server page plus same-page server action

Behavior:
- load the current session and school options on the server
- render the form
- submit through a server action
- call the existing verification domain logic
- re-render inline with:
  - success summary
  - or validation error feedback

The action does not redirect away from the page. The result remains visible in place so the flow demos clearly.

---

## 6. Data Flow Design

### 6.1 Session Data

Source of truth:
- cookie-backed demo session

Flow:
- `layout` resolves session on the server
- shell receives a compact session view model
- sign-in action mutates the cookie-backed role
- all routes reflect the updated role on next render

The shell must show:
- current role
- whether the user is verified

### 6.2 School Data

Source of truth:
- checked-in seed dataset

Flow:
- seed loader stays server-side
- explorer and verification both depend on it
- profile match depends on school/program requirements derived from it

The loader must remain easy to replace later, but in this MVP it stays demo-first and local.

### 6.3 Verification Submission

Flow:
- form input
- server action
- validation + normalization in domain layer
- fake repository seam
- inline result render

The server action should pass only the inputs and dependencies needed by the domain layer and return a compact success/error view model to the page.

---

## 7. Component Boundaries

To keep the Web MVP maintainable, responsibilities should remain narrow:

- `layout`
  - server composition
  - session resolution
  - shell wiring

- `AppShell`
  - navigation
  - role visibility
  - page chrome

- `sign-in panel`
  - role-switching UI only

- `verification form`
  - form fields
  - submission UX
  - success/error rendering

- `school search form`
  - explorer input controls only

- `school results list`
  - explorer display only

- `profile form`
  - profile input controls only

- `profile results`
  - grouped recommendation rendering only

No component should own both:
- domain calculation
- and UI orchestration

unless the logic is trivial presentation logic.

---

## 8. Performance And Bundle Guidance

### 8.1 Avoid Async Waterfalls

When a route needs multiple independent server reads, resolve them in parallel.

Applies especially to:
- session + landing summary
- session + school options on verification page

### 8.2 Avoid Over-Serialization

If a client island is needed, pass only the smallest view model necessary.

Examples:
- school option `{ id, name, emailDomain }`
- session badge `{ role, isVerified, displayName }`

### 8.3 Avoid Bundle Bloat

- no barrel files
- no unnecessary client-only wrappers
- no broad package imports if direct imports are sufficient

### 8.4 Prefer URL State For Read Flows

Explorer and profile-match are read-heavy flows. Their state should stay in URL/query params rather than local stores so pages remain server-friendly and bookmarkable.

---

## 9. Error Handling

### 9.1 Session

- invalid or missing cookie falls back to `guest`
- unknown role values must not crash rendering

### 9.2 Verification

User-visible error states must be rendered for:
- unknown school
- missing school email
- malformed email
- mismatched school domain
- empty evidence summary

Errors should surface inline on `/verification`, not as route-breaking exceptions in the UI.

---

## 10. Testing Requirements

### 10.1 Session / Shell

- cookie-backed role resolution
- role switching behavior
- shell shows current role and verified state
- navigation points to real routes

### 10.2 Explorer

- query filtering
- country filtering
- ranking order
- route renders from URL state correctly

### 10.3 Profile Match

- deterministic scoring
- grouped output
- explanation text
- GET-driven route rendering

### 10.4 Verification

- successful school-email submission
- successful manual-review submission
- inline error state on invalid input
- inline success state with normalized request summary

### 10.5 Integration

- landing page lists active routes
- landing page lists deferred modules
- sign-in / shell / verification flow reflects persisted demo role
- `npm test` passes
- `npm run build` passes

---

## 11. Acceptance Criteria

The MVP Web / React layer is complete when:

- all delivered MVP routes follow the server-first design in this spec
- cookie-backed demo session works across routes
- shell globally shows current role and verified state
- navigation uses working routes rather than hash placeholders
- verification is a real submission flow, not a static form
- landing page acts as the Web MVP dashboard
- the current implementation does not have obvious violations of the React / Next.js constraints above
- tests and build pass cleanly enough for a demo-ready branch

---

## 12. Assumptions

- The demo-first architecture is intentional for this phase.
- A fake repository seam is acceptable for verification so long as the flow is end-to-end from form to validated result.
- Firebase integration is a later concern and should not distort the Web MVP shape now.
- The full Web platform spec will be written separately after this MVP Web spec, and will cover broader platform expansion.
