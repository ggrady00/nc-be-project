const { getTopics } = require("../controllers/topic_controllers")

const topicRouter = require("express").Router()

topicRouter.get("/", getTopics)

module.exports = topicRouter