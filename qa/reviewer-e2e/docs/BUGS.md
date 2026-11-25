# Reviewer System E2E findings

Target: AjraSakha Reviewer System staging. The configured Firebase URL
(`https://ajrasakha-staging-594.web.app`) currently returns Firebase's
"Site Not Found" page, so no staging behavior could be confirmed in this run.

## Needs staging verification

- The login form displays required-field messages after an empty submit, but
  the underlying email and password controls are not marked `required` in the
  HTML. Confirm keyboard and browser-native validation behavior at staging.
- Password visibility controls previously had no accessible name. The branch
  now gives the show/hide controls explicit labels; verify in a deployed build.
- Protected route components redirect from effects, so the first render may
  be blank while auth/current-user queries resolve. Smoke tests wait for the
  login form instead of treating the URL change alone as proof.

Do not describe source observations as confirmed production defects. The staging
URL needs a valid Firebase Hosting deployment before the suite can report
reproducible browser bugs.
