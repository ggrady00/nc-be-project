const express = require("express")
const { getTopics } = require("./controllers/topic_controllers")
const { handleCustomErrors, handle404Errors } = require("./errors")

const app = express()

app.get("/api/topics", getTopics)


app.all("*", handle404Errors)
module.exports = app