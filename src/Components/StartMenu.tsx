import { Card, CardContent, Divider, IconButton, List, Stack, ListItemButton, ListItemText, Typography } from "@mui/material"
import { Fragment, useEffect, useState } from "react"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { getHighscores, Highscore } from "../api"
import { BoardSize } from "../GameLogic"
import { setBoardSize, setGameState } from "../Redux/gameSlice"
import { useAppDispatch } from "../Redux/store"
import { HighscoreList } from "./HighscoreList"
import { CollapseMenu } from "./CollapseMenu"
import { blueButtonSx } from "./styles"

type SubMenu = "play" | "highscores"

const SUB_MENUS: Array<{ key: SubMenu; label: string }> = [
  { key: "play", label: "PLAY" },
  { key: "highscores", label: "HIGHSCORES" },
]

export const StartMenu = () => {
  const dispatch = useAppDispatch()
  const [openMenu, setOpenMenu] = useState<SubMenu | null>(null)
  const [showHighscore, setShowHighscore] = useState(false)

  const [highscore, setHighscore] = useState<Highscore[]>([])
  const [highscoreType, setHighscoreType] = useState<BoardSize | 0>(0)

  useEffect(() => {
    if (highscoreType > 0) {
      getHighscores(highscoreType).then(setHighscore)
    }
  }, [highscoreType])

  const onSelect = (menu: SubMenu) => (boardSize: BoardSize) => {
    if (menu === "play") {
      dispatch(setBoardSize(boardSize))
      dispatch(setGameState("running"))
    } else {
      setHighscoreType(boardSize)
      setShowHighscore(true)
    }
  }

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
        {showHighscore && (
          <IconButton
            aria-label="back"
            sx={{ position: "absolute", left: "0", top: "0" }}
            onClick={() => setShowHighscore(false)}
          >
            <ArrowBackIcon />
          </IconButton>
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
                SUB_MENUS.map(({ key, label }) => (
                  <Fragment key={key}>
                    <ListItemButton
                      sx={{ ...blueButtonSx, height: "70px" }}
                      onClick={() => setOpenMenu((current) => (current === key ? null : key))}
                    >
                      <ListItemText
                        primary={label}
                        sx={{ textAlign: "center" }}
                        slotProps={{ primary: { variant: "h5" } }}
                      />
                    </ListItemButton>
                    <Divider />
                    <CollapseMenu open={openMenu === key} onSelect={onSelect(key)} />
                    <Divider />
                  </Fragment>
                ))
              )}
            </List>
          </Stack>
        </CardContent>
      </Card>
    </div>
  )
}
