import {
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { getHighscores } from "../server/axios";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { Highscore } from "../GameLogic";
import { HighscoreList } from "./HighscoreList";
import { CollapseMenu } from "./CollapseMenu";

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
    position: "relative",
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
  backArrow: {
    position: "absolute",
    left: "0",
    top: "0",
  },
}));

export const StartMenu = () => {
  const classes = useStyles();

  const [playMenuOpen, setPlayMenuOpen] = useState(false);
  const [highscoreMenuOpen, setHighscoreMenuOpen] = useState(false);
  const [showHighscore, setShowHighscore] = useState(false);

  const [highscore, setHighscore] = useState<Highscore[]>([]);
  const [highscoreType, setHighscoreType] = useState<number>(0)

  useEffect(() => {
    if (highscoreType > 0) {
      getHighscores(highscoreType).then((res: Highscore[]) => {
        setHighscore(res);
      });
    }
  }, [highscoreType]);

  return (
    <div className={classes.startMenuWrapper}>
      <Card className={classes.startMenu}>
        {showHighscore ? (
          <IconButton
            className={classes.backArrow}
            onClick={() => setShowHighscore(false)}
          >
            <ArrowBackIcon />
          </IconButton>
        ) : (
          ""
        )}
        <CardContent>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Typography
              variant="h2"
              style={{ marginBottom: "10px", marginTop: "-10px" }}
            >
              {showHighscore ? "Highscores" : "Minesweeper"}
            </Typography>
            <List
              style={{ width: "100%", maxHeight: "384px", overflow: "auto" }}
              disablePadding
            >
              {showHighscore ? (
                <HighscoreList highscores={highscore} />
              ) : (
                <>
                  <ListItem
                    button
                    className={classes.menuButton}
                    onClick={() => {
                      setPlayMenuOpen(!playMenuOpen);
                      setHighscoreMenuOpen(false)
                    }}
                  >
                    <ListItemText
                      primary="PLAY"
                      className={classes.menuText}
                      primaryTypographyProps={{ variant: "h5" }}
                    />
                  </ListItem>
                  <Divider />
                  <CollapseMenu open={playMenuOpen} menuType={1} setShowHighscore={setShowHighscore} setHighscoreType={setHighscoreType} />
                  <Divider />
                  <ListItem
                    button
                    className={classes.menuButton}
                    onClick={() => {
                      setHighscoreMenuOpen(!highscoreMenuOpen)
                      setPlayMenuOpen(false)
                    }}
                  >
                    <ListItemText
                      primary="HIGHSCORES"
                      className={classes.menuText}
                      primaryTypographyProps={{ variant: "h5" }}
                    />
                  </ListItem>
                  <Divider />
                  <CollapseMenu open={highscoreMenuOpen} menuType={2} setShowHighscore={setShowHighscore} setHighscoreType={setHighscoreType} />
                  <Divider />
                </>
              )}
            </List>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
};
