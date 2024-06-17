const format = require("pg-format");
const db = require("../../db/connection");
const { chechExists } = require("../utils");

exports.selectArticleByID = (id) => {
  const queryStr = `SELECT a.*, count(comment_id)::INT AS comment_count 
                    FROM articles a
                    LEFT JOIN comments c
                    ON a.article_id = c.article_id
                    WHERE a.article_id = $1
                    GROUP BY a.article_id;`;
  return db.query(queryStr, [id]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Article not Found" });
    } else {
      console.log(rows)
      return rows[0];
    }
  });
};

exports.selectAllArticles = (topic, sort_by) => {
  let queryValues = []
  let queryStr = `SELECT a.author, title, a.article_id, topic, a.created_at, a.votes, article_img_url, COUNT(c.comment_id) AS comment_count 
                    FROM articles a
                    LEFT JOIN comments c ON a.article_id = c.article_id`
  if (topic) {
    queryStr += ` WHERE topic = %L`
    queryValues.push(topic)
  }
  if (!sort_by) sort_by = "created_at"
  queryStr += ` GROUP BY a.article_id`
  
  if (sort_by === "comment_count") {
    queryStr +=  ` ORDER BY %I DESC;`;
  } else {
    queryStr +=  ` ORDER BY a.%I DESC;`;
  }
  queryValues.push(sort_by)

  

  const finalQuery = format(queryStr, ...queryValues)
  return db.query(finalQuery).then(({ rows }) => {
    return rows;
  });
};

exports.updateArticleByID = (id, votes) => {
    const queryStr = `UPDATE articles
                      SET votes = $1
                      WHERE article_id = $2
                      RETURNING *`;
    const queryValues = [votes, id];
    return db.query(queryStr, queryValues).then(({ rows }) => {
      return rows[0];
    });

  }
  
