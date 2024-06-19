const express = require("express")
const { handleCustomErrors, handle404Errors, handlePsqlErrors, handleServerErrors } = require("./errors")

const apiRouter = require("./routes/api-router")

const app = express()
app.use(express.json())

app.use("/api", apiRouter)




app.all("*", handle404Errors)
app.use(handleCustomErrors)
app.use(handlePsqlErrors)
app.use(handleServerErrors)

module.exports = app