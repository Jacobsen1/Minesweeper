import {
  Card,
  CardContent,
  Grid,
  ListItem,
  ListItemText,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core"
import React, { useState } from "react"
import SentimentVeryDissatisfiedIcon from "@material-ui/icons/SentimentVeryDissatisfied"
import { restartGame, toggleMenu } from "../Redux/GameActions"
import { numCols, numOfBombs, numRows } from "./Game"
import { useDispatch, useSelector } from "react-redux"
import { RootState, selectBoardSize, selectGameState, selectMenuIsOpen, selectMinutes, selectSeconds } from "../Redux/GameReducer"
import SentimentVerySatisfiedIcon from "@material-ui/icons/SentimentVerySatisfied"
import Modal from "react-modal"
import { newHighscore } from "../server/axios"
Modal.setAppElement("#root")

const useStyles = makeStyles(() => ({
  restartButton: {
    width: "90%",
    marginTop: "20px",
    height: "56px",
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
    maxWidth: "500px",
    height: "60vh",
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
  const minutes = useSelector<RootState, number>(selectMinutes)
  const seconds = useSelector<RootState, number>(selectSeconds)
  const boardSize = useSelector<RootState, number>(selectBoardSize)
  const [username, setUsername] = useState('')
  const [helperText, setHelperText] = useState('')


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
          {gameState === "won" ? (
            <TextField onChange={(e) => setUsername(e.target.value)} required autoFocus style={{ width: "90%" }} id="outlined-basic" label="Username" variant="outlined" helperText={helperText} />
          ) : ''}


          <ListItem
            button
            className={classes.restartButton}
            onClick={() => {
              if (username.length > 0 && username.length < 16) {
                newHighscore({ name: username, score: (minutes > 9 ? minutes.toString() : "0" + minutes.toString()) + ":" + (seconds > 9 ? seconds.toString() : "0" + seconds), gametype: boardSize }).then((response: any) => {
                  if (response.Status === 200) {
                    dispatch(restartGame({ numRows: numRows, numCols: numCols, numBombs: numOfBombs }))
                    setHelperText("")
                    setUsername("")
                  } else {
                    console.error(response.Status, response.Text)
                  }
                }).catch((error: any) => {
                  console.log(error)
                })
              } else {
                setHelperText("Length must be between 0 and 16")
              }
            }}
          >
            <ListItemText primary="SUBMIT" />
          </ListItem>
        </Grid>
      </Card>
    </Modal>
  )
}
