var express = require("express");
const pool = require("../../config/dbConfig");
var router = express.Router();
const userservice = require("./userService");

//회원가입 페이지
router.get("/sign-up", async function (req, res) {
  console.log("hi");
  res.render("main/sign-up");
});

//회원가입
router.post("/sign-up", async function (req, res) {
  console.log(req.body);
  try {
    if (req.body) {
      const result = await userservice.insertUser(req.body);
      res.send(`<script type="text/javascript">alert("회원가입이 완료되었습니다!");
              document.location.href="/user/sign-up";</script>`);
    }
  } catch (error) {
    console.log("체크");
    res.redirect("main/sign-up");
  }
});

//로그인 GET
router.get("/login", async function (req, res) {
  console.log("h");
  res.render("main/login");
});

//로그인 POST
router.post("/login", async function (req, res) {
  console.log("hi");
  console.log(req.body);
  const userId = req.body.id;
  const password = req.body.pw;
  if (userId && password) {
    let [result] = await pool.query(
      "SELECT * FROM user WHERE user_id = ? AND user_password = ?",
      [userId, password]
    );
    if (result.length == 1) {
      req.session.user_id = result[0].user_id;
      console.log(req.session.user_id);
      res.redirect("/book/book-main");
    }
  } else {
    res.send(`<script type="text/javascript">alert("아이디와 비밀번호를 입력하세요!"); 
    document.location.href="/auth/login";</script>`);
  }
});

//로그아웃
router.get("/logout", function (req, res) {
  res.redirect("/store");
});

module.exports = router;
