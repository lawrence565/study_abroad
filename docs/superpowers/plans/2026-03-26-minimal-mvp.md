# StudyAbroad Minimal MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a runnable web MVP for `School Explorer + Profile Match + Auth/Verification entry flow + Seed Data`, with TDD-first delivery and milestone commits after each functional slice.

**Architecture:** Use a Next.js 15 App Router application with pure TypeScript domain modules for search, matching, session gating, and verification validation. Keep all external dependencies behind thin adapters so the app runs locally with seed data and a demo auth adapter now, while preserving clear seams for a later Firebase swap-in.

**Tech Stack:** Next.js 15, React 19, TypeScript, Vitest, Testing Library, Zod, npm

---

## Assumptions Locked For This Plan

- Phase 1 only includes `School Explorer`, `Profile Match`, `sign-in/session shell`, and `verification request submission`.
- `Area Guide`, `Marketplace`, and `Events` are explicitly deferred.
- This implementation plan is for the engineering MVP slice selected on 2026-03-26 and intentionally narrows the original beta seed-data ambition. The code must support later expansion to `US Top 100 + UK Top 50`, but the checked-in implementation dataset for this slice may be a representative starter corpus used to validate explorer and match behavior.
- School and program data ship from a checked-in seed dataset for local development and first beta preparation.
- Auth uses a demo cookie-backed session adapter in this MVP so the app is runnable without a live Firebase project; all auth interfaces must be shaped so a Firebase adapter can replace the demo adapter later.
- Verification submission is in scope; manual review tooling is out of scope. Requests can remain in a fake repository layer during this MVP.
- Verification rules for this plan are deterministic:
  - `school_email` method: submitted email domain must match an allowed domain on the selected school record
  - `manual_review` method: the user must provide a non-empty evidence summary string
  - any mismatched school/domain combination is invalid
- Each milestone ends with a commit. Milestone names: `foundation`, `explorer`, `profile-match`, `auth-verification`, `integration-polish`.

## Planned File Structure

- `package.json`: scripts and project dependencies
- `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`: framework and tooling config
- `vitest.config.ts`, `vitest.setup.ts`: unit and component test setup
- `.gitignore`: local ignores for Next.js output and dependencies
- `src/app/layout.tsx`: app shell and metadata
- `src/app/page.tsx`: MVP landing/dashboard page
- `src/app/explorer/page.tsx`: school explorer route
- `src/app/profile-match/page.tsx`: profile match route
- `src/app/sign-in/page.tsx`: demo sign-in route
- `src/app/verification/page.tsx`: verification request route
- `src/components/*.tsx`: focused UI building blocks only
- `src/lib/schools/*`: seed loading, filters, and explorer domain logic
- `src/lib/profile-match/*`: scoring and recommendation engine
- `src/lib/auth/*`: session contract and demo adapter
- `src/lib/verification/*`: validation and repository contract
- `src/types/*`: shared domain types
- `data/schools.seed.json`: checked-in seed dataset for US/UK starter schools
- `tests` live next to domain modules and components when feasible

### Task 1: Foundation And Test Harness

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `eslint.config.mjs`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `.gitignore`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/components/app-shell.tsx`
- Test: `src/app/page.test.tsx`

- [ ] **Step 1: Scaffold the framework and tooling files**

Create the minimal Next.js, TypeScript, ESLint, and Vitest configuration required to run the app and tests. This is configuration work and is the only part of the task that may precede tests.

- [ ] **Step 2: Write the failing landing-page smoke test**

Create `src/app/page.test.tsx` that renders the landing page and expects:
- the product title `StudyAbroad Hub`
- links or buttons for `School Explorer`, `Profile Match`, and `Verification`
- a short MVP summary stating that community modules are deferred

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm test -- src/app/page.test.tsx`

Expected: FAIL because the page and shell components do not exist yet.

- [ ] **Step 4: Write the minimal app shell implementation**

Implement:
- `src/components/app-shell.tsx` for shared header/navigation
- `src/app/layout.tsx` with metadata and shell usage
- `src/app/page.tsx` with the minimal landing content needed to satisfy the test

Do not add extra pages or styling systems in this task.

- [ ] **Step 5: Run tests to verify green**

Run:
- `npm test -- src/app/page.test.tsx`
- `npm test`

Expected: PASS with clean output.

- [ ] **Step 6: Commit the foundation milestone**

Run:
- `git add .`
- `git commit -m "chore: scaffold minimal MVP foundation"`

Milestone: `foundation`

### Task 2: Seed Data And School Explorer

**Files:**
- Create: `data/schools.seed.json`
- Create: `src/types/schools.ts`
- Create: `src/lib/schools/load-seed.ts`
- Create: `src/lib/schools/search-schools.ts`
- Create: `src/lib/schools/load-seed.test.ts`
- Create: `src/lib/schools/search-schools.test.ts`
- Create: `src/app/explorer/page.tsx`
- Create: `src/app/explorer/page.test.tsx`
- Create: `src/components/school-search-form.tsx`
- Create: `src/components/school-results-list.tsx`

- [ ] **Step 1: Write the failing domain tests for seed loading and filtering**

Create tests that prove:
- seed records parse into typed school/program entities
- filtering by country and query term returns only matching schools
- sorting prefers lower ranking values first when multiple schools match

- [ ] **Step 2: Run the domain tests to verify they fail**

Run:
- `npm test -- src/lib/schools/load-seed.test.ts`
- `npm test -- src/lib/schools/search-schools.test.ts`

Expected: FAIL because the loader and search implementation do not exist yet.

- [ ] **Step 3: Write the minimal domain implementation**

Implement:
- `data/schools.seed.json` with a representative starter dataset that includes school email domains and enough US/UK coverage to exercise ranking, filtering, and profile matching behavior
- type definitions in `src/types/schools.ts`
- a seed loader and search helper that operate on real seed data without mocks

The loader and types must make later expansion to the fuller `US Top 100 + UK Top 50` corpus a data-only change rather than a code redesign.

- [ ] **Step 4: Write the failing explorer page test**

Create `src/app/explorer/page.test.tsx` that expects:
- a search UI with query input and country filter
- rendered school cards with ranking and at least one program requirement
- empty-state text when no schools match

- [ ] **Step 5: Run the page test to verify it fails**

Run: `npm test -- src/app/explorer/page.test.tsx`

Expected: FAIL because the route and UI components are missing.

- [ ] **Step 6: Implement the explorer route and UI**

Implement:
- `src/app/explorer/page.tsx`
- `src/components/school-search-form.tsx`
- `src/components/school-results-list.tsx`

Use the domain helpers from this task. Keep the page server-first where possible and keep component responsibilities narrow.

- [ ] **Step 7: Run all explorer tests**

Run:
- `npm test -- src/lib/schools/load-seed.test.ts`
- `npm test -- src/lib/schools/search-schools.test.ts`
- `npm test -- src/app/explorer/page.test.tsx`
- `npm test`

Expected: PASS with clean output.

- [ ] **Step 8: Commit the explorer milestone**

Run:
- `git add .`
- `git commit -m "feat: add school explorer slice"`

Milestone: `explorer`

### Task 3: Profile Match Engine And Flow

**Files:**
- Create: `src/types/profile-match.ts`
- Create: `src/lib/profile-match/score-profile.ts`
- Create: `src/lib/profile-match/score-profile.test.ts`
- Create: `src/app/profile-match/page.tsx`
- Create: `src/app/profile-match/page.test.tsx`
- Create: `src/components/profile-form.tsx`
- Create: `src/components/profile-results.tsx`

- [ ] **Step 1: Write the failing engine tests**

Create tests that prove:
- GPA and language score normalization produce deterministic numeric scoring
- recommendation bands map to `Reach`, `Match`, and `Safety`
- missing optional fields do not crash scoring
- each result includes human-readable reasons explaining fit or gaps

- [ ] **Step 2: Run the engine tests to verify they fail**

Run: `npm test -- src/lib/profile-match/score-profile.test.ts`

Expected: FAIL because the engine does not exist yet.

- [ ] **Step 3: Implement the minimal profile-match engine**

Implement `src/lib/profile-match/score-profile.ts` as a pure function over typed inputs and seed-school program requirements. Do not add AI generation, plagiarism checks, or external APIs in this task.

- [ ] **Step 4: Write the failing page test**

Create `src/app/profile-match/page.test.tsx` that expects:
- a profile form with GPA, test-score, and target-country inputs
- result cards grouped by recommendation band
- explanation text for why a school appears in the result set

- [ ] **Step 5: Run the page test to verify it fails**

Run: `npm test -- src/app/profile-match/page.test.tsx`

Expected: FAIL because the route and UI components are missing.

- [ ] **Step 6: Implement the route and UI**

Implement:
- `src/app/profile-match/page.tsx`
- `src/components/profile-form.tsx`
- `src/components/profile-results.tsx`

Keep calculation logic out of React components.

- [ ] **Step 7: Run profile-match verification**

Run:
- `npm test -- src/lib/profile-match/score-profile.test.ts`
- `npm test -- src/app/profile-match/page.test.tsx`
- `npm test`

Expected: PASS with clean output.

- [ ] **Step 8: Commit the profile-match milestone**

Run:
- `git add .`
- `git commit -m "feat: add profile match slice"`

Milestone: `profile-match`

### Task 4: Demo Auth And Verification Request Flow

**Files:**
- Create: `src/types/auth.ts`
- Create: `src/types/verification.ts`
- Create: `src/lib/auth/session.ts`
- Create: `src/lib/auth/demo-session.ts`
- Create: `src/lib/auth/session.test.ts`
- Create: `src/lib/verification/submit-request.ts`
- Create: `src/lib/verification/submit-request.test.ts`
- Create: `src/app/sign-in/page.tsx`
- Create: `src/app/sign-in/page.test.tsx`
- Create: `src/app/verification/page.tsx`
- Create: `src/app/verification/page.test.tsx`
- Create: `src/components/sign-in-panel.tsx`
- Create: `src/components/verification-form.tsx`

- [ ] **Step 1: Write the failing auth and verification domain tests**

Create tests that prove:
- a demo session can express `guest`, `basic`, and `verified` roles
- verification submission rejects empty evidence for `manual_review`
- verification submission rejects any `school_email` whose domain is not listed on the selected school record
- a valid submission produces a normalized request payload with `pending` status

- [ ] **Step 2: Run the domain tests to verify they fail**

Run:
- `npm test -- src/lib/auth/session.test.ts`
- `npm test -- src/lib/verification/submit-request.test.ts`

Expected: FAIL because the auth and verification logic does not exist yet.

- [ ] **Step 3: Implement minimal auth and verification domain code**

Implement:
- session contracts and demo adapter
- verification payload validation and normalization

Keep repository interactions behind a simple interface so Firebase can replace the fake implementation later.

- [ ] **Step 4: Write the failing sign-in and verification page tests**

Create tests that expect:
- `src/app/sign-in/page.tsx` shows role-based sign-in options for MVP demo usage
- `src/app/verification/page.tsx` shows the verification form and explains verified-only publishing permissions
- the shared shell surfaces the current demo role so route gating state is user-visible during MVP testing

- [ ] **Step 5: Run the page tests to verify they fail**

Run:
- `npm test -- src/app/sign-in/page.test.tsx`
- `npm test -- src/app/verification/page.test.tsx`

Expected: FAIL because the routes and components do not exist yet.

- [ ] **Step 6: Implement the auth and verification routes**

Implement:
- `src/app/sign-in/page.tsx`
- `src/app/verification/page.tsx`
- `src/components/sign-in-panel.tsx`
- `src/components/verification-form.tsx`

The verification page should clearly state that marketplace and event-hosting permissions require verified status, even though those modules are deferred.

- [ ] **Step 7: Run auth/verification verification**

Run:
- `npm test -- src/lib/auth/session.test.ts`
- `npm test -- src/lib/verification/submit-request.test.ts`
- `npm test -- src/app/sign-in/page.test.tsx`
- `npm test -- src/app/verification/page.test.tsx`
- `npm test`

Expected: PASS with clean output.

- [ ] **Step 8: Commit the auth-verification milestone**

Run:
- `git add .`
- `git commit -m "feat: add auth and verification slice"`

Milestone: `auth-verification`

### Task 5: Integration Polish And Milestone Hardening

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/app/page.integration.test.tsx`
- Create: `README.md`
- Modify: `package.json`

- [ ] **Step 1: Write the failing integration smoke test**

Create `src/app/page.integration.test.tsx` that expects the landing page to summarize:
- current MVP scope
- available routes
- deferred modules
- next milestone notes for future Firebase replacement

- [ ] **Step 2: Run the integration test to verify it fails**

Run: `npm test -- src/app/page.integration.test.tsx`

Expected: FAIL because the landing page copy does not yet include all integration details.

- [ ] **Step 3: Implement the minimal integration polish**

Implement:
- a clearer landing/dashboard summary
- route links for all delivered slices
- a short `README.md` with setup, test, and milestone descriptions
- final npm scripts if any cleanup is required

- [ ] **Step 4: Run the full verification set**

Run:
- `npm test`
- `npm run build`

Expected: PASS with clean output.

- [ ] **Step 5: Commit the integration-polish milestone**

Run:
- `git add .`
- `git commit -m "docs: finalize minimal MVP integration polish"`

Milestone: `integration-polish`

## Review And Delivery Rules

- After each task, dispatch a fresh implementer subagent. Do not reuse implementation context across tasks unless fixing the same task after review feedback.
- After each implementation task, run spec compliance review first, then code quality review.
- Do not move to the next task until both reviews are approved or all blocking issues are fixed.
- If a task produces a clean milestone commit, create a matching lightweight tag after approval:
  - `foundation`
  - `explorer`
  - `profile-match`
  - `auth-verification`
  - `integration-polish`
- Before claiming MVP completion, verify `npm test` and `npm run build` in the worktree.
