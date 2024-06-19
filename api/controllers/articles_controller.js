const {
  selectArticleByID,
  selectAllArticles,
  updateArticleByID,
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
  let {topic, sort_by, order} = req.query;

  if (!sort_by) sort_by = "created_at"
  if (!order) order = "desc"

  const promises = [checkQueries(sort_by, order)]

  if (topic) {
    promises.push(chechExists("topics", "slug", topic))
  }
  
  Promise.all(promises)
  .then(()=>{
    return selectAllArticles(topic, sort_by, order)
  })
  .then((articles)=>{
    res.status(200).send({ articles });
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
