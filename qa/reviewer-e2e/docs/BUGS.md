# Reviewer System E2E findings

Target: AjraSakha Reviewer System staging. The configured Firebase URL
(`https://ajrasakha-staging-594.web.app`) returned Firebase's "Site Not Found"
page during testing. The staging deploy workflow was passing the generic
Firebase project setting instead of its staging-specific project setting; a
workflow correction is prepared but needs to be deployed before confirming the
site is restored.

## Needs staging verification

- The login form displays required-field messages after an empty submit, but
  the underlying email and password controls are not marked `required` in the
  HTML. Confirm keyboard and browser-native validation behavior at staging.
- Password visibility controls previously had no accessible name. The branch
  now gives the show/hide controls explicit labels; verify in a deployed build.
- Protected route components redirect from effects, so the first render may
  be blank while auth/current-user queries resolve. Smoke tests wait for the
  login form instead of treating the URL change alone as proof.

Do not describe source observations as confirmed production defects. Recheck
the staging URL after the corrected deploy and use the Playwright run to report
reproducible browser bugs.
