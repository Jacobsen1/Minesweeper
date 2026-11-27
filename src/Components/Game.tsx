import { useEffect, useRef } from "react"
import { checkIfWin } from "../GameLogic"
import { initGame, selectBoardSize, setGameState, tick, toggleMenu } from "../Redux/gameSlice"
import { useAppDispatch, useAppSelector, useAppStore } from "../Redux/store"
import { Board } from "./Board"
import { PopupMenu } from "./PopupMenu"
import { TopBoard } from "./TopBoard"

function useInterval(callback: () => void, delay: number) {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    const id = setInterval(() => savedCallback.current(), delay)
    return () => clearInterval(id)
  }, [delay])
}

export const Game = () => {
  const dispatch = useAppDispatch()
  const store = useAppStore()
  const boardSize = useAppSelector(selectBoardSize)

  useEffect(() => {
    dispatch(initGame())
  }, [dispatch, boardSize])

  // Reads the store directly so the whole game screen doesn't re-render on every cell change.
  useInterval(() => {
    dispatch(tick())
    const { bombsLeft, gameState, cells } = store.getState()
    if (bombsLeft === 0 && gameState !== "won" && checkIfWin(cells)) {
      dispatch(setGameState("won"))
      dispatch(toggleMenu())
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
