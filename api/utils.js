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
    console.log(queryStr, value)
    return db.query(queryStr, [value])
    .then(({rows}) => {
        if (!rows.length) {
            return Promise.reject({status: 404, msg: "Resource not Found"})
        } else {
            return rows[0]
        }
    })
}