import { numCols, numOfBombs, numRows } from "./Components/Game";

export type Cell = {
  col: number;
  row: number;
  isOpened: boolean;
  hasFlag: boolean;
  hasMine: boolean;
  isDown: boolean;
  neighborMineCount: number;
  textColor: string;
};

export type Highscore = {
  name: string;
  score: string;
  gametype: number;
};

export const initBoard = (numRows: number, numCols: number): Cell[][] => {
  console.log("Initializing Board");

  let cellValues: number[][] = [];
  for (let i = 0; i < numRows; i++) {
    cellValues.push([]);
    for (let j = 0; j < numCols; j++) {
      cellValues[i].push(0);
    }
  }
  cellValues = addBombs(cellValues);

  let cells: Cell[][] = [];
  for (let i = 0; i < numRows; i++) {
    cells.push([]);
    for (let j = 0; j < numCols; j++) {
      let textColor = "";
      let neighborMineCount = cellValues[i][j];
      if (neighborMineCount === 1) {
        textColor = "blue";
      } else if (neighborMineCount === 2) {
        textColor = "green";
      } else if (neighborMineCount === 3) {
        textColor = "red";
      } else if (neighborMineCount === 4) {
        textColor = "darkblue";
      } else if (neighborMineCount === 5) {
        textColor = "brown";
      } else if (neighborMineCount === 6) {
        textColor = "cyan";
      } else if (neighborMineCount === 7) {
        textColor = "black";
      } else if (neighborMineCount === 8) {
        textColor = "gray";
      }
      cells[i].push({
        row: i,
        col: j,
        isOpened: false,
        hasFlag: false,
        hasMine: cellValues[i][j] < 0 ? true : false,
        isDown: false,
        neighborMineCount: neighborMineCount,
        textColor: textColor,
      });
    }
  }

  return cells;
};

const addBombs = (arr: number[][]): number[][] => {
  let numBombs = numOfBombs;
  while (numBombs > 0) {
    let i = Math.floor(Math.random() * numRows);
    let j = Math.floor(Math.random() * numCols);
    if (arr[i][j] < 0) {
      continue;
    } else {
      arr[i][j] = -100;
    }
    if (i === 0) {
      if (j - 1 >= 0) {
        arr[i][j - 1] += 1;
        arr[i + 1][j - 1] += 1;
      }
      if (j + 1 < numCols) {
        arr[i][j + 1] += 1;
        arr[i + 1][j + 1] += 1;
      }

      arr[i + 1][j] += 1;
    } else if (i === numRows - 1) {
      if (j - 1 >= 0) {
        arr[i][j - 1] += 1;
        arr[i - 1][j - 1] += 1;
      }
      if (j + 1 < numCols) {
        arr[i][j + 1] += 1;
        arr[i - 1][j + 1] += 1;
      }

      arr[i - 1][j] += 1;
    } else if (j === 0 && i >= 0 && i < numRows) {
      arr[i + 1][j] += 1;
      arr[i + 1][j + 1] += 1;
      arr[i][j + 1] += 1;
      arr[i - 1][j] += 1;
      arr[i - 1][j + 1] += 1;
    } else if (j === numCols - 1 && i >= 0 && i < numRows) {
      arr[i + 1][j] += 1;
      arr[i + 1][j - 1] += 1;
      arr[i][j - 1] += 1;
      arr[i - 1][j] += 1;
      arr[i - 1][j - 1] += 1;
    } else {
      arr[i - 1][j - 1] += 1;
      arr[i - 1][j] += 1;
      arr[i - 1][j + 1] += 1;
      arr[i][j - 1] += 1;
      arr[i][j + 1] += 1;
      arr[i + 1][j - 1] += 1;
      arr[i + 1][j] += 1;
      arr[i + 1][j + 1] += 1;
    }
    numBombs--;
  }

  return arr;
};
export const findNeighbors = (cellsArr: Cell[][], i: number, j: number) => {
  let neighbors = [];
  for (let x = -1; x < 2; x++) {
    for (let y = -1; y < 2; y++) {
      let rx = x + i;
      let ry = y + j;

      if (rx >= 0 && ry >= 0 && rx < numRows && ry < numCols) {
        if (x !== 0 || y !== 0) {
          neighbors.push(cellsArr[i + x][j + y]);
        }
      }
    }
  }
  return neighbors;
};

export const findCellsToBeOpened = (cells: Cell[][], i: number, j: number) => {
  let neighbors = findNeighbors(cells, i, j);
  neighbors.forEach((e) => {
    if (!e.hasFlag && !e.isOpened) {
      cells[e.row][e.col].isOpened = true;
      if (e.neighborMineCount === 0) {
        findCellsToBeOpened(cells, e.row, e.col);
      }
    }
  });
};

export const gameOver = (cells: Cell[][]) => {
  cells.forEach((row) => {
    row.forEach((cell) => {
      cell.isOpened = true;
    });
  });
};

export const checkIfWin = (cells: Cell[][]): boolean => {
  let correct = 0;
  cells.forEach((row) => {
    row.forEach((cell) => {
      if (cell.hasFlag && cell.hasMine) {
        correct++;
      }
    });
  });
  if (correct === numOfBombs) {
    return true;
  }
  return false;
};
