import { Grid, List, ListItemButton, ListItemText, Typography } from "@mui/material"
import { formatTime } from "../GameLogic"
import { restartGame, selectBombsLeft, selectMinutes, selectSeconds, setGameState } from "../Redux/gameSlice"
import { useAppDispatch, useAppSelector } from "../Redux/store"
import { greyButtonSx } from "./styles"

const topButtonSx = {
  ...greyButtonSx,
  margin: "4px",
  textAlign: "center",
  width: "130px",
  flexGrow: 0,
}

export const TopBoard = () => {
  const dispatch = useAppDispatch()
  const bombsLeft = useAppSelector(selectBombsLeft)
  const minutes = useAppSelector(selectMinutes)
  const seconds = useAppSelector(selectSeconds)

  return (
    <Grid
      container
      direction="row"
      sx={{ justifyContent: "center", alignItems: "center" }}
      style={{ backgroundColor: "#2c8fb5", padding: "20px 0 20px 0" }}
    >
      <Grid size="grow">
        <Typography variant="h5" data-testid="timer">
          {"Time: " + formatTime(minutes, seconds)}
        </Typography>
      </Grid>
      <Grid size={6}>
        <List sx={{ display: "flex", flexDirection: "row", padding: 0, justifyContent: "center" }}>
          <ListItemButton sx={topButtonSx} onClick={() => dispatch(restartGame())}>
            <ListItemText primary="RESTART" />
          </ListItemButton>
          <ListItemButton sx={topButtonSx} onClick={() => dispatch(setGameState("startup"))}>
            <ListItemText primary="MENU" />
          </ListItemButton>
        </List>
      </Grid>
      <Grid size="grow">
        <Typography variant="h5" data-testid="bombs-left">
          {"Bombs left: " + bombsLeft}
        </Typography>
      </Grid>
    </Grid>
  )
}
