import { Card, CardContent, Stack, ListItemButton, ListItemText, TextField, Typography } from "@mui/material"
import { useState } from "react"
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied"
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied"
import Modal from "react-modal"
import { newHighscore } from "../api"
import { formatTime } from "../GameLogic"
import {
  restartGame,
  selectBoardSize,
  selectGameState,
  selectMenuIsOpen,
  selectMinutes,
  selectSeconds,
  toggleMenu,
} from "../Redux/gameSlice"
import { useAppDispatch, useAppSelector, useAppStore } from "../Redux/store"
import { blueButtonSx } from "./styles"
Modal.setAppElement("#root")

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

const iconStyle = { width: "60%", height: "100%" }

const submitButtonSx = {
  ...blueButtonSx,
  width: "90%",
  flexGrow: 0,
  marginTop: "20px",
  height: "56px",
  textAlign: "center",
}

export const PopupMenu = () => {
  const dispatch = useAppDispatch()
  const store = useAppStore()
  const menuIsOpen = useAppSelector(selectMenuIsOpen)
  const won = useAppSelector(selectGameState) === "won"
  const [username, setUsername] = useState("")
  const [helperText, setHelperText] = useState("")

  const submit = () => {
    if (!(username.length > 0 && username.length < 16)) {
      setHelperText("Length must be between 0 and 16")
      return
    }
    // Read the time when submitting instead of re-rendering the popup on every tick.
    const state = store.getState()
    newHighscore({
      name: username,
      score: formatTime(selectMinutes(state), selectSeconds(state)),
      gametype: selectBoardSize(state),
    })
      .then((response) => {
        if (response.Status === 200) {
          dispatch(restartGame())
          setHelperText("")
          setUsername("")
        } else {
          console.error(response.Status, response.Text)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <Modal isOpen={menuIsOpen} style={customStyles} onRequestClose={() => dispatch(toggleMenu())}>
      <Card style={{ width: "100%", height: "100%", textAlign: "center" }}>
        <CardContent>
          <Typography variant="h2">{won ? "You Win!" : "You Lost"}</Typography>
        </CardContent>
        <Stack direction="column" sx={{ justifyContent: "center", alignItems: "center" }}>
          {won ? <SentimentVerySatisfiedIcon style={iconStyle} /> : <SentimentVeryDissatisfiedIcon style={iconStyle} />}
          {won && (
            <TextField
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              style={{ width: "90%" }}
              id="outlined-basic"
              label="Username"
              variant="outlined"
              helperText={helperText}
            />
          )}

          <ListItemButton sx={submitButtonSx} onClick={submit}>
            <ListItemText primary="SUBMIT" />
          </ListItemButton>
        </Stack>
      </Card>
    </Modal>
  )
}
