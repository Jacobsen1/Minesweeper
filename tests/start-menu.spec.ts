import { test, expect, openMenu, startGame, BOARD_SIZES, mineCount, type BoardLabel } from "./fixtures"

test.describe("Start menu", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("shows the title and main menu", async ({ page }) => {
    await expect(page).toHaveTitle("Minesweeper")
    await expect(page.getByRole("heading", { name: "Minesweeper" })).toBeVisible()
    await expect(page.getByRole("button", { name: "PLAY" })).toBeVisible()
    await expect(page.getByRole("button", { name: "HIGHSCORES" })).toBeVisible()
  })

  test("PLAY toggles the board size options", async ({ page }) => {
    await openMenu(page, "PLAY")
    for (const label of Object.keys(BOARD_SIZES)) {
      await expect(page.getByRole("button", { name: label })).toBeVisible()
    }
    await page.getByRole("button", { name: "PLAY" }).click()
    await expect(page.getByRole("button", { name: "10 x 10" })).toBeHidden()
  })

  for (const label of Object.keys(BOARD_SIZES) as BoardLabel[]) {
    test(`starts a ${label} game`, async ({ page }) => {
      await startGame(page, label)
      await expect(page.getByTestId("bombs-left")).toHaveText(`Bombs left: ${mineCount(label)}`)
      await expect(page.getByTestId("timer")).toHaveText(/^Time: 00:0[0-1]$/)
      await expect(page.getByRole("button", { name: "RESTART" })).toBeVisible()
      await expect(page.getByRole("button", { name: "MENU" })).toBeVisible()
    })
  }

  test("MENU returns to the start menu", async ({ page }) => {
    await startGame(page, "10 x 10")
    await page.getByRole("button", { name: "MENU" }).click()
    await expect(page.getByRole("heading", { name: "Minesweeper" })).toBeVisible()
    await expect(page.getByTestId("board")).toHaveCount(0)
  })
})
