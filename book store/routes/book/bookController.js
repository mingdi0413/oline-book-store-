var express = require("express");
const pool = require("../../config/dbConfig");
var router = express.Router();
const bookservice = require("./bookService");

// 책 등록 GET
router.get("/addBook", async function (req, res) {
  res.render("book/addBook");
});

//책 등록 POST
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

//도서 조회
router.get("/read", async function (req, res) {
  console.log("hi");
  pool.query("SELECT * FROM book", (err1, book) => {
    if (err1) throw err1;
    res.json(book);
  });
});

module.exports = router;
