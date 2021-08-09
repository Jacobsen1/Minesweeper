import { cellSize, numCols, numOfBombs, numRows } from "./App"

export type Cell = {
  col: number
  row: number
  isOpened: boolean
  hasFlag: boolean
  hasMine: boolean
  isDown: boolean
  neighborMineCount: number
}

export const initBoard = (numRows: number, numCols: number): Cell[][] => {
  console.log("Initializing Board")
  console.log("Number of Rows: " + numRows)
  console.log("Number of Columns " + numCols)
  let cellValues: number[][] = []
  for (let i = 0; i < numRows; i++) {
    cellValues.push([])
    for (let j = 0; j < numCols; j++) {
      cellValues[i].push(0)
    }
  }
  cellValues = addBombs(cellValues)

  let cells: Cell[][] = []
  for (let i = 0; i < numRows; i++) {
    cells.push([])
    for (let j = 0; j < numCols; j++) {
      cells[i].push({
        row: i,
        col: j,
        isOpened: false,
        hasFlag: false,
        hasMine: cellValues[i][j] < 0 ? true : false,
        isDown: false,
        neighborMineCount: cellValues[i][j],
      })
    }
  }

  return cells
}

const addBombs = (arr: number[][]): number[][] => {
  let numBombs = numOfBombs
  while (numBombs > 0) {
    let i = Math.floor(Math.random() * numRows)
    let j = Math.floor(Math.random() * numCols)
    if (arr[i][j] === -100) {
      continue
    } else {
      arr[i][j] = -100
    }

    if (i === 0) {
      if (j - 1 >= 0) {
        arr[i][j - 1] += 1
        arr[i + 1][j - 1] += 1
      }
      if (j + 1 < numCols) {
        arr[i][j + 1] += 1
        arr[i + 1][j + 1] += 1
      }

      arr[i + 1][j] += 1
    } else if (i === numRows - 1) {
      if (j - 1 >= 0) {
        arr[i][j - 1] += 1
        arr[i - 1][j - 1] += 1
      }
      if (j + 1 < numCols) {
        arr[i][j + 1] += 1
        arr[i - 1][j + 1] += 1
      }

      arr[i - 1][j] += 1
    } else if (j === 0 && i >= 0 && i < numRows) {
      arr[i + 1][j] += 1
      arr[i + 1][j + 1] += 1
      arr[i][j + 1] += 1
      arr[i - 1][j] += 1
      arr[i - 1][j + 1] += 1
    } else if (j === numCols - 1 && i >= 0 && i < numRows) {
      arr[i + 1][j] += 1
      arr[i + 1][j - 1] += 1
      arr[i][j - 1] += 1
      arr[i - 1][j] += 1
      arr[i - 1][j - 1] += 1
    } else {
      arr[i - 1][j - 1] += 1
      arr[i - 1][j] += 1
      arr[i - 1][j + 1] += 1
      arr[i][j - 1] += 1
      arr[i][j + 1] += 1
      arr[i + 1][j - 1] += 1
      arr[i + 1][j] += 1
      arr[i + 1][j + 1] += 1
    }
    numBombs--
  }

  return arr
}

export const findNeighbors = (cellsArr: Cell[][], i: number, j: number) => {
  let neighbors = []
  for (let x = -1; x < 2; x++) {
    for (let y = -1; y < 2; y++) {
      let rx = x + i
      let ry = y + j

      if (rx >= 0 && ry >= 0 && rx < numRows && ry < numCols) {
        if (x !== 0 || y !== 0) {
          neighbors.push(cellsArr[i + x][j + y])
        }
      }
    }
  }
  return neighbors
}

export const findCellsToBeOpened = (cells: Cell[][], i: number, j: number) => {
  let neighbors = findNeighbors(cells, i, j)
  neighbors.forEach((e) => {
    if (!e.hasFlag && !e.isOpened) {
      cells[e.row][e.col].isOpened = true
      if (e.neighborMineCount === 0) {
        findCellsToBeOpened(cells, e.row, e.col)
      }
    }
  })
}

export const gameOver = (cells: Cell[][]) => {
  cells.forEach((row) => {
    row.forEach((cell) => {
      if (cell.hasMine) {
        cell.isOpened = true
      }
    })
  })
}

/*
    for(let i = 0; i <arr.length; i++){
        for(let j = 0; j < arr[i].length; j++){
            let rndNum = Math.random()
            if(rndNum < probOfBomb){
                arr[i][j] = -100
                //console.log(i, j)

                if(i === 0){
                    if(j - 1 >= 0){
                        arr[i][j - 1] += 1
                        arr[i + 1][j - 1] += 1
                    } 
                    if(j + 1 < numCols){
                        arr[i][j + 1] += 1
                        arr[i + 1][j + 1] += 1
                    }
                    
                    arr[i + 1][j] += 1
                    
                } else if(i === numRows - 1){
                    if(j - 1 >= 0){
                        arr[i][j - 1] += 1
                        arr[i - 1][j - 1] += 1
                    } 
                    if(j + 1 < numCols){
                        arr[i][j + 1] += 1
                        arr[i - 1][j + 1] += 1
                    }
                    
                    arr[i - 1][j] += 1
                } else if(j === 0 && i >= 0 && i < numRows){
                    arr[i + 1][j] += 1
                    arr[i + 1][j + 1] += 1
                    arr[i][j + 1] += 1
                    arr[i - 1][j] += 1
                    arr[i - 1][j + 1] += 1
                
                } else if(j === numCols - 1 && i >= 0 && i < numRows){
                    arr[i + 1][j] += 1
                    arr[i + 1][j - 1] += 1
                    arr[i][j - 1] += 1
                    arr[i - 1][j] += 1
                    arr[i - 1][j - 1] += 1
                } else {
                    arr[i - 1][j - 1] += 1
                    arr[i - 1][j] += 1
                    arr[i - 1][j + 1] += 1
                    arr[i][j - 1] += 1
                    arr[i][j + 1] += 1
                    arr[i + 1][j - 1] += 1
                    arr[i + 1][j] += 1
                    arr[i + 1][j + 1] += 1
                }
                numOfBombs += 1
            }
        }
    }
    */
