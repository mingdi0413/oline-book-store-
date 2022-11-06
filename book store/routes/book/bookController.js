var express = require("express");
const pool = require("../../config/dbConfig");
var router = express.Router();
const bookservice = require("./bookService");
const sequelize = require("sequelize");
const Op = require("sequelize").Op;

// 책 등록 GET
router.get("/addBook", async function (req, res) {
  res.render("book/addBook");
});

//책 등록 POST
router.post("/addBook", async function (req, res) {
  try {
    if (req.body) {
      const result = await bookservice.insertBook(req.body);
      console.log(req.body);
      res.send(`<script type="text/javascript">alert("등록이 완료되었습니다!");
              document.location.href="/";</script>`);
    }
  } catch (error) {
    res.redirect("book/addBook");
  }
});

//도서 조회
router.get("/book-main", async function (req, res) {
  const [result] = await pool.query("SELECT * FROM book");
  console.log(result);

  return res.render("book/book-main", {
    result: result,
  });
});

//도서 검색
router.get("/book-search", async function (req, res) {
  // console.log(hi);
  const search_title = req.book_name; //검색어
  // console.log(search);
  const [result] = await pool.query(
    "SELECT * FROM book WHERE book_name LIKE '%" + search_title + "%'"
  );
  console.log(result);
  return res.render("book/book-main", {
    result: result,
  });
});

module.exports = router;
