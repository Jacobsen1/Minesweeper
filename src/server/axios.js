const axios = require("axios");
const instance = axios.create({ baseURL: "http://localhost:3001" });

export const getHighscores = (highscoreType) => {
  return instance
    .get("highscore", { params: { gametype: highscoreType } })
    .then((response) => response.data)
    .catch((err) => console.log(err));
};

export const newHighscore = (highscore) => {
  return instance
    .post("new_highscore", highscore)
    .then((response) => {
      return { Status: response.status, Text: response.statusText };
    })
    .catch((err) => {
      return {
        Status: err.response.status,
        Text: err.response.statusText,
      };
    });
};
