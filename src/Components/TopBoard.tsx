import { Button, Grid, Typography } from "@material-ui/core"
import { useEffect, useRef } from "react"
import { useDispatch } from "react-redux"
import { numCols, numOfBombs, numRows } from "../App"
import { restartGame } from "../Redux/GameActions"

export const TopBoard = (props: { bombsLeft: number; minutes: number; seconds: number }) => {
  const dispatch = useDispatch()

  return (
    <>
      <Grid item xs>
        <Typography variant="h5">
          {props.minutes > 9 ? props.minutes : "0" + props.minutes}:
          {props.seconds > 9 ? props.seconds : "0" + props.seconds}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            dispatch(restartGame({ numRows: numRows, numCols: numCols, numBombs: numOfBombs }))
          }}
        >
          Restart
        </Button>
      </Grid>
      <Grid item xs>
        <Typography variant="h5">{props.bombsLeft}</Typography>
      </Grid>
    </>
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
