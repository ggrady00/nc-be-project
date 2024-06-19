const { getEndpoints } = require("../controllers/api_routes_controller")
const articlesRouter = require("./articles-router")
const commentsRouter = require("./comments-router")
const topicRouter = require("./topic-router")
const usersRouter = require("./users-router")

const apiRouter = require("express").Router()

apiRouter.get("/", getEndpoints)
apiRouter.use("/topics", topicRouter)
apiRouter.use("/articles", articlesRouter)
apiRouter.use("/comments", commentsRouter)
apiRouter.use("/users", usersRouter)

module.exports = apiRouter