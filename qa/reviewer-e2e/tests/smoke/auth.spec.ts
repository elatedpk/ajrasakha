import { test, expect } from "@playwright/test";

test.describe("Reviewer portal unauthenticated experience", () => {
  test("root route sends an anonymous visitor to sign in", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByLabel("Email Address")).toBeVisible();
    await expect(page).toHaveURL(/\/auth\/?$/);
  });

  test("direct home navigation is protected", async ({ page }) => {
    await page.goto("/home");
    await expect(page.getByLabel("Email Address")).toBeVisible();
    await expect(page).toHaveURL(/\/auth\/?$/);
  });

  test("direct expert portal navigation is protected", async ({ page }) => {
    await page.goto("/pae-expert");
    await expect(page.getByLabel("Email Address")).toBeVisible();
    await expect(page).toHaveURL(/\/auth\/?$/);
  });

  test("sign in exposes labeled controls and includes desktop visual evidence", async ({ page }, testInfo) => {
    await page.goto("/auth");
    await expect(page.getByLabel("Email Address")).toBeVisible();
    await expect(page.getByLabel("Password", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
    await testInfo.attach("reviewer-sign-in-desktop", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });
  });

  test("password visibility control has an accessible name", async ({ page }) => {
    await page.goto("/auth");
    const password = page.getByLabel("Password", { exact: true });
    await password.fill("example-password");
    await page.getByRole("button", { name: "Show password" }).click();
    await expect(password).toHaveAttribute("type", "text");
    await expect(page.getByRole("button", { name: "Hide password" })).toBeVisible();
  });

  test("showing password keeps the entered value", async ({ page }) => {
    await page.goto("/auth");
    const password = page.getByLabel("Password", { exact: true });
    await password.fill("example-password");
    await page.getByRole("button", { name: "Show password" }).click();
    await expect(password).toHaveValue("example-password");
  });

  test("hiding password restores password input type", async ({ page }) => {
    await page.goto("/auth");
    const password = page.getByLabel("Password", { exact: true });
    await password.fill("example-password");
    await page.getByRole("button", { name: "Show password" }).click();
    await page.getByRole("button", { name: "Hide password" }).click();
    await expect(password).toHaveAttribute("type", "password");
  });

  test("password visibility does not submit the form", async ({ page }) => {
    await page.goto("/auth");
    const password = page.getByLabel("Password", { exact: true });
    await password.fill("example-password");
    await page.getByRole("button", { name: "Show password" }).click();
    await expect(page).toHaveURL(/\/auth\/?$/);
    await expect(page.getByLabel("Email Address")).toBeVisible();
  });

  test("empty sign in reports both required fields", async ({ page }) => {
    await page.goto("/auth");
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page.getByText("Email is required")).toBeVisible();
    await expect(page.getByText("Password is required")).toBeVisible();
  });

  test("sign-in controls remain visible on a narrow phone viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/auth");
    await expect(page.getByLabel("Email Address")).toBeVisible();
    await expect(page.getByLabel("Password", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
  });
});
