let mysql = require("mysql");
var bodyParser = require("body-parser");
const express = require("express");
const app = express();
app.use(bodyParser.json());

const port = 3001;
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
let con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "minesweeper",
});

con.connect((err) => {
  if (err) throw err;
  console.log("Connected Database");
});

app.get("/highscore", (req, res) => {
  con.query(
    "SELECT * FROM highscore WHERE gametype = " + req.query.gametype + ";",
    function (err, result) {
      if (err) {
        console.log("error ", err);
      }
      res.send(result);
    }
  );
});

app.post("/new_highscore", function (req, res) {
  con.query(
    "INSERT INTO highscore (name, score, gametype) VALUES ('" +
      req.body.name +
      "', '" +
      req.body.score +
      "', '" +
      req.body.gametype +
      "');",
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
