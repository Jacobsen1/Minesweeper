export type Cell = {
  col: number
  row: number
  isOpened: boolean
  hasFlag: boolean
  hasMine: boolean
  isDown: boolean
  neighborMineCount: number
}

/** Board size id, also used as the highscore `gametype`. */
export type BoardSize = 1 | 2 | 3

export const BOARD_SIZES: ReadonlyArray<{
  id: BoardSize
  label: string
  width: number
  height: number
  cellSize: number
}> = [
  { id: 1, label: "16 x 30", width: 1500, height: 800, cellSize: 50 },
  { id: 2, label: "16 x 16", width: 800, height: 800, cellSize: 50 },
  { id: 3, label: "10 x 10", width: 800, height: 800, cellSize: 80 },
]

export const MINE_DENSITY = 0.15

export const getBoardGeometry = (boardSize: BoardSize) => {
  const { width, height, cellSize } = BOARD_SIZES.find((b) => b.id === boardSize)!
  const numRows = height / cellSize
  const numCols = width / cellSize
  return {
    width,
    height,
    cellSize,
    numRows,
    numCols,
    borderSize: Math.ceil(cellSize * 0.15),
    numBombs: Math.floor(MINE_DENSITY * numRows * numCols),
  }
}

/** Text colour for each neighbour mine count (index = count). */
export const NUMBER_COLORS = ["", "blue", "green", "red", "darkblue", "brown", "cyan", "black", "gray"]

const MINE = -100

export const initBoard = (numRows: number, numCols: number, numBombs: number): Cell[][] => {
  const values = Array.from({ length: numRows }, () => Array<number>(numCols).fill(0))
  addBombs(values, numBombs)

  return values.map((rowValues, row) =>
    rowValues.map((neighborMineCount, col) => ({
      row,
      col,
      isOpened: false,
      hasFlag: false,
      hasMine: neighborMineCount < 0,
      isDown: false,
      neighborMineCount,
    }))
  )
}

/** Coordinates of the in-bounds neighbours of (i, j) on a numRows x numCols grid. */
const neighborCoords = (numRows: number, numCols: number, i: number, j: number) => {
  const coords: Array<[number, number]> = []
  for (let x = -1; x < 2; x++) {
    for (let y = -1; y < 2; y++) {
      const r = i + x
      const c = j + y
      if ((x !== 0 || y !== 0) && r >= 0 && c >= 0 && r < numRows && c < numCols) {
        coords.push([r, c])
      }
    }
  }
  return coords
}

const addBombs = (arr: number[][], numBombs: number) => {
  const numRows = arr.length
  const numCols = arr[0].length
  while (numBombs > 0) {
    // Draw row, then column; tests rely on this Math.random call order.
    const i = Math.floor(Math.random() * numRows)
    const j = Math.floor(Math.random() * numCols)
    if (arr[i][j] < 0) continue

    arr[i][j] = MINE
    for (const [r, c] of neighborCoords(numRows, numCols, i, j)) arr[r][c] += 1
    numBombs--
  }
}

export const findNeighbors = (cells: Cell[][], i: number, j: number) =>
  neighborCoords(cells.length, cells[0].length, i, j).map(([r, c]) => cells[r][c])

export const findCellsToBeOpened = (cells: Cell[][], i: number, j: number) => {
  findNeighbors(cells, i, j).forEach((e) => {
    if (!e.hasFlag && !e.isOpened) {
      cells[e.row][e.col].isOpened = true
      if (e.neighborMineCount === 0) {
        findCellsToBeOpened(cells, e.row, e.col)
      }
    }
  })
}

export const gameOver = (cells: Cell[][]) => {
  cells.flat().forEach((cell) => {
    cell.isOpened = true
  })
}

/** Won when every mine on the board is flagged. */
export const checkIfWin = (cells: Cell[][]): boolean => {
  const all = cells.flat()
  return all.filter((c) => c.hasFlag && c.hasMine).length === all.filter((c) => c.hasMine).length
}

const pad = (n: number) => String(n).padStart(2, "0")

/** Formats elapsed time as mm:ss. */
export const formatTime = (minutes: number, seconds: number) => `${pad(minutes)}:${pad(seconds)}`
