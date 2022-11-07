var express = require("express");
const pool = require("../../config/dbConfig");
var router = express.Router();
const cartService = require("./cartService");
const session = require("express-session");
const FileStore = require("session-file-store")(session)
// const sequelize = require("sequelize");
// const Op = require("sequelize").Op;


// 장바구니 등록 GET (장바구니 페이지 불러올때 체크하면됩니다. 자동생성)
router.get("/cart", async function (req, res) {
    try {
        if (req.body) {
            const result = await cartService.checkCart(req.body);
            if(result == null){ // 카트가 없을때 카트만들기 (구동을 안해서 이게 맞는지 모르겠음 != 맞는지 확인 부탁합니다~)
                cartService.addCart(req.session.user_num) // 카트 생성하기 (표기법 바꾸고싶지만.. 이걸로 통일 되어있길래 했슴다)
            }

            const cartNum = await  cartService.selectCartNum(req.session.user_num) // 카트 번호 받기

            res.send(`<script type="text/javascript">alert("등록이 완료되었습니다!"); // 이부분은 view 생기면 넣으세요 ~
              document.location.href="/";</script>`);
        }
    } catch (error) {
        res.redirect("book");
    }
});


// 장바구니 책 불러오기 (장바구니 번호 요청)
router.get("/cart/book", async function (req, res) {
    try {
        if (req.body) {
            const result = await cartService.selectCartNum(req.body[0]); //책 리스트 전달됩니다.

            res.send(`<script type="text/javascript">alert("등록이 완료되었습니다!");
              document.location.href="/";</script>`);
        }
    } catch (error) {
        res.redirect("book");
    }
});

// 장바구니 책 등록 ( 장바구니 번호와 책번호 요청)
router.post("/cart/book/add", async function (req, res) {
    try {
        if (req.body) {
            const result = await cartService.addCartBook(req.body[0], req.body[1]);

            res.send(`<script type="text/javascript">alert("등록이 완료되었습니다!");
              document.location.href="/";</script>`);
        }
    } catch (error) {
        res.redirect("book");
    }
});

// 장바구니 책 삭제 ( 장바구니 번호와 책번호 요청)
router.post("/cart/book/delete", async function (req, res) {
    try {
        if (req.body) {
            const result = await cartService.deleteCartBook(req.body[0], req.body[1]);
            res.send(`<script type="text/javascript">alert("등록이 완료되었습니다!");
              document.location.href="/";</script>`);
        }
    } catch (error) {
        res.redirect("book/addBook");
    }
});