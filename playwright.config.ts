import { defineConfig, devices } from "@playwright/test"

const PORT = 3000
const isCI = !!process.env.CI

/**
 * UI tests run against the production build served by `vite preview`.
 * The highscore API (http://localhost:3001) is mocked per test, see tests/fixtures.ts.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: isCI ? [["github"], ["html", { open: "never" }]] : [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    viewport: { width: 1600, height: 1000 },
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"], viewport: { width: 1600, height: 1000 } } },
    { name: "firefox", use: { ...devices["Desktop Firefox"], viewport: { width: 1600, height: 1000 } } },
  ],
  webServer: {
    command: "npm run build && npm run preview",
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !isCI,
    timeout: 180_000,
  },
})
