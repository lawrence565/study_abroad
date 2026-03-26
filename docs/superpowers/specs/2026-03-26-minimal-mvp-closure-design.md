# StudyAbroad Minimal MVP Closure — Design Spec

> **Version**: v1.0
> **Date**: 2026-03-26
> **Scope**: Close the existing minimal MVP so it demos as one coherent product

---

## 1. Summary

This spec closes the gap between the currently implemented slices and a demo-ready MVP. The goal is not to add new product modules. The goal is to finish the missing integration seams so the existing `School Explorer`, `Profile Match`, and `Verification` flows behave like one product with shared navigation, shared demo session state, and a working verification submission path.

The closure work is limited to:
- a cookie-backed demo session
- shell-level role visibility and real route navigation
- a real verification submission flow using the existing validation domain logic
- landing-page and documentation polish needed for a coherent MVP demo

This spec explicitly does **not** introduce Firebase, admin tooling, moderation workflows, Marketplace, Events, or Area Guide.

---

## 2. Current State And Gap

The current branch already contains:
- a stable app foundation
- a working `School Explorer`
- a working `Profile Match`
- auth and verification domain logic

The remaining gap is integration:
- demo role state is not persisted across routes
- the shared shell does not surface role state
- global navigation uses hash links instead of real app routes
- the verification form does not submit into the existing validation pipeline
- the landing page does not yet act as the MVP dashboard described by the implementation plan

This work should be treated as one focused sub-project: **MVP closure**, not as a new feature area.

---

## 3. Goals And Non-Goals

### Goals

- Make demo role state persistent across pages during one browser session.
- Show current role and verified status in the shared shell so gating state is visible everywhere.
- Make `/verification` submit through a real server-side path and return success or validation feedback.
- Replace broken hash navigation with real route navigation.
- Turn `/` into a clear MVP entry page describing current scope, routes, deferred modules, and demo constraints.
- Add the missing integration-level tests and basic project documentation.

### Non-Goals

- No Firebase Auth or Firestore integration.
- No permanent verification storage beyond a fake repository seam.
- No actual route protection that blocks navigation to pages.
- No new feature modules beyond what already exists.
- No redesign of the `Profile Match` heuristic beyond what is required to keep the MVP coherent.

---

## 4. Chosen Approach

Use a server-first integration layer built on the current Next.js App Router structure.

### Why this approach

- It preserves the current architecture instead of forcing a rewrite.
- It keeps the MVP demoable without requiring external services.
- It creates clear seams for a later Firebase replacement.
- It closes the most visible product gaps with minimal new moving parts.

### Key decisions

- The demo session is stored in a cookie as the single source of truth.
- The shell reads session state on the server and renders role visibility globally.
- Sign-in is implemented as a small session-setting flow, not a fake query-string switcher.
- Verification submission is handled through a real server-side controller/action that calls the existing verification domain logic.
- The landing page becomes an integration dashboard, not just static copy.

---

## 5. System Design

### 5.1 Demo Session

Introduce a small cookie-backed demo session layer with these responsibilities:

- `session` domain utilities:
  - normalize role values
  - create the session shape used by the app
  - read/write the session cookie through framework-facing helpers
- shell integration:
  - `layout` reads the current demo session on the server
  - `AppShell` receives the current session and renders:
    - primary navigation
    - current role label
    - verified / not verified indicator

The session remains intentionally simple:
- `guest`
- `basic`
- `verified`

The shell must make the current state visible on every delivered route:
- `/`
- `/explorer`
- `/profile-match`
- `/sign-in`
- `/verification`

### 5.2 Sign-In Flow

`/sign-in` remains a demo control surface rather than real auth.

Behavior:
- the page shows the three demo roles
- selecting a role updates the cookie-backed session
- the page re-renders with the new current role
- the shell reflects the same role immediately after navigation

This flow must no longer depend on query params as the main source of truth.
For this closure slice, `?role=` is removed from runtime behavior entirely rather than kept as a fallback. The only supported product path is:
- read role from cookie
- update role through the sign-in flow

Tests should set role state through the same cookie/session helpers or equivalent server-facing seams, not through route query params.

### 5.3 Verification Submission Flow

`/verification` becomes a real end-to-end MVP flow.

Behavior:
- the page loads school options from the existing seed data
- the form posts to a same-page server action
- the server action:
  - parses form input
  - loads the school repository dependency
  - calls `submitVerificationRequest`
  - returns a same-page result state
    - success: inline normalized request summary
    - failure: inline validation error message

This flow does **not** redirect after submit. The same `/verification` page re-renders with the result state so the demo can show both failure and success paths clearly.

Supported methods remain:
- `school_email`
- `manual_review`

Validation rules stay unchanged:
- `school_email` requires a domain matching the selected school record
- `manual_review` requires a non-empty evidence summary

For this MVP, request creation may still use a fake in-memory/no-op repository seam as long as the submission path is real and the validated request object is produced on success.

### 5.4 Navigation

Replace shell hash links with actual route links:
- `/`
- `/explorer`
- `/profile-match`
- `/verification`
- `/sign-in`

The landing page must also expose these routes clearly so the demo can be walked without guessing URLs.

### 5.5 Landing Page And Integration Polish

The landing page becomes the MVP dashboard and must include:
- a short statement of what the current MVP includes
- direct links to the delivered routes
- a clear list of deferred modules:
  - Area Guide
  - Marketplace
  - Events
- a note that demo auth is cookie-backed for MVP purposes
- a note that Firebase replacement is planned later

Project polish also includes:
- `README.md` covering setup, test, build, demo routes, and deferred scope
- explicit `outputFileTracingRoot` in Next config so file tracing is pinned to the repo root

This Next config change is included because the current build already emits a workspace-root inference warning caused by a parent lockfile. The intent is not new capability; it is to make the MVP build behavior explicit and stable.

---

## 6. Boundaries And Responsibilities

To keep the code easy to reason about, the closure work should preserve these unit boundaries:

- session utilities:
  pure role/session logic plus framework-specific cookie helpers
- shell:
  shared navigation and session visibility only
- sign-in page:
  session-changing UI only
- verification domain:
  validation and normalized request creation
- verification page/controller:
  form handling, success/error display, repository wiring
- landing page:
  integration summary and route entrypoint

No UI component should duplicate validation logic already owned by the domain layer.
No domain function should depend on React or route rendering concerns.

---

## 7. Error Handling

Verification errors must be shown as user-visible form feedback, not thrown into a blank page.

Expected handled cases:
- unknown school id
- empty evidence summary for `manual_review`
- missing email for `school_email`
- malformed email
- email domain not matching the selected school

Session handling should degrade safely:
- unknown cookie value falls back to `guest`
- missing cookie falls back to `guest`

---

## 8. Testing And Acceptance Criteria

### Required Tests

- session tests:
  - role normalization
  - cookie-backed read/write behavior
  - verified flag and display name correctness
- shell / sign-in tests:
  - shell shows current role
  - sign-in updates the demo role flow in the intended direction
  - navigation points to real routes
- verification tests:
  - successful `school_email` submission
  - successful `manual_review` submission
  - validation failure surfaces user-visible error state
  - success state shows normalized request summary
- landing / integration tests:
  - landing page lists active MVP routes
  - landing page lists deferred modules
  - landing page explains demo auth / future Firebase replacement

### Acceptance Criteria

The MVP closure is complete when:
- role state persists across routes within one browser session
- the shell visibly reflects current role and verified status
- `/verification` performs a real validated submission flow
- global nav uses working routes
- `/` acts as a usable demo dashboard
- `README.md` exists and matches the delivered MVP
- `npm test` passes
- `npm run build` passes without unresolved product issues

---

## 9. Assumptions

- The fake verification repository is acceptable for the demo as long as the submission path is real and produces a validated normalized request.
- Demo role switching does not need authentication security guarantees because it is explicitly a pre-Firebase MVP tool.
- Route gating in this spec means **visible state and clear permissions**, not hard authorization walls.
- The current `Profile Match` heuristic remains acceptable for the MVP closure and should not be expanded in this sub-project.
