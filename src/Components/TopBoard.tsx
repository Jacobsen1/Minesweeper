import {
  Grid,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Typography,
} from "@material-ui/core"
import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { numCols, numOfBombs, numRows } from "./Game"
import { restartGame, setGameState } from "../Redux/GameActions"
import { RootState, selectBombsLeft, selectMinutes, selectSeconds } from "../Redux/GameReducer"

const useStyles = makeStyles(() => ({
  topButtons: {
    margin: "4px",
    backgroundColor: "#c7c7c7",
    "&:hover": {
      backgroundColor: "#b3b3b3",
    },
    textAlign: "center",
    width: "130px",
  },
  topMenu: {
    display: "flex",
    flexDirection: "row",
    padding: 0,
    justifyContent: "center",
  },
}))

export const TopBoard = () => {
  const dispatch = useDispatch()
  const classes = useStyles()
  const bombsLeft = useSelector<RootState, number>(selectBombsLeft)
  const minutes = useSelector<RootState, number>(selectMinutes)
  const seconds = useSelector<RootState, number>(selectSeconds)

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      style={{ backgroundColor: "#2c8fb5", padding: "20px 0 20px 0" }}
    >
      <Grid item xs>
        <Typography variant="h5">
          {"Time: "}
          {minutes > 9 ? minutes : "0" + minutes}:{seconds > 9 ? seconds : "0" + seconds}
        </Typography>
      </Grid>
      <Grid item xs={6}>

        {/*<button onClick={() => dispatch(toggleMenu())}>ToggleMenu</button>*/}
        <List className={classes.topMenu}>
          <ListItem
            button
            className={classes.topButtons}
            onClick={() => {
              dispatch(restartGame({ numRows: numRows, numCols: numCols, numBombs: numOfBombs }))
            }}
          >
            <ListItemText primary="RESTART" />
          </ListItem>
          <ListItem
            button
            className={classes.topButtons}
            onClick={() => {
              dispatch(setGameState({ gameState: "startup" }))
            }}
          >
            <ListItemText primary="MENU" />
          </ListItem>
        </List>
      </Grid>
      <Grid item xs>
        <Typography variant="h5">{"Bombs left: " + bombsLeft}</Typography>
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
