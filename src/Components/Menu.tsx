import { Button, Card, CardContent, Grid, Typography } from "@material-ui/core"
import React from "react"
import SentimentVeryDissatisfiedIcon from "@material-ui/icons/SentimentVeryDissatisfied"
import { restartGame, toggleMenu } from "../Redux/GameActions"
import { numCols, numOfBombs, numRows } from "../App"
import { useDispatch, useSelector } from "react-redux"
import { RootState, selectMenuIsOpen } from "../Redux/GameReducer"
import Modal from "react-modal"
Modal.setAppElement("#root")

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

  const menuIsOpen = useSelector<RootState, boolean>(selectMenuIsOpen)

  return (
    <Modal isOpen={menuIsOpen} style={customStyles} onRequestClose={() => dispatch(toggleMenu())}>
      <Card style={{ width: "100%", height: "100%", textAlign: "center" }}>
        <CardContent>
          <Typography variant="h2">You Lost</Typography>
        </CardContent>
        <Grid container direction="column" justifyContent="center" alignItems="center">
          <SentimentVeryDissatisfiedIcon style={{ width: "60%", height: "100%" }} />

          <Button
            variant="contained"
            color="primary"
            style={{ width: "90%" }}
            onClick={() => {
              dispatch(restartGame({ numRows: numRows, numCols: numCols, numBombs: numOfBombs }))
            }}
          >
            Restart Game
          </Button>
        </Grid>
      </Card>
    </Modal>
  )
}
