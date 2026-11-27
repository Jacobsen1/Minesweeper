import {
  Card,
  CardContent,
  Divider,
  IconButton,
  List,
  Stack,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material"
import { useEffect, useState } from "react"
import { getHighscores } from "../server/axios"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { Highscore } from "../GameLogic"
import { HighscoreList } from "./HighscoreList"
import { CollapseMenu } from "./CollapseMenu"

const menuButtonSx = {
  height: "70px",
  backgroundColor: "#2c8fb5",
  "&:hover": {
    backgroundColor: "#2780a2",
  },
}

export const StartMenu = () => {
  const [playMenuOpen, setPlayMenuOpen] = useState(false)
  const [highscoreMenuOpen, setHighscoreMenuOpen] = useState(false)
  const [showHighscore, setShowHighscore] = useState(false)

  const [highscore, setHighscore] = useState<Highscore[]>([])
  const [highscoreType, setHighscoreType] = useState<number>(0)

  useEffect(() => {
    if (highscoreType > 0) {
      getHighscores(highscoreType).then((res: Highscore[]) => {
        setHighscore(res)
      })
    }
  }, [highscoreType])

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        backgroundImage: `url(${import.meta.env.BASE_URL}minesweeperbg.jpg)`,
      }}
    >
      <Card
        sx={{
          width: "30vw",
          height: "50vh",
          padding: "20px  ",
          backgroundColor: "#e3e3e3",
          position: "relative",
        }}
      >
        {showHighscore ? (
          <IconButton
            aria-label="back"
            sx={{ position: "absolute", left: "0", top: "0" }}
            onClick={() => setShowHighscore(false)}
          >
            <ArrowBackIcon />
          </IconButton>
        ) : (
          ""
        )}
        <CardContent>
          <Stack direction="column" sx={{ justifyContent: "center", alignItems: "center" }}>
            <Typography variant="h2" style={{ marginBottom: "10px", marginTop: "-10px" }}>
              {showHighscore ? "Highscores" : "Minesweeper"}
            </Typography>
            <List style={{ width: "100%", maxHeight: "384px", overflow: "auto" }} disablePadding>
              {showHighscore ? (
                <HighscoreList highscores={highscore} />
              ) : (
                <>
                  <ListItemButton
                    sx={menuButtonSx}
                    onClick={() => {
                      setPlayMenuOpen(!playMenuOpen)
                      setHighscoreMenuOpen(false)
                    }}
                  >
                    <ListItemText
                      primary="PLAY"
                      sx={{ textAlign: "center" }}
                      slotProps={{ primary: { variant: "h5" } }}
                    />
                  </ListItemButton>
                  <Divider />
                  <CollapseMenu
                    open={playMenuOpen}
                    menuType={1}
                    setShowHighscore={setShowHighscore}
                    setHighscoreType={setHighscoreType}
                  />
                  <Divider />
                  <ListItemButton
                    sx={menuButtonSx}
                    onClick={() => {
                      setHighscoreMenuOpen(!highscoreMenuOpen)
                      setPlayMenuOpen(false)
                    }}
                  >
                    <ListItemText
                      primary="HIGHSCORES"
                      sx={{ textAlign: "center" }}
                      slotProps={{ primary: { variant: "h5" } }}
                    />
                  </ListItemButton>
                  <Divider />
                  <CollapseMenu
                    open={highscoreMenuOpen}
                    menuType={2}
                    setShowHighscore={setShowHighscore}
                    setHighscoreType={setHighscoreType}
                  />
                  <Divider />
                </>
              )}
            </List>
          </Stack>
        </CardContent>
      </Card>
    </div>
  )
}
