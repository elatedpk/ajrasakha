import { defineConfig, devices } from "@playwright/test";
import { env, assertSafeTarget } from "./src/env.js";

assertSafeTarget();

export default defineConfig({
  testDir: "./tests/smoke",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html"]] : [["list"]],
  use: {
    ...devices["Desktop Chrome"],
    baseURL: env.baseUrl,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
});
