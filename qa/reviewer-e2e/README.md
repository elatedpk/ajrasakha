# Reviewer System E2E

Playwright coverage for the real AjraSakha Reviewer System frontend. Tests load
the deployed staging app; role-based UI scenarios install a synthetic client
session and intercept `/api` calls so they never change actual reviewer data.
The suite captures failure screenshots, video, and traces for investigation.

## Setup

```sh
cd qa/reviewer-e2e
pnpm install
pnpm exec playwright install chromium
cp .env.example .env
```

Set `E2E_BASE_URL` to the staging URL. Its default comes from the site configured
in `.github/workflows/frontend-staging-deployment.yml`.

- `pnpm test:smoke` runs public login and route-guard checks without credentials.
- `pnpm test:staging` runs the role-based UI suite with API interception.

## Safety boundary

Allocation, answer submission, and final approval change server data. The
staging UI suite intercepts those writes and verifies frontend behavior and
request payloads; it does not claim to verify back-end persistence. Connected
tests need dedicated staging accounts and disposable, repeatable question data.
Never point the suite at production or use personal reviewer accounts.

## CI and evidence

The `Reviewer System E2E` workflow runs after a successful deployment to the
configured staging site and can also be started manually. The Playwright HTML
report includes screenshots of the moderator and expert workspaces and uploads
failure screenshots, video, and traces as CI artifacts for review and demo.
`docs/BUGS.md` separates source-level observations from defects reproduced in
the browser.
