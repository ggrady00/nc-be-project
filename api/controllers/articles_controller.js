const {
  selectArticleByID,
  selectAllArticles,
  updateArticleByID,
} = require("../models/articles_models");
const { chechExists } = require("../utils");

exports.getArticleByID = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleByID(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  const {topic, sort_by} = req.query;
  const promises = [selectAllArticles(topic, sort_by)]
  if (topic) {
    promises.push(chechExists("topics", "slug", topic))
  }
  Promise.all(promises)
  .then(([articles])=>{
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
