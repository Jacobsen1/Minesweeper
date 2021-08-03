import { makeStyles } from "@material-ui/core"
import React from "react"
import { width, height, cellSize, numCols, numRows, borderSize } from "./App"
import { Cell } from "./GameLogic"
import { Icon, InlineIcon } from "@iconify/react"
import mineIcon from "@iconify-icons/mdi/mine"
import flagIcon from "@iconify-icons/dashicons/flag"

const useStyles = makeStyles((theme) => ({
  cell: {
    //position: "absolute",
    //border: "2px solid gray",

    lineHeight: cellSize + "px",
  },
}))

interface CellProps {
  cell: Cell
  toggleFlag(i: number, j: number): void
  leftClick(i: number, j: number, depth: number): void
}

export const MemoizedCell = React.memo<CellProps>((props) => {
  const classes = useStyles()

  //console.log("render cell")

  return (
    <div
      key={props.cell.row * props.cell.col + props.cell.col}
      className={classes.cell}
      style={{
        backgroundColor: props.cell.isOpened ? "darkGray" : "lightGray",
        borderLeft: props.cell.isOpened
          ? "1px solid black"
          : borderSize + "px solid white",
        borderTop: props.cell.isOpened
          ? "1px solid black"
          : borderSize + "px solid white",
        borderRight: props.cell.isOpened
          ? "1px solid black"
          : borderSize + "px solid #808080",
        borderBottom: props.cell.isOpened
          ? "1px solid black"
          : borderSize + "px solid #808080",
        width: props.cell.isOpened
          ? cellSize - 2 + "px"
          : cellSize - 2 * borderSize,
        height: props.cell.isOpened
          ? cellSize - 2 + "px"
          : cellSize - 2 * borderSize,
      }}
      //RIGHT CLICK
      onContextMenu={(e) => {
        e.preventDefault()
        props.toggleFlag(props.cell.row, props.cell.col)
      }}
      //LEFT CLICK
      onClick={(e) => {
        props.leftClick(props.cell.row, props.cell.col, 0)
      }}
    >
      {props.cell.isOpened ? (
        props.cell.neighborMineCount >= 0 ? (
          <span>{props.cell.neighborMineCount}</span>
        ) : (
          <Icon icon={mineIcon} />
        )
      ) : props.cell.hasFlag ? (
        <Icon icon={flagIcon} />
      ) : (
        ""
      )}
    </div>
  )
})
