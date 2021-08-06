import { makeStyles } from "@material-ui/core"
import React, { } from "react"
import { cellSize, borderSize } from "./App"
import { Cell } from "./GameLogic"
import { Icon } from "@iconify/react"
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
  setIsDown(i: number, j: number, isDown: boolean): void
}

export const MemoizedCell = React.memo<CellProps>((props) => {
  const classes = useStyles()

  //console.log("render cell")

  return (
    <div
      key={props.cell.row * props.cell.col + props.cell.col}
      className={classes.cell}
      style={{
        backgroundColor: props.cell.isOpened || props.cell.isDown ? "darkGray" : "lightGray",
        boxShadow: props.cell.isOpened || props.cell.isDown ? "1px 1px black inset" : "",


        borderLeft: props.cell.isOpened || props.cell.isDown
          ? ""
          : borderSize + "px solid #e6e6e6",
        borderTop: props.cell.isOpened || props.cell.isDown
          ? ""
          : borderSize + "px solid #e6e6e6",
        borderRight: props.cell.isOpened || props.cell.isDown
          ? ""
          : borderSize + "px solid #808080",
        borderBottom: props.cell.isOpened || props.cell.isDown
          ? ""
          : borderSize + "px solid #808080",
        width: props.cell.isOpened || props.cell.isDown
          ? cellSize + "px"
          : cellSize - 2 * borderSize,
        height: props.cell.isOpened || props.cell.isDown
          ? cellSize + "px"
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
      onMouseDown={(e) => {
        if (e.button === 0) {
          props.setIsDown(props.cell.row, props.cell.col, true)
        }
      }}
      onMouseUp={(e) => {
        if (e.button === 0) {
          props.setIsDown(props.cell.row, props.cell.col, false)
        }
      }}
      onMouseLeave={(e) => {
        if (e.button === 0) {
          props.setIsDown(props.cell.row, props.cell.col, false)
        }
      }}
    >
      {props.cell.isOpened ? (
        props.cell.neighborMineCount >= 0 ? (
          <span>{props.cell.neighborMineCount}</span>
        ) : (
          <Icon icon={mineIcon} style={{ marginTop: "17px" }} />
        )
      ) : props.cell.hasFlag ? (
        <Icon icon={flagIcon} style={{ marginBottom: "5px" }} />
      ) : (
        ""
      )}
    </div>
  )
})
