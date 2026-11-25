import "dotenv/config";

const stagingUrl = "https://ajrasakha-staging-594.web.app";

export const env = {
  baseUrl: process.env.E2E_BASE_URL?.trim() || stagingUrl,
};

export function assertSafeTarget(): void {
  const target = new URL(env.baseUrl);
  const isStaging = target.hostname === new URL(stagingUrl).hostname;
  const isLocal = ["localhost", "127.0.0.1"].includes(target.hostname);

  if (!isStaging && !isLocal) {
    throw new Error(
      `Refusing to run reviewer E2E tests against ${target.hostname}; only staging or localhost is allowed.`,
    );
  }
}
