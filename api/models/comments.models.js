const db = require("../../db/connection")

exports.selectCommentsByID = (id) => {
    const queryStr = `SELECT *
                      FROM comments 
                      WHERE article_id = $1
                      ORDER BY created_at DESC;`
    return db.query(queryStr, [id])
    .then(({rows}) => {
        return rows
    })
}

exports.insertCommentByID = (id, body) => {
    const queryStr = `INSERT INTO comments (body, author, article_id) 
                      VALUES ($1, $2, $3)
                      RETURNING *;`
    const queryValues = [body.body, body.username, id]
    return db.query(queryStr, queryValues)
    .then(({rows}) => {
        return rows[0]
    })
}