const { getAllArticles, getArticleByID, patchArticleByID } = require("../controllers/articles_controller")
const { getCommentsByID, postCommentByID } = require("../controllers/comments_controller")

const articlesRouter = require("express").Router()

articlesRouter.get("/", getAllArticles)

articlesRouter
.route("/:article_id")
.get(getArticleByID)
.patch(patchArticleByID)

articlesRouter
.route("/:article_id/comments")
.get(getCommentsByID)
.post(postCommentByID)

module.exports = articlesRouter