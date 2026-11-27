import { ListItem, ListItemText } from "@mui/material"
import { Highscore } from "../GameLogic"

const menuTextSx = {
  textAlign: "center",
  width: "50%",
}

export const HighscoreList = (props: { highscores: Highscore[] }) => {
  return (
    <>
      <ListItem
        sx={{
          backgroundColor: "#2c8fb5",
          "&:hover": {
            backgroundColor: "#2780a2",
          },
        }}
      >
        <ListItemText primary="Username" sx={menuTextSx} slotProps={{ primary: { variant: "h5" } }} />
        <ListItemText primary="Score" sx={menuTextSx} slotProps={{ primary: { variant: "h5" } }} />
      </ListItem>
      {props.highscores.map((row, i) => (
        <ListItem
          key={i}
          data-testid="highscore-row"
          sx={{
            backgroundColor: "#ffc3a6",
            "&:hover": {
              backgroundColor: "#ffa67b",
            },
          }}
        >
          <ListItemText primary={row.name} sx={menuTextSx} slotProps={{ primary: { variant: "h6" } }} />
          <ListItemText primary={row.score} sx={menuTextSx} slotProps={{ primary: { variant: "h6" } }} />
        </ListItem>
      ))}
    </>
  )
}
