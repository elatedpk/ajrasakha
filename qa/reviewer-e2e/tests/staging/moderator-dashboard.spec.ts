import { test, expect } from "@playwright/test";
import { installReviewerSession } from "../../src/fixtures/reviewer-session.js";

test.describe("Moderator workspace (read-only)", () => {
  test.beforeEach(async ({ page }) => {
    await installReviewerSession(page, "moderator");
    await page.goto("/home");
  });

  test("moderator lands in the authenticated workspace", async ({ page }, testInfo) => {
    await expect(page).toHaveURL(/\/home\/?(?:\?.*)?$/);
    await expect(page.getByRole("tab", { name: "All Questions" })).toBeVisible();
    await testInfo.attach("moderator-workspace", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });
  });

  test("moderator has a personal dashboard tab", async ({ page }) => {
    await expect(page.getByRole("tab", { name: "My Dashboard" })).toBeVisible();
  });

  test("personal dashboard loads assigned-question summary", async ({ page }, testInfo) => {
    await page.getByRole("tab", { name: "My Dashboard" }).click();
    await expect(page.getByRole("heading", { name: "Moderator Dashboard" })).toBeVisible();
    await expect(page.getByText("Assigned Questions", { exact: true })).toBeVisible();
    await testInfo.attach("moderator-dashboard", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });
  });

  test("personal dashboard shows completed-question summary", async ({ page }) => {
    await page.getByRole("tab", { name: "My Dashboard" }).click();
    await expect(page.getByText("Completed Questions", { exact: true })).toBeVisible();
  });

  test("personal dashboard shows pending-question summary", async ({ page }) => {
    await page.getByRole("tab", { name: "My Dashboard" }).click();
    await expect(page.getByText("Pending Questions", { exact: true })).toBeVisible();
  });

  test("personal dashboard renders the question list section", async ({ page }) => {
    await page.getByRole("tab", { name: "My Dashboard" }).click();
    await expect(page.getByRole("heading", { name: "Questions", exact: true })).toBeVisible();
  });

  test("personal dashboard provides a date filter", async ({ page }) => {
    await page.getByRole("tab", { name: "My Dashboard" }).click();
    await expect(page.locator("select").filter({ has: page.locator("option[value='both']") })).toBeVisible();
  });

  test("moderator can open the all-questions queue", async ({ page }, testInfo) => {
    await page.getByRole("tab", { name: "All Questions" }).click();
    await expect(page.getByText(/No questions found|Total Questions:/i).first()).toBeVisible();
    await testInfo.attach("moderator-question-queue", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });
  });

  test("moderator notification control has an accessible name", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Open notifications" })).toBeVisible();
  });

  test("moderator can open the notifications panel", async ({ page }) => {
    await page.getByRole("button", { name: "Open notifications" }).click();
    await expect(page.getByText(/total, .* new|No notifications/i).first()).toBeVisible();
  });

  test("moderator dashboard analytics tab is reachable", async ({ page }) => {
    await expect(page.getByRole("tab", { name: "Dashboard" })).toBeVisible();
  });

  test("moderator can open the dashboard analytics tab", async ({ page }) => {
    await page.getByRole("tab", { name: "Dashboard" }).click();
    await expect(page.getByRole("tab", { name: "Dashboard" })).toHaveAttribute("data-state", "active");
  });
});
