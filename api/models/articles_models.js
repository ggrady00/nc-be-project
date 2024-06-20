const format = require("pg-format");
const db = require("../../db/connection");
const { chechExists, checkQueries } = require("../utils");

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

      return rows[0];
    }
  });
};

exports.selectAllArticles = (topic, sort_by, order, limit, p, totalCount) => {
  let queryValues = []
  let queryStr = `SELECT a.author, title, a.article_id, topic, a.created_at, a.votes, article_img_url, COUNT(c.comment_id) AS comment_count 
                    FROM articles a
                    LEFT JOIN comments c ON a.article_id = c.article_id`

  if (topic) {
    queryStr += ` WHERE topic = %L`
    queryValues.push(topic)
  }
  
  queryStr += ` GROUP BY a.article_id`

  if (sort_by === "comment_count") {
    queryStr +=  ` ORDER BY %I %s`;
  } else {
    queryStr +=  ` ORDER BY a.%I %s`;
  }
  queryValues.push(sort_by)
  queryValues.push(order)

  if (Number(limit) && Number(p)) {
    queryStr += ` LIMIT %s OFFSET %s`
    queryValues.push(limit)
    queryValues.push((p-1) * limit)
  } else if (limit == null) {
  } else {
    return Promise.reject({status: 400, msg: "Bad Request"})
  }
  
  queryStr += `;`
  const finalQuery = format(queryStr, ...queryValues)
  return db.query(finalQuery).then(({ rows }) => {
    return {articles: rows, totalCount: totalCount}
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
  
exports.insertArticle = (article) => {
  if (!article.article_img_url) article.article_img_url = 'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700'
  const queryStr = `INSERT INTO articles (title, topic, author, body, article_img_url)
                    VALUES ($1, $2, $3, $4, $5)
                    RETURNING *`
  const queryValues = [article.title, article.topic, article.author, article.body, article.article_img_url]
  return db.query(queryStr, queryValues)
  .then(({rows}) => {
   return rows[0]
  })
  .then(article => {
    return this.selectArticleByID(article.article_id)
  })
}

exports.removeArticleByID = (id) => {
  const articleQueryStr = `DELETE from articles
                           WHERE article_id = $1`
                    
  const commentQueryStr = `DELETE from comments
                           WHERE article_id = $1`

  return db.query(commentQueryStr, [id])
  .then(()=>{
    return db.query(articleQueryStr, [id])
  })
  
  
}