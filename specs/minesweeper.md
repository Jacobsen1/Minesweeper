# Minesweeper test plan

**Seed:** `tests/seed.spec.ts`

The highscore API (`http://localhost:3001`) is mocked in `tests/fixtures.ts`.
Use `startGameWithMines()` from the fixtures to get a deterministic board.

## 1. Start menu (`tests/start-menu.spec.ts`)

1. **shows the title and main menu** – page title is "Minesweeper", PLAY and HIGHSCORES are visible.
2. **PLAY toggles the board size options** – clicking PLAY shows "16 x 30", "16 x 16" and "10 x 10"; clicking again hides them.
3. **starts a game for each board size** – picking a size renders rows × cols cells, the bomb counter shows 15 % of the cells and the timer starts near 00:00.
4. **MENU returns to the start menu** – the board disappears and the menu is shown again.

## 2. Gameplay (`tests/gameplay.spec.ts`)

Board: 10 x 10 with the 15 mines in row 0 and row 1, columns 0–4.

1. **timer starts counting** – the timer reaches 00:02.
2. **right click toggles a flag** – the flag icon appears, "Bombs left" drops by one, left click does not open a flagged cell, a second right click removes the flag.
3. **clicking a numbered cell opens only that cell** – (2, 0) shows "2" and is the only opened cell.
4. **clicking an empty cell flood-fills** – clicking (9, 9) opens all 85 safe cells and none of the mines.
5. **clicking a mine loses** – "You Lost" dialog, the whole board is revealed with 15 mines, the timer stops after closing the dialog.
6. **RESTART after losing** – no cells are open, the bomb counter is back to 15 and the timer runs again.
7. **flagging every mine wins** – the "You Win!" dialog appears.

## 3. Highscores (`tests/highscores.spec.ts`)

1. **lists highscores for a board size** – HIGHSCORES → "10 x 10" lists the mocked rows; the back arrow returns to the menu.
2. **API unavailable** – the list renders empty instead of crashing.
3. **empty username is rejected** – SUBMIT without a name shows "Length must be between 0 and 16" and nothing is posted.
4. **submit after winning** – the score is POSTed as `{ name, score: "mm:ss", gametype: 3 }`, a new game starts and the new score appears in the list.

## Known issues (not covered)

- A flagged cell with zero neighbouring mines opens when it is left-clicked
  (`GameReducer` `LeftClick` checks `neighborMineCount === 0` before the flag).
