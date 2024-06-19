const { deleteCommentByID, patchCommentByID } = require("../controllers/comments_controller")

const commentsRouter = require("express").Router()

commentsRouter
.route("/:comment_id")
.patch(patchCommentByID)
.delete(deleteCommentByID)


module.exports = commentsRouter