var express = require("express");

var router = express.Router();
const adminservice = require("./adminService");

// 책 등록 GET
router.get("/addBook", async function (req, res) {
  res.render("book/addBook");
});

//책 등록 POST
router.post("/addBook", async function (req, res) {
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
router.get("/book-main", async function (req, res) {
  const [result] = await pool.query("SELECT * FROM book ");

  return res.render("book/book-main", {
    result: result,
  });
});

//도서 검색
router.post("/book-search", async function (req, res) {
  const search_title = req.body.book_name; //검색어
  const [result] = await pool.query(
    "SELECT * FROM book WHERE book_name LIKE '%" + search_title + "%'"
  );

  return res.render("book/book-search", {
    result: result,
  });
});

// 쿠폰 부여 GET
router.get("/giveCoupon", async function (req, res) {
  res.render("admin/giveCoupon");
});
//쿠폰 등록 POST
router.post("/giveCoupon", async function (req, res) {
  try {
    if (req.body) {
      const result = await adminservice.giveCoupon(req.body);
      res.send(`<script type="text/javascript">alert("등록이 완료되었습니다!");
                  document.location.href="/";</script>`);
    }
  } catch (error) {
    res.redirect("coupon/addCoupon");
  }
});

module.exports = router;
