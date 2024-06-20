const { selectTopics, insertTopic } = require("../models/topic_models")

exports.getTopics = (req, res, next) => {
    selectTopics()
    .then(topics => {
        res.status(200).send({topics})
    })
    .catch(next)
}

exports.postTopic = (req, res, next) => {
    const topic = req.body
    insertTopic(topic)
    .then((topic) => {
        res.status(201).send({topic})
    })
    .catch(next)
}