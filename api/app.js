const express = require("express")
const { getTopics } = require("./controllers/topic_controllers")
const { handleCustomErrors, handle404Errors, handlePsqlErrors } = require("./errors")
const { getEndpoints } = require("./controllers/api_routes_controller")
const { getArticleByID, getAllArticles, patchArticleByID } = require("./controllers/articles_controller")
const { getCommentsByID, postCommentByID, deleteCommentByID } = require("./controllers/comments_controller")

const app = express()
app.use(express.json())

app.get("/api/topics", getTopics)
app.get("/api", getEndpoints)
app.get("/api/articles/:article_id", getArticleByID)
app.get("/api/articles", getAllArticles)
app.get("/api/articles/:article_id/comments", getCommentsByID)
app.post("/api/articles/:article_id/comments", postCommentByID)
app.patch("/api/articles/:article_id", patchArticleByID)
app.delete("/api/comments/:comment_id", deleteCommentByID)


app.all("*", handle404Errors)
app.use(handleCustomErrors)
app.use(handlePsqlErrors)

module.exports = app