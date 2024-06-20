const format = require("pg-format")
const db = require("../../db/connection")

exports.selectTopics = () => {
    return db.query(`SELECT * FROM topics;`)
    .then(({rows}) => {
        return rows
    })
}

exports.insertTopic = (topic) => {
    if (Object.keys(topic).length != 2) {
        return Promise.reject({status: 400, msg: "Bad Request"})
    }
    const queryStr = format(
        'INSERT INTO topics (slug, description) VALUES (%L) RETURNING *;',
        [topic.slug, topic.description]
      )
    
    return db.query(queryStr)
    .then(({rows}) => {
        return rows[0]
    })
}