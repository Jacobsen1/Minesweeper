import { test, expect, cell, openMenu, startGameWithMines, TOP_ROWS_MINES } from "./fixtures"
import type { Page } from "@playwright/test"

async function winGame(page: Page) {
  await startGameWithMines(page, "10 x 10", TOP_ROWS_MINES)
  for (const [r, c] of TOP_ROWS_MINES) {
    await cell(page, r, c).click({ button: "right" })
  }
  const dialog = page.getByRole("dialog")
  await expect(dialog.getByRole("heading", { name: "You Win!" })).toBeVisible({ timeout: 5_000 })
  return dialog
}

test.describe("Highscores", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("lists highscores for the selected board size", async ({ page }) => {
    await openMenu(page, "HIGHSCORES")
    await page.getByRole("button", { name: "10 x 10" }).click()

    await expect(page.getByRole("heading", { name: "Highscores" })).toBeVisible()
    const rows = page.getByTestId("highscore-row")
    await expect(rows).toHaveCount(2)
    await expect(rows.nth(0)).toContainText("alice")
    await expect(rows.nth(0)).toContainText("01:23")
    await expect(rows.nth(1)).toContainText("bob")

    await page.getByRole("button", { name: "back" }).click()
    await expect(page.getByRole("heading", { name: "Minesweeper" })).toBeVisible()
  })

  test("shows an empty list when the API is unavailable", async ({ page }) => {
    await page.unroute("http://localhost:3001/highscore**")
    await page.route("http://localhost:3001/highscore**", (route) => route.abort())

    await openMenu(page, "HIGHSCORES")
    await page.getByRole("button", { name: "16 x 16" }).click()
    await expect(page.getByRole("heading", { name: "Highscores" })).toBeVisible()
    await expect(page.getByTestId("highscore-row")).toHaveCount(0)
  })

  test("rejects an empty username after winning", async ({ page, submittedHighscores }) => {
    const dialog = await winGame(page)
    await dialog.getByRole("button", { name: "SUBMIT" }).click()
    await expect(dialog.getByText("Length must be between 0 and 16")).toBeVisible()
    expect(submittedHighscores).toHaveLength(0)
  })

  test("submits a highscore after winning and starts a new game", async ({ page, submittedHighscores }) => {
    const dialog = await winGame(page)
    await dialog.getByLabel("Username").fill("tester")
    await dialog.getByRole("button", { name: "SUBMIT" }).click()

    await expect(dialog).toHaveCount(0)
    expect(submittedHighscores).toHaveLength(1)
    expect(submittedHighscores[0]).toMatchObject({ name: "tester", gametype: 3 })
    expect(submittedHighscores[0].score).toMatch(/^\d{2}:\d{2}$/)

    // A fresh game is running.
    await expect(page.getByTestId("bombs-left")).toHaveText("Bombs left: 15")
    await expect(page.locator('[data-testid^="cell-"][data-opened="true"]')).toHaveCount(0)

    // The new score shows up in the highscore list.
    await page.getByRole("button", { name: "MENU" }).click()
    await openMenu(page, "HIGHSCORES")
    await page.getByRole("button", { name: "10 x 10" }).click()
    await expect(page.getByTestId("highscore-row").filter({ hasText: "tester" })).toBeVisible()
  })
})
