import axios from "axios"

export type Highscore = {
  name: string
  score: string
  gametype: number
}

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3001",
})

export const getHighscores = (gametype: number): Promise<Highscore[]> =>
  instance
    .get<Highscore[]>("highscore", { params: { gametype } })
    .then((response) => response.data)
    .catch((err) => {
      console.log(err)
      return []
    })

export const newHighscore = (highscore: Highscore): Promise<{ Status: number; Text: string }> =>
  instance
    .post("new_highscore", highscore)
    .then((response) => ({ Status: response.status, Text: response.statusText }))
    .catch((err) => ({
      Status: err.response?.status ?? 0,
      Text: err.response?.statusText ?? err.message,
    }))
