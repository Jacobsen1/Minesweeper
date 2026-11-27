import express from "express"
import mysql from "mysql2"

const app = express()
app.use(express.json())

const port = Number(process.env.PORT ?? 3001)

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

const con = mysql.createConnection({
  host: process.env.DB_HOST ?? "localhost",
  user: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD ?? "1234",
  database: process.env.DB_NAME ?? "minesweeper",
})

con.connect((err) => {
  if (err) throw err
  console.log("Connected Database")
})

app.get("/highscore", (req, res) => {
  con.query("SELECT * FROM highscore WHERE gametype = ?", [req.query.gametype], (err, result) => {
    if (err) {
      console.log("error ", err)
      res.status(500).send(err)
      return
    }
    res.send(result)
  })
})

app.post("/new_highscore", (req, res) => {
  const { name, score, gametype } = req.body ?? {}
  con.query(
    "INSERT INTO highscore (name, score, gametype) VALUES (?, ?, ?)",
    [name, score, gametype],
    (err, result) => {
      if (err) {
        console.error(err)
        res.status(500).send(err)
      } else {
        res.send(result)
      }
    }
  )
})

app.listen(port, () => {
  console.log(`Highscore API listening at http://localhost:${port}`)
})
