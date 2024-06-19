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
    const queryStr = format(`SELECT * FROM %I WHERE %I = $1;`, table, column)
    return db.query(queryStr, [value])
    .then(({rows}) => {
        if (!rows.length) {
            return Promise.reject({status: 404, msg: "Resource not Found"})
        } else {
            return rows[0]
        }
    })
}

exports.checkQueries = (sort_by, order) => {
    const sortBys = ["author", "title", "article_id", "topic", "created_at", "votes", "article_img_url", "comment_count"]
    const orders = ["asc", "desc"]

    if (!sortBys.includes(sort_by) || !orders.includes(order)) {
        return Promise.reject({status: 400, msg: "Bad Request"})
    }
}