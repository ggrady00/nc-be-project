const express = require("express")
const { getTopics } = require("./controllers/topic_controllers")
const { handleCustomErrors, handle404Errors, handlePsqlErrors } = require("./errors")
const { getEndpoints } = require("./controllers/api_routes_controller")
const { getArticleByID, getAllArticles } = require("./controllers/articles_controller")

const app = express()

app.get("/api/topics", getTopics)
app.get("/api", getEndpoints)
app.get("/api/articles/:article_id", getArticleByID)
app.get("/api/articles", getAllArticles)


app.all("*", handle404Errors)
app.use(handleCustomErrors)
app.use(handlePsqlErrors)

module.exports = app