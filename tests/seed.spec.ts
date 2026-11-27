import { test, expect } from "./fixtures"

// Seed used by the Playwright planner/generator/healer agents: opens the app
// with the highscore API mocked and the start menu visible.
test.describe("Test group", () => {
  test("seed", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByRole("heading", { name: "Minesweeper" })).toBeVisible()
  })
})
