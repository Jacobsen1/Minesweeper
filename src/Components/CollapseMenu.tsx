import { Collapse, List, ListItem, ListItemText, makeStyles } from "@material-ui/core";
import React, { Dispatch, SetStateAction } from "react";
import { useDispatch } from "react-redux";
import { setBoardSize, setGameState } from "../Redux/GameActions";

const useStyles = makeStyles((theme) => ({
  innerMenuButton: {
    backgroundColor: "#ffc3a6",
    "&:hover": {
      backgroundColor: "#ffa67b",
    },
  },
  menuText: {
    textAlign: "center",
  },
}));

type CollapseMenuProps = {
  open: boolean,
  menuType: number,
  setHighscoreType: Dispatch<SetStateAction<number>>,
  setShowHighscore: (open: boolean) => void
}

export const CollapseMenu = (props: CollapseMenuProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  return (
    <Collapse in={props.open} timeout="auto" unmountOnExit>
      <List component="div" disablePadding>
        <ListItem
          button
          className={classes.innerMenuButton}
          onClick={() => {
            if (props.menuType === 1) {
              dispatch(setBoardSize({ boardSize: 1 }));
              dispatch(setGameState({ gameState: "running" }));
            } else {
              props.setHighscoreType(1)
              props.setShowHighscore(true)
            }
          }}
        >
          <ListItemText
            primary="16 x 30"
            className={classes.menuText}
            primaryTypographyProps={{ variant: "h6" }}

          />
        </ListItem>
        <ListItem
          button
          className={classes.innerMenuButton}
          onClick={() => {
            if (props.menuType === 1) {
              dispatch(setBoardSize({ boardSize: 2 }));
              dispatch(setGameState({ gameState: "running" }));
            } else {
              props.setHighscoreType(2)
              props.setShowHighscore(true)

            }
          }}
        >
          <ListItemText
            primary="16 x 16"
            className={classes.menuText}
            primaryTypographyProps={{ variant: "h6" }}

          />
        </ListItem>
        <ListItem
          button
          className={classes.innerMenuButton}
          onClick={() => {
            if (props.menuType === 1) {
              dispatch(setBoardSize({ boardSize: 3 }));
              dispatch(setGameState({ gameState: "running" }));
            } else {
              props.setHighscoreType(3)
              props.setShowHighscore(true)

            }
          }}
        >
          <ListItemText
            primary="10 x 10"
            className={classes.menuText}
            primaryTypographyProps={{ variant: "h6" }}

          />
        </ListItem>
      </List>
    </Collapse>
  )
}