import React from "react"
import { Icon } from "@iconify/react"
import mineIcon from "@iconify-icons/mdi/mine"
import flagIcon from "@iconify-icons/dashicons/flag"
import { Cell, NUMBER_COLORS } from "../GameLogic"
import { leftClick, setIsDown, toggleFlag } from "../Redux/gameSlice"
import { useAppDispatch, useAppStore } from "../Redux/store"

interface CellProps {
  cell: Cell
  cellSize: number
  borderSize: number
}

const CellComp = ({ cell, cellSize, borderSize }: CellProps) => {
  const dispatch = useAppDispatch()
  // Game state is only needed inside the handlers, so read it on demand instead of
  // subscribing every cell to the store.
  const store = useAppStore()
  const isRunning = () => store.getState().gameState === "running"

  const pos = { i: cell.row, j: cell.col }
  const pressed = cell.isOpened || cell.isDown
  const setDown = (isDown: boolean) => (e: React.MouseEvent) => {
    if (e.button === 0 && isRunning()) dispatch(setIsDown({ ...pos, isDown }))
  }

  return (
    <div
      data-testid={`cell-${cell.row}-${cell.col}`}
      data-opened={cell.isOpened}
      data-flagged={cell.hasFlag}
      style={{
        fontSize: "35px",
        lineHeight: cellSize + "px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...(pressed
          ? {
              backgroundColor: "darkGray",
              boxShadow: "1px 1px black inset",
              width: cellSize,
              height: cellSize,
            }
          : {
              backgroundColor: "#c7c7c7",
              borderLeft: `${borderSize}px solid #e6e6e6`,
              borderTop: `${borderSize}px solid #e6e6e6`,
              borderRight: `${borderSize}px solid #808080`,
              borderBottom: `${borderSize}px solid #808080`,
              width: cellSize - 2 * borderSize,
              height: cellSize - 2 * borderSize,
            }),
      }}
      onContextMenu={(e) => {
        e.preventDefault()
        if (isRunning()) dispatch(toggleFlag(pos))
      }}
      onClick={() => {
        if (isRunning()) dispatch(leftClick(pos))
      }}
      onMouseDown={setDown(true)}
      onMouseUp={setDown(false)}
      // Releasing only does something for pressed or opened (non-flagged) cells.
      onMouseLeave={!cell.hasFlag && pressed ? setDown(false) : undefined}
    >
      {cell.isOpened ? (
        cell.hasMine ? (
          <Icon icon={mineIcon} data-testid="mine" />
        ) : (
          cell.neighborMineCount > 0 && (
            <span style={{ color: NUMBER_COLORS[cell.neighborMineCount] }}>{cell.neighborMineCount}</span>
          )
        )
      ) : (
        cell.hasFlag && <Icon icon={flagIcon} data-testid="flag" />
      )}
    </div>
  )
}

export const MemoizedCell = React.memo(CellComp)
