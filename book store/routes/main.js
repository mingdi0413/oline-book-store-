var express = require("express");

var router = express.Router();

router.get("/", function (req, res, next) {
  res.render("main/store");
});

// router.get("/login", function (req, res, next) {
//   res.render("main/login");
// });

// router.get("/sign-up", function (req, res, next) {
//   res.render("main/sign-up");
// });

module.exports = router;
