var express = require("express");
const pool = require("../../config/dbConfig");
var router = express.Router();
const bookservice = require("./bookService");
const orderService = require("../order/orderService");
const sequelize = require("sequelize");
const couponService = require("../coupon/couponService");
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
      res.send(`<script type="text/javascript">alert("등록이 완료되었습니다!");
              document.location.href="/";</script>`);
    }
  } catch (error) {
    res.redirect("book/addBook");
  }
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

//도서 상세정보
router.get("/detail/:bookname", async function (req, res) {
  const is_logined = req.session.user_num === undefined ? false : true;
  const [[arr]] = await pool.query(
    "SELECT * FROM book WHERE book_name = '" + req.params.bookname + "'"
  );
  let result = await bookservice.getBookRating(arr.book_num);
  console.log(result);
  return res.render("book/detail", {
    is_logined,
    result: result,
  });
});
//베스트 셀러 조회
router.get("/bestSeller", async function (req, res) {
  const is_logined = req.session.user_num === undefined ? false : true;
  const result = await bookservice.getBestSeller();
  return res.render("book/bestSeller", {
    is_logined,
    result: result,
  });
});
//도서 전체 조회
router.get("/bookList", async function (req, res) {
  const is_logined = req.session.user_num === undefined ? false : true;
  const result = await bookservice.getBookList();
  return res.render("book/bookList", {
    is_logined,
    result: result,
  });
});
//이벤트 당첨자 주문목록 조회(*메인 기능)
router.get("/EliteSeller", async function (req, res) {
  const couponNum = await couponService.getEventCouponNum();
  const orderNum = await bookservice.getEliteOrderNum(couponNum.num);
  const bookNum = await bookservice.getEliteSeller(orderNum.order_num);
  let result = [];
  for (let i = 0; i < bookNum.length; i++) {
    result.push(await bookservice.getBookForNum(bookNum[i].book_book_num));
  }
  return res.render("book/eliteSeller", {
    result: result,
  });
});
//이벤트 당첨자 주문목록 조회(*메인 기능)
router.get("/eventCouponSeller", async function (req, res) {
  const bookOrder = await bookservice.getEliteCouponSeller();
  let result = [];
  for (let i = 0; i < bookOrder.length; i++) {
    result.push(await bookservice.getBookForNum(bookOrder[i].Book_book_num));
  }
  return res.render("book/eliteSeller", {
    result: result,
  });
});
module.exports = router;
