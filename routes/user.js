const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  logout,
  forgetPassword,
  resetPassword,
} = require("../controller/userController");

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgetpassword").post(forgetPassword);
router.route("/password/reset/:token").post(resetPassword);

module.exports = router;
