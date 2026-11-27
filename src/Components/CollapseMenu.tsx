import { Collapse, List, ListItemButton, ListItemText } from "@mui/material"
import { Dispatch, SetStateAction } from "react"
import { useDispatch } from "react-redux"
import { setBoardSize, setGameState } from "../Redux/GameActions"

const innerMenuButtonSx = {
  backgroundColor: "#ffc3a6",
  "&:hover": {
    backgroundColor: "#ffa67b",
  },
}

type CollapseMenuProps = {
  open: boolean
  menuType: number
  setHighscoreType: Dispatch<SetStateAction<number>>
  setShowHighscore: (open: boolean) => void
}

const boardSizes = [
  { boardSize: 1, label: "16 x 30" },
  { boardSize: 2, label: "16 x 16" },
  { boardSize: 3, label: "10 x 10" },
]

export const CollapseMenu = (props: CollapseMenuProps) => {
  const dispatch = useDispatch()
  return (
    <Collapse in={props.open} timeout="auto" unmountOnExit>
      <List component="div" disablePadding>
        {boardSizes.map(({ boardSize, label }) => (
          <ListItemButton
            key={boardSize}
            sx={innerMenuButtonSx}
            onClick={() => {
              if (props.menuType === 1) {
                dispatch(setBoardSize({ boardSize }))
                dispatch(setGameState({ gameState: "running" }))
              } else {
                props.setHighscoreType(boardSize)
                props.setShowHighscore(true)
              }
            }}
          >
            <ListItemText
              primary={label}
              sx={{ textAlign: "center" }}
              slotProps={{ primary: { variant: "h6" } }}
            />
          </ListItemButton>
        ))}
      </List>
    </Collapse>
  )
}
