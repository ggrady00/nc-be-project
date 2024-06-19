const { getAllUsers } = require("../controllers/users_controllers")

const usersRouter = require("express").Router()

usersRouter
.route("/")
.get(getAllUsers)

module.exports = usersRouter