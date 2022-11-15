var express = require("express");
const pool = require("../../config/dbConfig");
var router = express.Router();
const userservice = require("./userService");

//회원가입 페이지
router.get("/sign-up", async function (req, res) {
  res.render("main/sign-up");
});

//회원가입
router.post("/sign-up", async function (req, res) {
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
  res.render("main/login");
});

//로그인 POST
router.post("/login", async function (req, res) {
  const userId = req.body.id;
  const password = req.body.pw;

  if (userId && password) {
    let [result] = await pool.query(
      "SELECT * FROM user WHERE user_id = ? AND user_password = ?",
      [userId, password]
    );
    if (result.length === 1) {
      console.log(result);
      req.session.user_num = result[0].user_num;
      req.session.user_id = result[0].user_id;
      req.session.save(() => {
        // 세션 스토어에 적용하는 작업
        res.redirect("/book/book-main");
      });
    }
  } else {
    res.send(`<script type="text/javascript">alert("아이디와 비밀번호를 입력하세요!"); 
    document.location.href="/";</script>`);
  }
});

//로그아웃
router.get("/logout", function (req, res) {
  res.redirect("/store");
  req.session.destroy();
});

module.exports = router;
