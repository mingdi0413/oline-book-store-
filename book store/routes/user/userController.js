var express = require("express");
const pool = require("../../config/dbConfig");
var router = express.Router();
const userservice = require("./userService");

//회원가입
router.post("/sign-up", async function (req, res) {
  try {
    if (req.body) {
      const result = await userservice.insertUser(req.body);
      res.send(`<script type="text/javascript">alert("회원가입이 완료되었습니다!");
              document.location.href="/";</script>`);
    }
  } catch (error) {
    res.redirect("main/sign-up");
  }
});

//로그인
router.post("/login", async function (req, res) {
  const id = req.body.id;

  const query = "select * from user where user_id='" + id + "';";
  console.log(query);
  router.post("/login", async (req, res) => {
    try {
      const result = await UserService.checkUser(req.body);
      console.log(result);
      if (result === 0) {
        console.log("존재하지 않는 계정입니다.");
        res.redirect("/login");
      } else {
        console.log("로그인 성공하셨습니다.");
        res.cookie("user", id, {
          expires: new Date(Date.now + 900000),
          httpOnly: true,
        });
        res.render("/store");
      }
    } catch (error) {
      console.log("비밀번호 틀림");
      res.redirect("/login");
    }
  });
});

//로그아웃
router.get("/logout", function (req, res) {
  res.redirect("/store");
});

module.exports = router;
