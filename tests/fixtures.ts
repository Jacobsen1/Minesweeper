import { test as base, expect, type Page } from "@playwright/test"
import type { Highscore } from "../src/api"
import { BOARD_SIZES, getBoardGeometry } from "../src/GameLogic"

export const API_URL = "http://localhost:3001"

export type BoardLabel = "16 x 30" | "16 x 16" | "10 x 10"

/** Rows, columns and mine count for a board, taken from the app's own board table. */
export const boardGeometry = (label: BoardLabel) => getBoardGeometry(BOARD_SIZES.find((b) => b.label === label)!.id)

type Fixtures = {
  /** In-memory store backing the mocked highscore API. */
  highscores: Highscore[]
  /** Request bodies POSTed to /new_highscore. */
  submittedHighscores: Highscore[]
}

export const test = base.extend<Fixtures>({
  highscores: async ({}, use) => {
    await use([
      { name: "alice", score: "01:23", gametype: 3 },
      { name: "bob", score: "02:05", gametype: 3 },
      { name: "carol", score: "10:00", gametype: 1 },
    ])
  },
  submittedHighscores: async ({}, use) => {
    await use([])
  },
  page: async ({ page, highscores, submittedHighscores }, use) => {
    // The real API needs MySQL; mock it so the UI tests are self-contained.
    await page.route(`${API_URL}/highscore**`, async (route) => {
      const gametype = Number(new URL(route.request().url()).searchParams.get("gametype"))
      await route.fulfill({ json: highscores.filter((h) => h.gametype === gametype) })
    })
    await page.route(`${API_URL}/new_highscore`, async (route) => {
      const body = route.request().postDataJSON() as Highscore
      submittedHighscores.push(body)
      highscores.push(body)
      await route.fulfill({ json: { affectedRows: 1 } })
    })
    await use(page)
  },
})

export { expect }

export const cell = (page: Page, row: number, col: number) => page.getByTestId(`cell-${row}-${col}`)

/** All board cells, optionally filtered on whether they are opened. */
export const cells = (page: Page, opened?: boolean) =>
  opened === undefined
    ? page.getByTestId(/^cell-/)
    : page.locator(`[data-testid^="cell-"][data-opened="${opened}"]`)

/**
 * Expand the PLAY or HIGHSCORES sub-menu and wait for its MUI Collapse animation to
 * finish, otherwise clicks can land while the options are still moving.
 */
export async function openMenu(page: Page, name: "PLAY" | "HIGHSCORES") {
  await page.getByRole("button", { name }).click()
  await expect(page.locator(".MuiCollapse-entered")).toHaveCount(1)
}

/**
 * Start a game with the given board size. When `mines` is given, the mines are placed
 * at those positions: the game draws `Math.random()` twice per mine (row, then column),
 * so we feed it a matching queue and fall back to the real implementation afterwards.
 */
export async function startGame(page: Page, label: BoardLabel, mines?: Array<[number, number]>) {
  const { numRows, numCols, numBombs } = boardGeometry(label)
  await openMenu(page, "PLAY")
  if (mines) {
    if (mines.length !== numBombs) {
      throw new Error(`${label} needs exactly ${numBombs} mines, got ${mines.length}`)
    }
    const queue = mines.flatMap(([r, c]) => [(r + 0.5) / numRows, (c + 0.5) / numCols])
    await page.evaluate((values) => {
      const original = Math.random
      const pending = [...values]
      Math.random = () => (pending.length > 0 ? pending.shift()! : original())
    }, queue)
  }
  await page.getByRole("button", { name: label }).click()
  await expect(cells(page)).toHaveCount(numRows * numCols)
}

/** 15 mines for a 10 x 10 board: the whole first row and the first half of the second row. */
export const TOP_ROWS_MINES: Array<[number, number]> = [
  ...Array.from({ length: 10 }, (_, c) => [0, c] as [number, number]),
  ...Array.from({ length: 5 }, (_, c) => [1, c] as [number, number]),
]

/** Start a 10 x 10 game with TOP_ROWS_MINES, flag every mine and return the win dialog. */
export async function winGame(page: Page) {
  await startGame(page, "10 x 10", TOP_ROWS_MINES)
  for (const [r, c] of TOP_ROWS_MINES) {
    await cell(page, r, c).click({ button: "right" })
  }
  await expect(page.getByTestId("bombs-left")).toHaveText("Bombs left: 0")
  const dialog = page.getByRole("dialog")
  await expect(dialog.getByRole("heading", { name: "You Win!" })).toBeVisible({ timeout: 5_000 })
  return dialog
}
