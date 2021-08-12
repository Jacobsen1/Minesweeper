import {
  Card,
  CardContent,
  Collapse,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Typography,
} from "@material-ui/core"
import React, { useState } from "react"
import { useDispatch } from "react-redux"
import { setBoardSize, setGameState } from "../Redux/GameActions"

const useStyles = makeStyles((theme) => ({
  startMenuWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    backgroundImage: `url(` + process.env.PUBLIC_URL + `/minesweeperbg.jpg)`,
  },
  startMenu: {
    width: "30vw",
    height: "50vh",
    padding: "20px  ",
    backgroundColor: "#e3e3e3",
  },
  menuText: {
    textAlign: "center",
  },
  menuButton: {
    height: "70px",
    backgroundColor: "#2c8fb5",
    "&:hover": {
      backgroundColor: "#2780a2",
    },
  },
  innerMenuButton: {
    backgroundColor: "#ffc3a6",
    "&:hover": {
      backgroundColor: "#ffa67b",
    },
  },
}))

export const StartMenu = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  return (
    <div className={classes.startMenuWrapper}>
      <Card className={classes.startMenu}>
        <CardContent>
          <Grid container direction="column" justifyContent="center" alignItems="center">
            <Typography variant="h2">Minesweeper</Typography>
            <List style={{ width: "100%" }}>
              <ListItem
                button
                className={classes.menuButton}
                onClick={() => {
                  setOpen(!open)
                }}
              >
                <ListItemText
                  primary="PLAY"
                  className={classes.menuText}
                  primaryTypographyProps={{ variant: "h5" }}
                />
              </ListItem>
              <Divider />
              <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItem
                    button
                    className={classes.innerMenuButton}
                    onClick={() => {
                      dispatch(setBoardSize({ boardSize: 1 }))
                      dispatch(setGameState({ gameState: "running" }))
                    }}
                  >
                    <ListItemText primary="16 x 30" className={classes.menuText} />
                  </ListItem>
                  <ListItem
                    button
                    className={classes.innerMenuButton}
                    onClick={() => {
                      dispatch(setBoardSize({ boardSize: 2 }))
                      dispatch(setGameState({ gameState: "running" }))
                    }}
                  >
                    <ListItemText primary="16 x 16" className={classes.menuText} />
                  </ListItem>
                  <ListItem
                    button
                    className={classes.innerMenuButton}
                    onClick={() => {
                      dispatch(setBoardSize({ boardSize: 3 }))
                      dispatch(setGameState({ gameState: "running" }))
                    }}
                  >
                    <ListItemText primary="10 x 10" className={classes.menuText} />
                  </ListItem>
                </List>
              </Collapse>
              <Divider />

              <ListItem button className={classes.menuButton}>
                <ListItemText
                  primary="HIGHSCORES"
                  className={classes.menuText}
                  primaryTypographyProps={{ variant: "h5" }}
                />
              </ListItem>
            </List>
          </Grid>
        </CardContent>
      </Card>
    </div>
  )
}
