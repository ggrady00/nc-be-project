const { getAllArticles, getArticleByID, patchArticleByID, postArticle, deleteArticleById } = require("../controllers/articles_controller")
const { getCommentsByID, postCommentByID } = require("../controllers/comments_controller")

const articlesRouter = require("express").Router()

articlesRouter
.route("/")
.get(getAllArticles)
.post(postArticle)

articlesRouter
.route("/:article_id")
.get(getArticleByID)
.patch(patchArticleByID)
.delete(deleteArticleById)


articlesRouter
.route("/:article_id/comments")
.get(getCommentsByID)
.post(postCommentByID)

module.exports = articlesRouter