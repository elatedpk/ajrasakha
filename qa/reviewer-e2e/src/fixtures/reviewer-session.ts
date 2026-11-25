import type { Page, Request, Route } from "@playwright/test";

export type ReviewerRole = "moderator" | "expert";

export function reviewerUser(role: ReviewerRole) {
  const moderator = role === "moderator";
  return {
    _id: moderator ? "e2e-moderator" : "e2e-expert",
    uid: moderator ? "e2e-moderator" : "e2e-expert",
    email: `${role}@example.invalid`,
    firstName: moderator ? "Test" : "Review",
    lastName: moderator ? "Moderator" : "Expert",
    name: moderator ? "Test Moderator" : "Review Expert",
    role,
    isBlocked: false,
    notifications: 0,
    incentive: 0,
    penalty: 0,
  };
}

/** Load the real staging UI with a synthetic client session and stub its API. */
export async function installReviewerSession(
  page: Page,
  role: ReviewerRole,
  overrides: Record<string, unknown> = {},
): Promise<void> {
  const user = reviewerUser(role);
  const authState = {
    state: { user, firebaseUser: null, loading: false, error: null, isAuthenticated: true },
    version: 0,
  };

  await page.addInitScript((value) => {
    window.localStorage.setItem("auth-storage", JSON.stringify(value));
  }, authState);

  await page.route("**/*", async (route: Route, request: Request) => {
    const path = new URL(request.url()).pathname;
    const isApiPath =
      path.includes("/api/") || /\/(users|questions|answers|notifications)(\/|$)/.test(path);
    if (!isApiPath) {
      await route.continue();
      return;
    }

    let payload: unknown = { data: [], totalCount: 0, totalPages: 0 };
    if (path.endsWith("/users/me")) payload = user;
    else if (path.endsWith("/users/all")) payload = { myPreference: {}, users: [], totalUsers: 0, totalPages: 0 };
    else if (path.endsWith("/users/list")) payload = { users: [], totalUsers: 0, totalPages: 0 };
    else if (path.endsWith("/users/review-level")) payload = [];
    else if (path.endsWith("/users/working-hours")) payload = { workingHours: 0 };
    else if (path.endsWith("/users/reviewer-lifecycle")) payload = [];
    else if (path.endsWith("/location/states")) payload = [];
    else if (path.endsWith("/crops/entry-types")) payload = { types: [] };
    else if (path.includes("/crops")) payload = { crops: [], totalCount: 0, totalPages: 0 };
    else if (path.includes("/organizations")) payload = { organizations: [], totalPages: 0 };
    else if (path.includes("/chemicals")) payload = { chemicals: [], totalCount: 0, totalPages: 0 };
    else if (path.includes("/questions/detailed")) payload = { totalPages: 0, totalCount: 0, questions: [] };
    else if (/\/questions\/(allocated|re-routed|rerouted)/.test(path)) payload = [];
    else if (path.endsWith("/performance/heatMapofReviewers")) payload = { data: [], total: 0 };
    else if (path.endsWith("/performance/overview")) payload = { userRoleOverview: [], stfExpertCount: 0, stfModeratorCount: 0, moderatorApprovalRate: {} };
    else if (path.endsWith("/performance/golden-dataset")) payload = { yearData: [], weeksData: [], dailyData: [], dayHourlyData: {}, moderatorBreakdown: [], totalEntriesByType: 0, totalVerifiedByType: 0, verifiedEntries: 0 };
    else if (path.endsWith("/performance/contribution-trend")) payload = { labels: [], datasets: [] };
    else if (path.endsWith("/performance/status-overview")) payload = { questions: [], answers: [] };
    else if (path.endsWith("/performance/expert-performance")) payload = [];
    else if (path.endsWith("/performance/questions-analytics")) payload = { cropData: [], stateData: [], domainData: [], tableData: [] };
    else if (path.endsWith("/notifications")) {
      payload = { notifications: [], page: 1, totalCount: 0, totalPages: 1 };
    } else if (path.includes("/queue-details")) payload = { success: true, data: {} };
    else if (path.includes("/status-summary")) {
      payload = { success: true, data: { totalQuestions: 0, statuses: [], sourceCounts: [] } };
    }
    if (overrides[path] !== undefined) payload = overrides[path];
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(payload) });
  });
}
