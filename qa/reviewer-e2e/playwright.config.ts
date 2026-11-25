import { defineConfig } from "@playwright/test";
import { env, assertSafeTarget } from "./src/env.js";

assertSafeTarget();

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  reporter: process.env.CI ? [["list"], ["html"], ["github"]] : [["list"], ["html"]],
  use: {
    baseURL: env.baseUrl,
    browserName: "chromium",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 15_000,
  },
});
