import React from "react"
import "./App.css"

import { useSelector } from "react-redux"
import { RootState, selectGameState } from "./Redux/GameReducer"
import { StartMenu } from "./Components/StartMenu"
import { Game } from "./Components/Game"

function App() {
  const gameState = useSelector<RootState, string>(selectGameState)

  return <div className="App">{gameState !== "startup" ? <Game /> : <StartMenu />}</div>
}

export default App

//TODO
/*
- MAKE A VARIABLE FOR EVERY BOMB GENERATED FOR FASTER LOSE AND SHOW THE ENITRE MAP WHEN WINNING
- SHOW WHAT CELL WAS FLAGGED WRONG WHEN LOSING
 */

//GAMESTATES
/*
- startup   - at the start of the game / in the menu
- running   - after pressing a board size in the menu and start playing
- won       - When the game is won
- game over - When the game is lost

*/
