/**
 *! HOME ROUTES
 */
const express = require("express");
const router = express.Router();
const { home } = require("../controller/homeController");

router.route("/").get(home);

module.exports = router;
