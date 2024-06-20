const { getTopics, postTopic } = require("../controllers/topic_controllers")

const topicRouter = require("express").Router()

topicRouter
.route("/")
.get(getTopics)
.post(postTopic)

module.exports = topicRouter