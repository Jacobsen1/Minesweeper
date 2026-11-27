import "./App.css"

import { useAppSelector } from "./Redux/store"
import { selectGameState } from "./Redux/gameSlice"
import { StartMenu } from "./Components/StartMenu"
import { Game } from "./Components/Game"

function App() {
  const gameState = useAppSelector(selectGameState)

  return <div className="App">{gameState !== "startup" ? <Game /> : <StartMenu />}</div>
}

export default App

//TODO
/*
- MAKE A VARIABLE FOR EVERY BOMB GENERATED FOR FASTER LOSE AND SHOW THE ENITRE MAP WHEN WINNING
- SHOW WHAT CELL WAS FLAGGED WRONG WHEN LOSING
 */
