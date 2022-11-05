var express = require("express");
const pool = require("../../config/dbConfig");
var router = express.Router();
const bookservice = require("./bookService");

router.get("/addBook", async function (req, res) {
  console.log("ho");
  res.render("book/addBook");
});

//책 등록
router.post("/addBook", async function (req, res) {
  console.log("ho");
  try {
    if (req.body) {
      const result = await bookservice.insertBook(req.body);
      res.send(`<script type="text/javascript">alert("등록이 완료되었습니다!");
              document.location.href="/";</script>`);
    }
  } catch (error) {
    res.redirect("book/addBook");
  }
});
module.exports = router;
