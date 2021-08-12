import { Grid } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"
import React from "react"
import { useSelector } from "react-redux"
import { height, numCols, numRows, width } from "./Game"
import { Cell } from "../GameLogic"
import { RootState, selectCells } from "../Redux/GameReducer"
import { MemoizedCell } from "./Cell"

const useStyles = makeStyles((theme) => ({
  board: {
    position: "relative",
    margin: "auto",

    display: "grid",
  },
}))

export const Board = () => {
  const classes = useStyles()
  const cells = useSelector<RootState, Cell[][]>(selectCells)

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      style={{ backgroundColor: "#c7c7c7", height: "100%" }}
    >
      <Grid item>
        <div
          className={classes.board}
          style={{
            gridTemplateColumns: "repeat(" + numCols + ", 1fr)",
            gridTemplateRows: "repeat(" + numRows + ", 1fr)",
            width: width,
            height: height,
          }}
        >
          {cells.map((row, i) => {
            return row.map((cell, j) => {
              return <MemoizedCell cell={cell} key={i * j + j} />
            })
          })}
        </div>
      </Grid>
    </Grid>
  )
}
