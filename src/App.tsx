import React from "react"
import "./App.css"
import { Grid } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import { Cell, findNeighbors, initBoard } from "./GameLogic"
import { useState } from "react"
import { Icon, InlineIcon } from "@iconify/react"
import mineIcon from "@iconify-icons/mdi/mine"
import flagIcon from "@iconify-icons/dashicons/flag"

const width = 1400
const height = 800
const cellSize = 50

export const numRows = height / cellSize
export const numCols = width / cellSize

const useStyles = makeStyles((theme) => ({
  board: {
    width: width,
    height: height,
    //border: "1px solid black",
    position: "relative",
    margin: "auto",
  },
  cell: {
    position: "absolute",
    border: "2px solid gray",
    width: cellSize + "px",
    height: cellSize + "px",
    lineHeight: cellSize + "px",
  },
}))

function App() {
  const classes = useStyles()

  const [cells, setCells] = useState<Cell[][]>(() =>
    initBoard(numRows, numCols)
  )

  const toggleFlag = (i: number, j: number) => {
    let newCells = [...cells]
    newCells[i][j].hasFlag = !newCells[i][j].hasFlag
    setCells(newCells)
  }

  const leftClick = (i: number, j: number, depth: number) => {
    let newCells = [...cells]
    if (!newCells[i][j].isOpened) {
      if (newCells[i][j].hasMine) {
        newCells[i][j].isOpened = true
        console.log("Game Over")
      }
      if (newCells[i][j].neighborMineCount > 0) {
        newCells[i][j].isOpened = true
      }
      if (newCells[i][j].neighborMineCount === 0) {
        if (depth < 100) {
          depth++
          newCells[i][j].isOpened = true
          console.log("Finding Neighbors for " + i + ", " + j)
          let neighbors = findNeighbors(newCells, i, j)
          console.log(neighbors)
          for (let i = 0; i < neighbors.length; i++) {
            if (!neighbors[i].hasFlag && !neighbors[i].isOpened) {
              leftClick(neighbors[i].row, neighbors[i].col, depth)
            }
          }
        }
      }
    }
    setCells(newCells)
  }

  //console.log(cells)
  return (
    <div className="App">
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <div className={classes.board}>
          {cells.map((row, i) => {
            return row.map((cell, j) => {
              return (
                <div
                  key={i * j + j}
                  className={classes.cell}
                  style={{
                    left: j * cellSize,
                    top: i * cellSize,
                    backgroundColor: cell.isOpened ? "darkGray" : "lightGray",
                  }}
                  //RIGHT CLICK
                  onContextMenu={(e) => {
                    e.preventDefault()
                    toggleFlag(i, j)
                  }}
                  //LEFT CLICK
                  onClick={(e) => {
                    leftClick(i, j, 0)
                  }}
                >
                  {cell.isOpened ? (
                    cell.neighborMineCount >= 0 ? (
                      <span>{cell.neighborMineCount}</span>
                    ) : (
                      <Icon icon={mineIcon} />
                    )
                  ) : cell.hasFlag ? (
                    <Icon icon={flagIcon} />
                  ) : (
                    ""
                  )}
                  </div>
              )
            })
          })}
        </div>
      </Grid>
    </div>
  )
}

export default App
