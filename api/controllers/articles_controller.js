const { selectArticleByID, selectAllArticles } = require("../models/articles_models");

exports.getArticleByID = (req, res, next) => {
    const { article_id } = req.params
    selectArticleByID(article_id)
    .then(article => {
        res.status(200).send({article})
    })
    .catch(next)
};

exports.getAllArticles = (req, res, next) => {
    selectAllArticles()
    .then(articles => {
        res.status(200).send({articles})
    })
}