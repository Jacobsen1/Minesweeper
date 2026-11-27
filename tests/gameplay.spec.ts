import { test, expect, cell, cells, startGame, winGame, TOP_ROWS_MINES } from "./fixtures"

test.describe("Gameplay", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("timer starts counting when the game is running", async ({ page }) => {
    await startGame(page, "10 x 10")
    await expect(page.getByTestId("timer")).toHaveText(/^Time: 00:0[0-1]$/)
    await expect(page.getByTestId("timer")).toHaveText("Time: 00:02", { timeout: 5_000 })
  })

  test("right click toggles a flag and updates the bomb counter", async ({ page }) => {
    await startGame(page, "10 x 10", TOP_ROWS_MINES)
    // Use a numbered cell: the game currently opens flagged cells that have no
    // neighbouring mines when they are left-clicked (pre-existing behaviour).
    const target = cell(page, 2, 5)

    await target.click({ button: "right" })
    await expect(target).toHaveAttribute("data-flagged", "true")
    await expect(target.getByTestId("flag")).toBeVisible()
    await expect(page.getByTestId("bombs-left")).toHaveText("Bombs left: 14")

    // A flagged cell cannot be opened with a left click.
    await target.click()
    await expect(target).toHaveAttribute("data-opened", "false")

    await target.click({ button: "right" })
    await expect(target).toHaveAttribute("data-flagged", "false")
    await expect(page.getByTestId("bombs-left")).toHaveText("Bombs left: 15")
  })

  test("clicking a numbered cell opens only that cell", async ({ page }) => {
    await startGame(page, "10 x 10", TOP_ROWS_MINES)
    // (2, 0) touches the mines at (1, 0) and (1, 1).
    const target = cell(page, 2, 0)
    await target.click()
    await expect(target).toHaveAttribute("data-opened", "true")
    await expect(target).toHaveText("2")
    await expect(cells(page, true)).toHaveCount(1)
  })

  test("clicking an empty cell flood-fills every safe cell", async ({ page }) => {
    await startGame(page, "10 x 10", TOP_ROWS_MINES)
    await cell(page, 9, 9).click()

    // With all mines in the top rows, the flood fill reveals all 85 safe cells.
    await expect(cells(page, true)).toHaveCount(85)
    await Promise.all(
      TOP_ROWS_MINES.map(([r, c]) => expect(cell(page, r, c)).toHaveAttribute("data-opened", "false"))
    )
    await expect(page.getByRole("dialog")).toHaveCount(0)
  })

  test("clicking a mine loses the game and reveals the board", async ({ page }) => {
    await startGame(page, "10 x 10", TOP_ROWS_MINES)
    await cell(page, 0, 0).click()

    const dialog = page.getByRole("dialog")
    await expect(dialog.getByRole("heading", { name: "You Lost" })).toBeVisible()
    await expect(cells(page, false)).toHaveCount(0)
    await expect(page.getByTestId("mine")).toHaveCount(15)

    // The board is frozen and the timer stops after losing.
    await page.keyboard.press("Escape")
    await expect(dialog).toHaveCount(0)
    const time = await page.getByTestId("timer").textContent()
    await page.waitForTimeout(1_500)
    await expect(page.getByTestId("timer")).toHaveText(time!)
  })

  test("RESTART starts a fresh game after losing", async ({ page }) => {
    await startGame(page, "10 x 10", TOP_ROWS_MINES)
    await cell(page, 0, 0).click()
    await expect(page.getByRole("dialog")).toBeVisible()
    await page.keyboard.press("Escape")

    await page.getByRole("button", { name: "RESTART" }).click()
    await expect(cells(page, true)).toHaveCount(0)
    await expect(page.getByTestId("bombs-left")).toHaveText("Bombs left: 15")
    // The timer is reset and keeps running in the new game.
    await expect(page.getByTestId("timer")).toHaveText(/^Time: 00:0[0-1]$/)
    await expect(page.getByTestId("timer")).toHaveText("Time: 00:02", { timeout: 5_000 })
  })

  test("flagging every mine wins the game", async ({ page }) => {
    await winGame(page)
  })
})
