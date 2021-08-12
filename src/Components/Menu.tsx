import {
  Card,
  CardContent,
  Grid,
  ListItem,
  ListItemText,
  makeStyles,
  Typography,
} from "@material-ui/core"
import React from "react"
import SentimentVeryDissatisfiedIcon from "@material-ui/icons/SentimentVeryDissatisfied"
import { restartGame, toggleMenu } from "../Redux/GameActions"
import { numCols, numOfBombs, numRows } from "./Game"
import { useDispatch, useSelector } from "react-redux"
import { RootState, selectGameState, selectMenuIsOpen } from "../Redux/GameReducer"
import SentimentVerySatisfiedIcon from "@material-ui/icons/SentimentVerySatisfied"
import Modal from "react-modal"
Modal.setAppElement("#root")

const useStyles = makeStyles(() => ({
  restartButton: {
    width: "90%",
    marginTop: "25px",
    backgroundColor: "#2c8fb5",
    "&:hover": {
      backgroundColor: "#2780a2",
    },
    textAlign: "center",
  },
}))
const customStyles = {
  content: {
    width: "30vw",
    height: "50vh",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    padding: "0px",
    transform: "translate(-50%, -50%)",
  },
}

export const PopupMenu = () => {
  const dispatch = useDispatch()
  const classes = useStyles()
  const menuIsOpen = useSelector<RootState, boolean>(selectMenuIsOpen)
  const gameState = useSelector<RootState, string>(selectGameState)

  return (
    <Modal isOpen={menuIsOpen} style={customStyles} onRequestClose={() => dispatch(toggleMenu())}>
      <Card style={{ width: "100%", height: "100%", textAlign: "center" }}>
        <CardContent>
          <Typography variant="h2">{gameState === "won" ? "You Win!" : "You Lost"}</Typography>
        </CardContent>
        <Grid container direction="column" justifyContent="center" alignItems="center">
          {gameState === "won" ? (
            <SentimentVerySatisfiedIcon style={{ width: "60%", height: "100%" }} />
          ) : (
            <SentimentVeryDissatisfiedIcon style={{ width: "60%", height: "100%" }} />
          )}

          <ListItem
            button
            className={classes.restartButton}
            onClick={() => {
              dispatch(restartGame({ numRows: numRows, numCols: numCols, numBombs: numOfBombs }))
            }}
          >
            <ListItemText primary="RESTART GAME" />
          </ListItem>
        </Grid>
      </Card>
    </Modal>
  )
}
