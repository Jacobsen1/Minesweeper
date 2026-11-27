import { Collapse, List, ListItemButton, ListItemText } from "@mui/material"
import { BOARD_SIZES, BoardSize } from "../GameLogic"
import { peachButtonSx } from "./styles"

type CollapseMenuProps = {
  open: boolean
  onSelect: (boardSize: BoardSize) => void
}

export const CollapseMenu = ({ open, onSelect }: CollapseMenuProps) => (
  <Collapse in={open} timeout="auto" unmountOnExit>
    <List component="div" disablePadding>
      {BOARD_SIZES.map(({ id, label }) => (
        <ListItemButton key={id} sx={peachButtonSx} onClick={() => onSelect(id)}>
          <ListItemText primary={label} sx={{ textAlign: "center" }} slotProps={{ primary: { variant: "h6" } }} />
        </ListItemButton>
      ))}
    </List>
  </Collapse>
)
