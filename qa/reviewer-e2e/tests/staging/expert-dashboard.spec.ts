import { test, expect } from "@playwright/test";
import { installReviewerSession } from "../../src/fixtures/reviewer-session.js";

test.describe("Expert workspace (read-only)", () => {
  test.beforeEach(async ({ page }) => {
    await installReviewerSession(page, "expert");
    await page.goto("/home");
  });

  test("expert lands in the authenticated workspace", async ({ page }, testInfo) => {
    await expect(page).toHaveURL(/\/home\/?(?:\?.*)?$/);
    await expect(page.getByRole("tab", { name: "My Queue" })).toBeVisible();
    await testInfo.attach("expert-workspace", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });
  });

  test("expert sees the all-questions tab", async ({ page }) => {
    await expect(page.getByRole("tab", { name: "All Questions" })).toBeVisible();
  });

  test("expert dashboard tab is available", async ({ page }) => {
    await expect(page.getByRole("tab", { name: "Dashboard" })).toBeVisible();
  });

  test("expert can open their dashboard", async ({ page }, testInfo) => {
    await page.getByRole("tab", { name: "Dashboard" }).click();
    await expect(page.getByText("Delayed Questions", { exact: true })).toBeVisible();
    await testInfo.attach("expert-dashboard", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });
  });

  test("expert dashboard exposes incentive points", async ({ page }) => {
    await page.getByRole("tab", { name: "Dashboard" }).click();
    await expect(page.getByText("Incentive Points", { exact: true })).toBeVisible();
  });

  test("expert dashboard exposes review-level summary", async ({ page }) => {
    await page.getByRole("tab", { name: "Dashboard" }).click();
    await expect(page.getByRole("tab", { name: "Review Level" })).toBeVisible();
  });

  test("expert dashboard exposes question history", async ({ page }) => {
    await page.getByRole("tab", { name: "Dashboard" }).click();
    await expect(page.getByRole("tab", { name: "Questions" })).toBeVisible();
  });

  test("expert can open their queue", async ({ page }, testInfo) => {
    await page.getByRole("tab", { name: "My Queue" }).click();
    await expect(page.getByText(/Questions|No questions found/i).first()).toBeVisible();
    await testInfo.attach("expert-question-queue", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });
  });

  test("expert can open notifications", async ({ page }) => {
    await page.getByRole("button", { name: "Open notifications" }).click();
    await expect(page.getByText(/total, .* new|No notifications/i).first()).toBeVisible();
  });

  test("expert queue remains reachable after returning from dashboard", async ({ page }) => {
    await page.getByRole("tab", { name: "Dashboard" }).click();
    await page.getByRole("tab", { name: "My Queue" }).click();
    await expect(page.getByRole("tab", { name: "My Queue" })).toHaveAttribute("data-state", "active");
  });
});
