import { numCols, numRows } from "./App"

export type Cell = {
    col: number,
    row: number,
    isOpened: boolean,
    hasFlag: boolean,
    hasMine: boolean,
    neighborMineCount: number
}

export const initBoard = (numRows: number, numCols: number): Cell[][] => {
    console.log("Initializing Board")
    console.log("Number of Rows: " + numRows)
    console.log("Number of Columns " + numCols)
    let cellValues: number[][] = []
    for(let i = 0; i <numRows; i++){
        cellValues.push([])
        for(let j = 0; j < numCols; j++){
            cellValues[i].push(0)
        }
    }
    cellValues = addBombs(cellValues)

    let cells: Cell[][] = []
    for(let i = 0; i < numRows; i++){
        cells.push([])
        for(let j = 0; j < numCols; j++){
            cells[i].push({row: i, col: j, isOpened: false, hasFlag: false, hasMine: cellValues[i][j] < 0 ? true : false, neighborMineCount: cellValues[i][j]})
        }
    }

    return cells
}

const addBombs = (arr: number[][]): number[][] => {
    let probOfBomb = 1/10
    let numOfBombs = 0
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
    //console.log(numOfBombs)
    return arr
}


export const findNeighbors = (cellsArr: Cell[][], i: number, j: number) => {
    let neighbors = []
    for (let x = -1; x < 2; x++) {
      for (let y = -1; y < 2; y++) {
        let rx = x + i;
        let ry = y + j;

        if (rx >= 0 && ry >= 0 && rx < numCols && ry < numRows){
          if(x !== 0 || y !== 0){
              neighbors.push(cellsArr[i + x][j + y])
           }
        }
      }
    }
    return neighbors
  }