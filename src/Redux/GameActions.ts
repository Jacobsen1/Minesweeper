import { Cell } from "../GameLogic"

export enum GameActionTypes {
  InitGame = "initGame",
  LeftClick = "leftClick",
  ToggleFlag = "toggleFlag",
  SetIsDown = "setIsDown",
  RestartGame = "restartGame",
  Tick = "tick",
  ToggleMenu = "toggleMenu",
  SetGameState = "setGameState",
  SetBoardSize = "setBoardSize",
}

/* --------- TYPES ---------- */
export type GameState = {
  gameState: string
  bombsLeft: number
  minutes: number
  seconds: number
  cells: Cell[][]
  menuIsOpen: boolean
  boardSize: number
}

type CellPayload = {
  i: number
  j: number
}
type SetIsDownPayload = {
  i: number
  j: number
  isDown: boolean
}
type GamePayload = {
  numRows: number
  numCols: number
  numBombs: number
}
type GameStatePayload = {
  gameState: string
}
type InitGameType = {
  type: GameActionTypes.InitGame
  payload: GamePayload
}
type LeftClickType = {
  type: GameActionTypes.LeftClick
  payload: CellPayload
}
type ToggleFlagType = {
  type: GameActionTypes.ToggleFlag
  payload: CellPayload
}
type SetIsDownType = {
  type: GameActionTypes.SetIsDown
  payload: SetIsDownPayload
}
type RestartGameType = {
  type: GameActionTypes.RestartGame
  payload: GamePayload
}
type TickType = {
  type: GameActionTypes.Tick
}
type ToggleMenuType = {
  type: GameActionTypes.ToggleMenu
}
type SetGameStateType = {
  type: GameActionTypes.SetGameState
  payload: GameStatePayload
}
type SetBoardSize = {
  type: GameActionTypes.SetBoardSize
  payload: {boardSize: number}
}

export type GameActions =
  | InitGameType
  | LeftClickType
  | ToggleFlagType
  | SetIsDownType
  | RestartGameType
  | TickType
  | ToggleMenuType
  | SetGameStateType
  | SetBoardSize

/* -------- ACTIONS -------- */
export const initGame = (payload: GamePayload) => ({
  type: GameActionTypes.InitGame,
  payload,
})
export const leftClick = (payload: CellPayload) => ({
  type: GameActionTypes.LeftClick,
  payload,
})
export const toggleFlag = (payload: CellPayload) => ({
  type: GameActionTypes.ToggleFlag,
  payload,
})
export const setIsDown = (payload: SetIsDownPayload) => ({
  type: GameActionTypes.SetIsDown,
  payload,
})
export const restartGame = (payload: GamePayload) => ({
  type: GameActionTypes.RestartGame,
  payload,
})
export const tick = () => ({
  type: GameActionTypes.Tick,
})

export const toggleMenu = () => ({
  type: GameActionTypes.ToggleMenu,
})
export const setGameState = (payload: GameStatePayload) => ({
  type: GameActionTypes.SetGameState,
  payload,
})
export const setBoardSize = (payload: {boardSize: number}) => ({
  type: GameActionTypes.SetBoardSize,
  payload,
})
