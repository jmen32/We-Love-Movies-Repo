const router = require("express").Router()
const methodNotAllowed = require("../errors/methodNotAllowed")
const controller = require("./movies.controller")
const cors = require("cors")

router.route("/:movieId/reviews").get(controller.listReviews).all(methodNotAllowed);

router.route("/:movieId/theaters").get(controller.listTheaters).all(methodNotAllowed)

router.route("/:movieId").get(controller.read).all(methodNotAllowed)

router.route("/").get(cors(), controller.list).all(methodNotAllowed)

module.exports = router;