import React, { useEffect } from "react"
import "./App.css"
import { Grid } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import { Cell } from "./GameLogic"
import { MemoizedCell } from "./Components/Cell"
import { TopBoard, useInterval } from "./Components/TopBoard"
import { useDispatch, useSelector } from "react-redux"
import {
  RootState,
  selectBombsLeft,
  selectCells,
  selectGameState,
  selectMinutes,
  selectSeconds,
} from "./Redux/GameReducer"
import { initGame, setGameState, tick } from "./Redux/GameActions"
import { PopupMenu } from "./Components/Menu"

export const width = 1400
export const height = 800
export const cellSize = 50
export const numRows = height / cellSize
export const numCols = width / cellSize
export const borderSize = Math.ceil(cellSize * 0.15)
export const numOfBombs = Math.floor(0.15 * numRows * numCols)

const useStyles = makeStyles((theme) => ({
  board: {
    width: width,
    height: height,
    position: "relative",
    margin: "auto",

    display: "grid",
    gridTemplateColumns: "repeat(" + numCols + ", 1fr)",
    gridTemplateRows: "repeat(" + numRows + ", 1fr)",
  },
}))

function App() {
  const dispatch = useDispatch()
  const cells = useSelector<RootState, Cell[][]>(selectCells)
  const bombsLeft = useSelector<RootState, number>(selectBombsLeft)
  const minutes = useSelector<RootState, number>(selectMinutes)
  const seconds = useSelector<RootState, number>(selectSeconds)
  const classes = useStyles()

  useEffect(() => {
    dispatch(initGame({ numRows: numRows, numCols: numCols, numBombs: numOfBombs }))
    console.log("Board initialized")
  }, [dispatch])

  const gameState = useSelector<RootState, string>(selectGameState)

  useInterval(() => {
    dispatch(tick())
    if (bombsLeft === 0 && gameState !== "won") {
      let correct = 0
      cells.forEach((row) => {
        row.forEach((cell) => {
          if (cell.hasFlag && cell.hasMine) {
            correct++
          }
        })
      })
      if (correct === numOfBombs) {
        dispatch(setGameState({ gameState: "won" }))

        alert("YOU WON!")
      }
    }
  }, 1000)

  return (
    <div className="App">
      <PopupMenu />
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        style={{ backgroundColor: "darkgray", padding: "20px 0 20px 0" }}
      >
        <TopBoard bombsLeft={bombsLeft} minutes={minutes} seconds={seconds} />
      </Grid>
      <Grid container direction="column" justifyContent="center" alignItems="center">
        <Grid item>
          <div className={classes.board}>
            {cells.map((row, i) => {
              return row.map((cell, j) => {
                return <MemoizedCell cell={cell} key={i * j + j} />
              })
            })}
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default App

//TODO
/*
- ADD MENU
- BETTER WIN SCREEN
- SCOREBOARD WITH DATABASE?????????????????????????????????????

 */
