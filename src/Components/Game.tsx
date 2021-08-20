import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Cell, checkIfWin } from "../GameLogic"
import { GameState, initGame, setGameState, tick, toggleMenu } from "../Redux/GameActions"
import { RootState, selectBombsLeft, selectCells, selectGameState } from "../Redux/GameReducer"
import { Board } from "./Board"
import { PopupMenu } from "./PopupMenu"
import { TopBoard, useInterval } from "./TopBoard"

export let width = 0
export let height = 0
export let cellSize = 0
export let numRows = 0
export let numCols = 0
export let borderSize = 0
export let numOfBombs = 0

export const Game = () => {
  const dispatch = useDispatch()
  const cells = useSelector<RootState, Cell[][]>(selectCells)
  const bombsLeft = useSelector<RootState, number>(selectBombsLeft)
  const gameState = useSelector<RootState, string>(selectGameState)
  const boardSize = useSelector<GameState, number>((state: GameState) => state.boardSize)

  useEffect(() => {
    if (boardSize === 1) {
      //16 x 30
      width = 1500
      height = 800
      cellSize = 50
    } else if (boardSize === 2) {
      //16 x 16
      width = 800
      height = 800
      cellSize = 50
    } else if (boardSize === 3) {
      //10 x 10
      width = 800
      height = 800
      cellSize = 80
    }

    numRows = height / cellSize
    numCols = width / cellSize
    borderSize = Math.ceil(cellSize * 0.15)
    numOfBombs = Math.floor(0.15 * numRows * numCols)
    dispatch(initGame({ numRows: numRows, numCols: numCols, numBombs: numOfBombs }))
  }, [dispatch, boardSize])

  useInterval(() => {
    dispatch(tick())
    if (bombsLeft === 0 && gameState !== "won") {
      if (checkIfWin(cells)) {
        dispatch(setGameState({ gameState: "won" }))
        dispatch(toggleMenu())
      }
    }
  }, 1000)

  return (
    <>
      <PopupMenu />
      <TopBoard />
      <Board />
    </>
  )
}
