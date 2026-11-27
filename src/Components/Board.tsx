import { Box, Stack } from "@mui/material"
import { BoardSize, getBoardGeometry } from "../GameLogic"
import { selectBoardSize, selectCells } from "../Redux/gameSlice"
import { useAppSelector } from "../Redux/store"
import { MemoizedCell } from "./Cell"

export const Board = () => {
  const cells = useAppSelector(selectCells)
  const boardSize = useAppSelector(selectBoardSize)
  const { width, height, cellSize, borderSize, numRows, numCols } = getBoardGeometry(boardSize as BoardSize)

  return (
    <Stack direction="column" sx={{ alignItems: "center" }} style={{ backgroundColor: "#c7c7c7", height: "100%" }}>
      <div>
        <Box
          data-testid="board"
          sx={{ position: "relative", margin: "auto", display: "grid" }}
          style={{
            gridTemplateColumns: `repeat(${numCols}, 1fr)`,
            gridTemplateRows: `repeat(${numRows}, 1fr)`,
            width,
            height,
          }}
        >
          {cells.flat().map((cell) => (
            <MemoizedCell
              cell={cell}
              cellSize={cellSize}
              borderSize={borderSize}
              key={`${cell.row}-${cell.col}`}
            />
          ))}
        </Box>
      </div>
    </Stack>
  )
}
