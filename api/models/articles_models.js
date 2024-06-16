const db = require("../../db/connection");
const { chechExists } = require("../utils");

exports.selectArticleByID = (id) => {
  const queryStr = `SELECT * 
                    FROM articles 
                    WHERE article_id = $1;`;
  return db.query(queryStr, [id]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Article not Found" });
    } else {
      return rows[0];
    }
  });
};

exports.selectAllArticles = (topic) => {
  let queryValues = []
  let queryStr = `SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.comment_id) AS comment_count 
                    FROM articles 
                    LEFT JOIN comments ON articles.article_id = comments.article_id`
  if (topic) {
    queryStr += ` WHERE topic = $1`
    queryValues.push(topic)
  }
  queryStr +=  ` GROUP BY articles.article_id 
                ORDER BY articles.created_at DESC;`;
  
  return db.query(queryStr, queryValues).then(({ rows }) => {
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
  
