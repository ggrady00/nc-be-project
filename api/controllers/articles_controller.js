const {
  selectArticleByID,
  selectAllArticles,
  updateArticleByID,
  insertArticle,
} = require("../models/articles_models");
const { chechExists, checkQueries } = require("../utils");

exports.getArticleByID = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleByID(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  let {topic, sort_by, order, limit, p} = req.query;

  if (!sort_by) sort_by = "created_at"
  if (!order) order = "desc"
  if (!limit) limit = 10
  if (!p) p = 1

  const promises = [checkQueries(sort_by, order), selectAllArticles(topic, sort_by, order, null, p)]

  if (topic) {
    promises.push(chechExists("topics", "slug", topic))
  }
  
  Promise.all(promises)
  .then((data)=>{
    const totalCount = data[1].articles.length
    return selectAllArticles(topic, sort_by, order, limit, p, totalCount)
  })
  .then((articles)=>{
    res.status(200).send(articles);
  })
  .catch(next)
};

exports.patchArticleByID = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
    selectArticleByID(article_id)
      .then((data) => {
        return +inc_votes + data.votes;
      })
      .then((votes) => {
        if (votes < 0) votes = 0
        return updateArticleByID(article_id, votes);
      })
      .then((article) => {
        res.status(200).send({ article });
      })
      .catch(next);
};

exports.postArticle = (req, res, next) => {
  const body = req.body
  insertArticle(body)
  .then((article)=>{
    res.status(201).send({article})
  })
  .catch(next)
}