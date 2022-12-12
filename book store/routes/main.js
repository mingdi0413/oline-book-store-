var express = require("express");
const pool = require("../config/dbConfig");
var router = express.Router();

router.get("/", async function (req, res, next) {
  const is_logined = req.session.user_num === undefined ? false : true;
  console.log("1");
  console.log(is_logined);
  const [result] = await pool.query("SELECT * FROM book ");
  return res.render("book/book-main", {
    is_logined,
    result: result,
  });
});

module.exports = router;
