const { selectAllUsers } = require("../models/users_models")

exports.getAllUsers = (req, res, next) => {
    selectAllUsers()
    .then(users => {
        res.status(200).send({users})
    })
    .catch(next)
}