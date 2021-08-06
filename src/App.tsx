import React from "react"
import "./App.css"
import { Button, Card, CardContent, Grid, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import { Cell, findNeighbors, initBoard, numOfBombs } from "./GameLogic"
import { useState } from "react"
import { MemoizedCell } from "./Cell"
import Modal from 'react-modal';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import { TopBoard, useInterval } from "./TopBoard"
Modal.setAppElement('#root');

export const width = 500
export const height = 500
export const cellSize = 50
export const numRows = height / cellSize
export const numCols = width / cellSize
export const borderSize = Math.ceil(cellSize * 0.15)

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

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: "20vw",
    height: "40vh",
    padding: "0px",
    borderRadius: "20px"

  },

};

function App() {

  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  const restartGame = () => {
    setCells(initBoard(numRows, numCols))
    setGameState("running")
    closeModal()
    setBombsLeft(numOfBombs)
    setMinutes(0)
    setSeconds(0)
  }

  const toggleFlag = (i: number, j: number) => {
    if (gameState === "running") {
      let newCells = [...cells]
      if (newCells[i][j].hasFlag) {
        setBombsLeft(bombsLeft => bombsLeft + 1)
      } else {
        setBombsLeft(bombsLeft => bombsLeft - 1)
      }
      newCells[i][j].hasFlag = !newCells[i][j].hasFlag
      setCells(newCells)

    }

  }

  const leftClick = (i: number, j: number, depth: number) => {
    if (gameState === "running") {

      let newCells = [...cells]
      if ((!newCells[i][j].isOpened && !newCells[i][j].hasFlag) || newCells[i][j].neighborMineCount === 0) {
        if (newCells[i][j].hasMine) {
          newCells[i][j].isOpened = true
          setGameState("game over")
          openModal()
        }
        if (newCells[i][j].neighborMineCount > 0) {
          newCells[i][j].isOpened = true
        }
        if (newCells[i][j].neighborMineCount === 0) {
          if (depth < 100) {
            depth++
            newCells[i][j].isOpened = true
            //console.log("Finding Neighbors for " + i + ", " + j)
            let neighbors = findNeighbors(newCells, i, j)
            //console.log(neighbors)
            for (let i = 0; i < neighbors.length; i++) {
              if (!neighbors[i].hasFlag && !neighbors[i].isOpened) {
                leftClick(neighbors[i].row, neighbors[i].col, depth)
              }
            }
          }
        }
      } else {
        openNeighbors(i, j)
      }
      setCells(newCells)
    }
  }

  const setIsDown = (i: number, j: number, isDown: boolean) => {
    if (gameState === "running") {

      let newCells = [...cells]
      if (!newCells[i][j].hasFlag) {
        if (!newCells[i][j].isOpened) {
          newCells[i][j].isDown = isDown
        } else {
          let neighbors = findNeighbors(newCells, i, j)
          neighbors.forEach(element => {
            if (!element.hasFlag) {
              element.isDown = isDown
            }
          });
        }
        setCells(newCells)
      }
    }
  }

  const openNeighbors = (i: number, j: number) => {
    if (gameState === "running") {

      let newCells = [...cells]
      if (newCells[i][j].isOpened) {
        let neighbors = findNeighbors(newCells, i, j)
        let numFlags = 0
        neighbors.forEach(element => {
          if (element.hasFlag) {
            numFlags += 1
          }
        });
        if (numFlags === newCells[i][j].neighborMineCount) {
          neighbors.forEach(element => {
            if (!element.hasFlag && !element.hasMine) {
              if (element.neighborMineCount === 0) {
                leftClick(element.row, element.col, 0)
              }
              element.isOpened = true
            } else if (element.hasFlag && !element.hasMine) {
              setGameState("game over")
              openModal()
            }
          });
        } else if (numFlags > newCells[i][j].neighborMineCount) {
          setGameState("game over")
          openModal()
        }
      }
      setCells(newCells)
    }
  }

  const [cells, setCells] = useState<Cell[][]>(() =>
    initBoard(numRows, numCols)
  )
  const [gameState, setGameState] = useState("running")
  const [modalIsOpen, setIsOpen] = useState(false);
  const [bombsLeft, setBombsLeft] = useState(numOfBombs)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  //console.log(cells)
  const classes = useStyles()

  useInterval(() => {
    if (seconds === 59) {
      setMinutes(minutes => minutes + 1)
      setSeconds(0)
    } else {
      setSeconds(seconds => seconds + 1);
    }

  }, 1000)

  return (
    <div className="App">
      <Button onClick={openModal}>Open Modal</Button>
      <Modal
        isOpen={modalIsOpen}
        style={customStyles}
        onRequestClose={closeModal}
      >
        <Card style={{ width: "100%", height: "100%", textAlign: "center" }}>
          <CardContent>
            <Typography variant="h2">You Lost</Typography>
          </CardContent>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <SentimentVeryDissatisfiedIcon style={{ width: "60%", height: "100%" }} />

            <Button variant="contained" color="primary" style={{ width: "90%" }} onClick={() => {
              restartGame()
            }}>Restart</Button>

          </Grid>
        </Card>
      </Modal>

      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <TopBoard restartGame={restartGame} bombsLeft={bombsLeft} minutes={minutes} seconds={seconds} />
      </Grid>
      <Grid container direction="column"
        justifyContent="center"
        alignItems="center">
        <Grid item>
          <div className={classes.board}>
            {cells.map((row, i) => {
              return row.map((cell, j) => {
                return (
                  <MemoizedCell
                    cell={cell}
                    toggleFlag={toggleFlag}
                    leftClick={leftClick}
                    setIsDown={setIsDown}
                    key={i * j + j}
                  />

                )
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
 - LAGE 99 BOMBER
 - VISE ALLE BOMBER NÅR MAN TAPER
 - BARE RENDRE AKTUELLER CELLER


 */
