# Minesweeper

Minesweeper built with React 19, Redux Toolkit and MUI, bundled with Vite.
Highscores are stored in MySQL through a small Express API.

## Requirements

- Node.js 26 LTS (see `.nvmrc`; Node >= 22.12 also works)
- MySQL (only needed for highscores)

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` / `npm start` | Start the Vite dev server on http://localhost:3000 |
| `npm run build` | Type-check and build the production bundle into `build/` |
| `npm run preview` | Serve the production build on http://localhost:3000 |
| `npm run typecheck` | Run the TypeScript compiler without emitting |
| `npm run lint` | Lint with oxlint |
| `npm run server` | Start the highscore API on http://localhost:3001 |
| `npm test` | Run the Playwright UI tests (builds and serves the app automatically) |

## Highscore API

The API reads its database settings from environment variables:

| Variable | Default |
| --- | --- |
| `DB_HOST` | `localhost` |
| `DB_USER` | `root` |
| `DB_PASSWORD` | `1234` |
| `DB_NAME` | `minesweeper` |
| `PORT` | `3001` |

The frontend talks to `http://localhost:3001` by default; override it with `VITE_API_URL`.

Expected table:

```sql
CREATE TABLE highscore (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(16) NOT NULL,
  score VARCHAR(8) NOT NULL,
  gametype INT NOT NULL
);
```
