const express = require("express")
const cors = require("cors")
const chalk = require("chalk")
const rowdy = require("rowdy-logger")
require("./models")

const app = express()
const PORT = 8000

const isProduction = process.env.NODE_ENV === "production"

app.use(express.json())
app.use(cors())
app.set("etag", isProduction)
app.use((req, res, next) => {
  res.removeHeader("X-Powered-By")
  next()
})

app.use(require("./helpers/requestLogger"))
const rowdyResults = rowdy.begin(app)

// ROUTES
app.use("/members", require("./controllers/member"))
app.use("/books", require("./controllers/book"))
app.use("/", (req, res) => {
  res.json("Welcome to the Library")
})

app.listen(PORT, handleListen)

function handleListen() {
  rowdyResults.print()
  console.log(
    chalk.bgGreen.bold(` 🤖 Server listening on http://localhost:${PORT} `)
  )
}
