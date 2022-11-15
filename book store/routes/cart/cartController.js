var express = require("express");
const pool = require("../../config/dbConfig");
var router = express.Router();
const cartService = require("./cartService");
const session = require("express-session");
const { query } = require("../../config/dbConfig");
const FileStore = require("session-file-store")(session);

// 장바구니 책 조회
router.get("/cart_list", async function (req, res) {
  const result = await cartService.getCartBook(req.session.user_num); //책 리스트 전달
  console.log(result);
  return res.render("cart/cart_list", {
    result: result,
  });
});

// 장바구니 책 등록 ( 장바구니 번호와 책번호 요청)
router.post("/cart/book_add", async function (req, res) {
  try {
    if (req.body) {
      try {
        if (req.body) {
          const result = await cartService.addCart(
            req.session.user_num,
            req.body.book_num
          );
          res.send(`<script type="text/javascript">alert("등록이 완료되었습니다!");
                  document.location.href="/book/book-main";</script>`);
        }
      } catch (error) {
        res.redirect("/book/book-main");
      }
    }
  } catch (error) {
    res.redirect("/book/book-main");
  }
});

// 장바구니 책 삭제 ( 장바구니 번호와 책번호 요청)
router.post("/cart/book_delete", async function (req, res) {
  console.log("1");
  try {
    if (req.body) {
      const result = await cartService.deleteCartBook(req.body.cart_num);
      res.send(`<script type="text/javascript">alert("장바구니에서 책 삭제가 완료되었습니다!");
              document.location.href="/cart/cart_list";</script>`);
    }
  } catch (error) {
    res.redirect("/book/addBook");
  }
});

module.exports = router;
