import { ListItem, ListItemText } from "@mui/material"
import { Highscore } from "../api"
import { blueButtonSx, peachButtonSx } from "./styles"

const Column = ({ text, variant }: { text: string; variant: "h5" | "h6" }) => (
  <ListItemText primary={text} sx={{ textAlign: "center", width: "50%" }} slotProps={{ primary: { variant } }} />
)

export const HighscoreList = ({ highscores }: { highscores: Highscore[] }) => (
  <>
    <ListItem sx={blueButtonSx}>
      <Column text="Username" variant="h5" />
      <Column text="Score" variant="h5" />
    </ListItem>
    {highscores.map((row, i) => (
      <ListItem key={i} data-testid="highscore-row" sx={peachButtonSx}>
        <Column text={row.name} variant="h6" />
        <Column text={row.score} variant="h6" />
      </ListItem>
    ))}
  </>
)
