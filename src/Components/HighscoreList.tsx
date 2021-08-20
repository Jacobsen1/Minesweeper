import { ListItem, ListItemText, makeStyles } from "@material-ui/core";
import React from "react";
import { Highscore } from "../GameLogic";
const useStyles = makeStyles((theme) => ({
  highscoreHead: {
    backgroundColor: "#2c8fb5",
    "&:hover": {
      backgroundColor: "#2780a2",
    },
  },
  menuText: {
    textAlign: "center",
    width: "50%"
  },
  highscoreRow: {
    backgroundColor: "#ffc3a6",
    "&:hover": {
      backgroundColor: "#ffa67b",
    },
  },
}))

export const HighscoreList = (props: { highscores: Highscore[] }) => {
  const classes = useStyles();

  return (
    <>
      <ListItem className={classes.highscoreHead}>
        <ListItemText
          primary="Username"
          className={classes.menuText}
          primaryTypographyProps={{ variant: "h5" }}
        />
        <ListItemText
          primary="Score"
          className={classes.menuText}
          primaryTypographyProps={{ variant: "h5" }}
        />
      </ListItem>
      {props.highscores.map((row, i) => (
        <ListItem key={i} className={classes.highscoreRow}>
          <ListItemText
            primary={row.name}
            className={classes.menuText}
            primaryTypographyProps={{ variant: "h6" }}
          />
          <ListItemText
            primary={row.score}
            className={classes.menuText}
            primaryTypographyProps={{ variant: "h6" }}
          />
        </ListItem>
      ))}
    </>
  )
}