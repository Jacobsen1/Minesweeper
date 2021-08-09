import React, { useEffect } from "react"
import "./App.css"
import { Button, Grid } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import { Cell } from "./GameLogic"
import { MemoizedCell } from "./Components/Cell"
import { TopBoard, useInterval } from "./Components/TopBoard"
import { useDispatch, useSelector } from "react-redux"
import {
  RootState,
  selectBombsLeft,
  selectCells,
  selectMinutes,
  selectSeconds,
} from "./Redux/GameReducer"
import { initGame, tick, toggleMenu } from "./Redux/GameActions"
import { PopupMenu } from "./Components/Menu"

export const width = 500
export const height = 500
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
    marginTop: "50px",

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

  useInterval(() => {
    dispatch(tick())
  }, 1000)

  return (
    <div className="App">
      <Button onClick={() => dispatch(toggleMenu())}>Open Modal</Button>
      
      <PopupMenu/>
      <Grid container direction="row" justifyContent="center" alignItems="center">
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


 */
