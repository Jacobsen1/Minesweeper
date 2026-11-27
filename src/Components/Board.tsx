import { Box, Stack } from "@mui/material"
import { useSelector } from "react-redux"
import { height, numCols, numRows, width } from "./Game"
import { Cell } from "../GameLogic"
import { RootState, selectCells } from "../Redux/GameReducer"
import { MemoizedCell } from "./Cell"

export const Board = () => {
  const cells = useSelector<RootState, Cell[][]>(selectCells)

  return (
    <Stack direction="column" sx={{ alignItems: "center" }} style={{ backgroundColor: "#c7c7c7", height: "100%" }}>
      <div>
        <Box
          data-testid="board"
          sx={{ position: "relative", margin: "auto", display: "grid" }}
          style={{
            gridTemplateColumns: "repeat(" + numCols + ", 1fr)",
            gridTemplateRows: "repeat(" + numRows + ", 1fr)",
            width: width,
            height: height,
          }}
        >
          {cells.map((row) => {
            return row.map((cell) => {
              return <MemoizedCell cell={cell} key={`${cell.row}-${cell.col}`} />
            })
          })}
        </Box>
      </div>
    </Stack>
  )
}
