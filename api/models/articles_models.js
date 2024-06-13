const db = require("../../db/connection")

exports.selectArticleByID = (id) => {
    const queryStr = `SELECT * FROM articles WHERE article_id = $1;`
    return db.query(queryStr, [id])
    .then(({rows}) => {
        return rows[0]
    })
}