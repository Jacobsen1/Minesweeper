import produce from "immer"
import { GameActions, GameActionTypes, GameState } from "./GameActions"
import { Cell, findCellsToBeOpened, findNeighbors, gameOver, initBoard } from "../GameLogic"

export const initialState: GameState = {
  gameState: "running",
  bombsLeft: 0,
  minutes: 0,
  seconds: 0,
  cells: [],
  menuIsOpen: false,
  boardSize: -1,
}

export const GameReducer = (state = initialState, actions: GameActions): GameState => {
  switch (actions.type) {
    case GameActionTypes.InitGame:
      return produce(state, (draft) => {
        let cells = initBoard(actions.payload.numRows, actions.payload.numCols)
        draft.cells = cells
        draft.bombsLeft = actions.payload.numBombs
      })

    case GameActionTypes.LeftClick:
      return produce(state, (draft) => {
        let i = actions.payload.i
        let j = actions.payload.j
        if (
          (!state.cells[i][j].isOpened && !state.cells[i][j].hasFlag) ||
          state.cells[i][j].neighborMineCount === 0
        ) {
          if (state.cells[i][j].hasMine) {
            draft.cells[i][j].isOpened = true
            gameOver(draft.cells)
            draft.gameState = "game over"
            draft.menuIsOpen = true
          }
          if (state.cells[i][j].neighborMineCount > 0) {
            draft.cells[i][j].isOpened = true
          }
          // Opening more than one cell
          if (state.cells[i][j].neighborMineCount === 0) {
            draft.cells[i][j].isOpened = true
            findCellsToBeOpened(draft.cells, i, j)
          }
        } else {
          if (state.cells[i][j].isOpened) {
            let neighbors = findNeighbors(state.cells, i, j)
            let numFlags = 0
            neighbors.forEach((element) => {
              if (element.hasFlag) {
                numFlags += 1
              }
            })
            if (numFlags === state.cells[i][j].neighborMineCount) {
              neighbors.forEach((element) => {
                if (!element.hasFlag && !element.hasMine) {
                  if (element.neighborMineCount === 0) {
                    findCellsToBeOpened(draft.cells, i, j)
                  }
                  draft.cells[element.row][element.col].isOpened = true
                } else if (element.hasFlag && !element.hasMine) {
                  gameOver(draft.cells)
                  draft.gameState = "game over"
                  draft.menuIsOpen = true
                }
              })
            } else if (numFlags > state.cells[i][j].neighborMineCount) {
              gameOver(draft.cells)
              draft.gameState = "game over"
              draft.menuIsOpen = true
            }
          }
        }
      })

    case GameActionTypes.RestartGame:
      return produce(state, (draft) => {
        let cells = initBoard(actions.payload.numRows, actions.payload.numCols)
        draft.cells = cells
        draft.menuIsOpen = false
        draft.bombsLeft = actions.payload.numBombs
        draft.gameState = "running"
        draft.minutes = 0
        draft.seconds = 0
      })

    case GameActionTypes.SetIsDown:
      return produce(state, (draft) => {
        let i = actions.payload.i
        let j = actions.payload.j
        if (!state.cells[i][j].hasFlag) {
          if (!state.cells[i][j].isOpened) {
            draft.cells[i][j].isDown = actions.payload.isDown
          } else {
            let neighbors = findNeighbors(state.cells, i, j)
            neighbors.forEach((element) => {
              if (!element.hasFlag) {
                draft.cells[element.row][element.col].isDown = actions.payload.isDown
              }
            })
          }
        }
      })

    case GameActionTypes.ToggleFlag:
      return produce(state, (draft) => {
        let i = actions.payload.i
        let j = actions.payload.j
        if (state.cells[i][j].hasFlag) {
          draft.bombsLeft = draft.bombsLeft + 1
        } else {
          draft.bombsLeft = draft.bombsLeft - 1
        }
        draft.cells[i][j].hasFlag = !state.cells[i][j].hasFlag
      })

    case GameActionTypes.Tick:
      return produce(state, (draft) => {
        if (state.gameState === "running") {
          if (state.seconds === 59) {
            draft.minutes++
            draft.seconds = 0
          } else {
            draft.seconds++
          }
        }
      })

    case GameActionTypes.ToggleMenu:
      return produce(state, (draft) => {
        draft.menuIsOpen = !draft.menuIsOpen
      })

    case GameActionTypes.SetGameState:
      return produce(state, (draft) => {
        draft.gameState = actions.payload.gameState
      })

    case GameActionTypes.SetBoardSize:
      return produce(state, (draft) => {
        draft.boardSize = actions.payload.boardSize
      })

    default:
      return state
  }
}

export type RootState = GameState
export const selectGameState = (state: RootState): string => state.gameState
export const selectBombsLeft = (state: RootState): number => state.bombsLeft
export const selectMinutes = (state: RootState): number => state.minutes
export const selectSeconds = (state: RootState): number => state.seconds
export const selectCells = (state: RootState): Cell[][] => state.cells
export const selectMenuIsOpen = (state: RootState): boolean => state.menuIsOpen
export const selectBoardSize = (state: RootState): number => state.boardSize
