const { selectArticleByID } = require("../models/articles_models");
const {
  selectCommentsByID,
  insertCommentByID,
  removeCommentByID,
} = require("../models/comments.models");
const { checkCommentExists } = require("../utils");

exports.getCommentsByID = (req, res, next) => {
  const { article_id } = req.params;

  selectArticleByID(article_id)
    .then(() => {
      return selectCommentsByID(article_id);
    })
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentByID = (req, res, next) => {
  const { article_id } = req.params;
  const body = req.body;
  selectArticleByID(article_id)
    .then(() => {
      return insertCommentByID(article_id, body);
    })
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteCommentByID = (req, res, next) => {
  const { comment_id } = req.params;
  checkCommentExists(comment_id)
    .then(() => {
      return removeCommentByID(comment_id);
    })
    .then(() => {
      res.status(204).send()
    })
    .catch(next)
};
