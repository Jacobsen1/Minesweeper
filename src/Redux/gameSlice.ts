import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import {
  BoardSize,
  Cell,
  findCellsToBeOpened,
  findNeighbors,
  gameOver,
  getBoardGeometry,
  initBoard,
} from "../GameLogic"

/**
 * - startup   - in the start menu
 * - running   - a game is being played
 * - won       - every mine has been flagged
 * - game over - a mine was opened
 */
export type GamePhase = "startup" | "running" | "won" | "game over"

export type GameState = {
  gameState: GamePhase
  bombsLeft: number
  elapsedSeconds: number
  cells: Cell[][]
  menuIsOpen: boolean
  boardSize: BoardSize | -1
}

type CellPosition = { i: number; j: number }

const initialState: GameState = {
  gameState: "startup",
  bombsLeft: 0,
  elapsedSeconds: 0,
  cells: [],
  menuIsOpen: false,
  boardSize: -1,
}

const newBoard = (state: GameState) => {
  const { numRows, numCols, numBombs } = getBoardGeometry(state.boardSize as BoardSize)
  state.cells = initBoard(numRows, numCols, numBombs)
  state.bombsLeft = numBombs
}

const loseGame = (state: GameState) => {
  gameOver(state.cells)
  state.gameState = "game over"
  state.menuIsOpen = true
}

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    initGame(state) {
      newBoard(state)
    },

    restartGame(state) {
      newBoard(state)
      state.menuIsOpen = false
      state.gameState = "running"
      state.elapsedSeconds = 0
    },

    leftClick(state, { payload: { i, j } }: PayloadAction<CellPosition>) {
      const cell = state.cells[i][j]
      if ((!cell.isOpened && !cell.hasFlag) || cell.neighborMineCount === 0) {
        cell.isOpened = true
        if (cell.hasMine) {
          loseGame(state)
        } else if (cell.neighborMineCount === 0) {
          findCellsToBeOpened(state.cells, i, j)
        }
      } else if (cell.isOpened) {
        // Chord: open the neighbours once the right number of flags is placed.
        const neighbors = findNeighbors(state.cells, i, j)
        const numFlags = neighbors.filter((n) => n.hasFlag).length
        if (numFlags === cell.neighborMineCount) {
          neighbors.forEach((n) => {
            if (!n.hasFlag && !n.hasMine) {
              if (n.neighborMineCount === 0) {
                findCellsToBeOpened(state.cells, i, j)
              }
              n.isOpened = true
            } else if (n.hasFlag && !n.hasMine) {
              loseGame(state)
            }
          })
        } else if (numFlags > cell.neighborMineCount) {
          loseGame(state)
        }
      }
    },

    setIsDown(state, { payload: { i, j, isDown } }: PayloadAction<CellPosition & { isDown: boolean }>) {
      const cell = state.cells[i][j]
      if (cell.hasFlag) return
      if (!cell.isOpened) {
        cell.isDown = isDown
      } else {
        findNeighbors(state.cells, i, j).forEach((n) => {
          if (!n.hasFlag) n.isDown = isDown
        })
      }
    },

    toggleFlag(state, { payload: { i, j } }: PayloadAction<CellPosition>) {
      const cell = state.cells[i][j]
      if (!cell.isOpened && !cell.isDown) {
        state.bombsLeft += cell.hasFlag ? 1 : -1
        cell.hasFlag = !cell.hasFlag
      }
    },

    tick(state) {
      if (state.gameState === "running") state.elapsedSeconds++
    },

    toggleMenu(state) {
      state.menuIsOpen = !state.menuIsOpen
    },

    setGameState(state, action: PayloadAction<GamePhase>) {
      state.gameState = action.payload
    },

    setBoardSize(state, action: PayloadAction<BoardSize>) {
      state.boardSize = action.payload
    },
  },
})

export const { initGame, restartGame, leftClick, setIsDown, toggleFlag, tick, toggleMenu, setGameState, setBoardSize } =
  gameSlice.actions

export const gameReducer = gameSlice.reducer

export const selectGameState = (state: GameState) => state.gameState
export const selectBombsLeft = (state: GameState) => state.bombsLeft
export const selectMinutes = (state: GameState) => Math.floor(state.elapsedSeconds / 60)
export const selectSeconds = (state: GameState) => state.elapsedSeconds % 60
export const selectCells = (state: GameState) => state.cells
export const selectMenuIsOpen = (state: GameState) => state.menuIsOpen
export const selectBoardSize = (state: GameState) => state.boardSize
