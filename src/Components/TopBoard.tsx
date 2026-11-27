import { Grid, List, ListItemButton, ListItemText, Typography } from "@mui/material"
import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { numCols, numOfBombs, numRows } from "./Game"
import { restartGame, setGameState } from "../Redux/GameActions"
import { RootState, selectBombsLeft, selectMinutes, selectSeconds } from "../Redux/GameReducer"

const topButtonSx = {
  margin: "4px",
  backgroundColor: "#c7c7c7",
  "&:hover": {
    backgroundColor: "#b3b3b3",
  },
  textAlign: "center",
  width: "130px",
  flexGrow: 0,
}

export const TopBoard = () => {
  const dispatch = useDispatch()
  const bombsLeft = useSelector<RootState, number>(selectBombsLeft)
  const minutes = useSelector<RootState, number>(selectMinutes)
  const seconds = useSelector<RootState, number>(selectSeconds)

  return (
    <Grid
      container
      direction="row"
      sx={{ justifyContent: "center", alignItems: "center" }}
      style={{ backgroundColor: "#2c8fb5", padding: "20px 0 20px 0" }}
    >
      <Grid size="grow">
        <Typography variant="h5" data-testid="timer">
          {"Time: "}
          {minutes > 9 ? minutes : "0" + minutes}:{seconds > 9 ? seconds : "0" + seconds}
        </Typography>
      </Grid>
      <Grid size={6}>
        <List sx={{ display: "flex", flexDirection: "row", padding: 0, justifyContent: "center" }}>
          <ListItemButton
            sx={topButtonSx}
            onClick={() => {
              dispatch(restartGame({ numRows: numRows, numCols: numCols, numBombs: numOfBombs }))
            }}
          >
            <ListItemText primary="RESTART" />
          </ListItemButton>
          <ListItemButton
            sx={topButtonSx}
            onClick={() => {
              dispatch(setGameState({ gameState: "startup" }))
            }}
          >
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

export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delay === null) {
      return
    }

    const id = setInterval(() => savedCallback.current(), delay)

    return () => clearInterval(id)
  }, [delay])
}
