const { getAllUsers, getUserByUsername } = require("../controllers/users_controllers")

const usersRouter = require("express").Router()

usersRouter
.route("/")
.get(getAllUsers)

usersRouter
.route("/:username")
.get(getUserByUsername)


module.exports = usersRouter