import { Cell } from "../GameLogic";

export enum GameActionTypes {
    InitGame = "initGame",
    LeftClick = "leftClick",
    ToggleFlag = "toggleFlag",
    SetIsDown = "setIsDown",
    RestartGame = "restartGame",
    Tick = "tick",
    ToggleMenu = "toggleMenu"
}

/* --------- TYPES ---------- */
export type GameState = {
    gameState: string,
    bombsLeft: number,
    minutes: number,
    seconds: number,
    cells: Cell[][],
    menuIsOpen: boolean,
}

type CellPayload = {
    i: number,
    j: number,
}
type SetIsDownPayload = {
    i: number,
    j: number,
    isDown: boolean,
}
type GamePayload = {
    numRows: number,
    numCols: number,
    numBombs: number
}
type InitGameType = {
    type: GameActionTypes.InitGame,
    payload: GamePayload
}
type LeftClickType = {
    type: GameActionTypes.LeftClick,
    payload: CellPayload
}
type ToggleFlagType = {
    type: GameActionTypes.ToggleFlag,
    payload: CellPayload
}
type SetIsDownType = {
    type: GameActionTypes.SetIsDown,
    payload: SetIsDownPayload
}
type RestartGameType = {
    type: GameActionTypes.RestartGame,
    payload: GamePayload
}
type Tick = {
    type: GameActionTypes.Tick
}
type ToggleMenu = {
    type: GameActionTypes.ToggleMenu
}

export type GameActions =
InitGameType |
LeftClickType |
ToggleFlagType |
SetIsDownType |
RestartGameType |
Tick |
ToggleMenu

/* -------- ACTIONS -------- */
export const initGame = (payload: GamePayload) => ({
    type: GameActionTypes.InitGame,
    payload
  })
export const leftClick = (payload: CellPayload) => ({
    type: GameActionTypes.LeftClick,
    payload
})
export const toggleFlag = (payload: CellPayload) => ({
    type: GameActionTypes.ToggleFlag,
    payload
})
export const setIsDown = (payload: SetIsDownPayload) => ({
    type: GameActionTypes.SetIsDown,
    payload
})
export const restartGame = (payload: GamePayload) => ({
    type: GameActionTypes.RestartGame,
    payload
})
export const tick = () => ({
  type: GameActionTypes.Tick  
})

export const toggleMenu = () => ({
    type: GameActionTypes.ToggleMenu
})

