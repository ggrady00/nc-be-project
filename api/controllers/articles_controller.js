const {
  selectArticleByID,
  selectAllArticles,
  updateArticleByID,
} = require("../models/articles_models");

exports.getArticleByID = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleByID(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  selectAllArticles().then((articles) => {
    res.status(200).send({ articles });
  });
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
