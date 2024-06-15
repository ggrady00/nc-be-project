const format = require("pg-format")
const db = require("../db/connection")

exports.checkCommentExists = (id) => {
    const queryStr = `SELECT *
                      FROM comments 
                      WHERE comment_id = $1;`
    return db.query(queryStr, [id])
    .then(({rows}) => {
        if (!rows.length) {
            return Promise.reject({status: 404, msg: "Comment not Found"})
        } else {
            return rows[0]
        }
    })
}

exports.chechExists = (table, column, value) => {
    const queryStr = format(`SELECT *
                             FROM %I 
                             WHERE %I = 
                             "comment" : 
                             {
                               "article_id": 3,
                               "title": "Eight pug gifs that remind me of mitch",
                               "topic": "mitch",
                               "author": "icellusedkars",
                               "body": "some gifs",
                               "created_at": "2020-11-03T09:12:00.000Z",
                               "article_img_url":
                                 "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                               "votes": 2
                             };`, table, column)
    return db.query(queryStr, [value])
    .then(({rows}) => {
        if (!rows.length) {
            return Promise.reject({status: 404, msg: "Resource not Found"})
        } else {
            return rows[0]
        }
    })
}