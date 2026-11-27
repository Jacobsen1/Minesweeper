import { test as base, expect, type Page } from "@playwright/test"

export const API_URL = "http://localhost:3001"

export type Highscore = { name: string; score: string; gametype: number }

export const BOARD_SIZES = {
  "16 x 30": { rows: 16, cols: 30 },
  "16 x 16": { rows: 16, cols: 16 },
  "10 x 10": { rows: 10, cols: 10 },
} as const

export type BoardLabel = keyof typeof BOARD_SIZES

/** Number of mines the game places on a board (see Game.tsx). */
export const mineCount = (label: BoardLabel) => {
  const { rows, cols } = BOARD_SIZES[label]
  return Math.floor(0.15 * rows * cols)
}

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

/**
 * Expand the PLAY or HIGHSCORES sub-menu and wait for its MUI Collapse animation to
 * finish, otherwise clicks can land while the options are still moving.
 */
export async function openMenu(page: Page, name: "PLAY" | "HIGHSCORES") {
  await page.getByRole("button", { name }).click()
  await expect(page.locator(".MuiCollapse-entered")).toHaveCount(1)
}

/** Open the PLAY menu and start a game with the given board size. */
export async function startGame(page: Page, label: BoardLabel) {
  await openMenu(page, "PLAY")
  await page.getByRole("button", { name: label }).click()
  const { rows, cols } = BOARD_SIZES[label]
  await expect(page.getByTestId(/^cell-/)).toHaveCount(rows * cols)
}

/**
 * Start a game where the mines are placed at known positions.
 *
 * The game places mines by drawing `Math.random()` twice per mine (row, then column).
 * We feed it a queue of values that map to the requested cells, then fall back to the
 * real implementation once the queue is drained.
 */
export async function startGameWithMines(page: Page, label: BoardLabel, mines: Array<[number, number]>) {
  const { rows, cols } = BOARD_SIZES[label]
  if (mines.length !== mineCount(label)) {
    throw new Error(`${label} needs exactly ${mineCount(label)} mines, got ${mines.length}`)
  }
  const queue = mines.flatMap(([r, c]) => [(r + 0.5) / rows, (c + 0.5) / cols])

  await openMenu(page, "PLAY")
  await page.evaluate((values) => {
    const original = Math.random
    const pending = [...values]
    Math.random = () => (pending.length > 0 ? pending.shift()! : original())
  }, queue)
  await page.getByRole("button", { name: label }).click()
  await expect(page.getByTestId(/^cell-/)).toHaveCount(rows * cols)
}

/** 15 mines for a 10 x 10 board: the whole first row and the first half of the second row. */
export const TOP_ROWS_MINES: Array<[number, number]> = [
  ...Array.from({ length: 10 }, (_, c) => [0, c] as [number, number]),
  ...Array.from({ length: 5 }, (_, c) => [1, c] as [number, number]),
]
