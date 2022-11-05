var express = require("express");
const pool = require("../../config/dbConfig");
var router = express.Router();
const userservice = require("./userService");

//회원가입
router.post("/sign-up", async function (req, res) {
  console.log(req.body);
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
//로그인 GET

//로그인 POST
router.post("/login", function (req, res) {
  const userId = req.body.id;
  const password = req.body.pw;
  if (userId && password) {
    pool.query("SELECT * FROM user WHERE user_id = ? AND user_password = ?", [
      userId,
      password,
    ]),
      function (error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
          // db에서의 반환값이 있으면 로그인 성공
          request.session.is_logined = true; // 세션 정보 갱신
          request.session.nickname = username;
          request.session.save(function () {
            response.redirect(`/`);
          });
        } else {
          response.send(`<script type="text/javascript">alert("로그인 정보가 일치하지 않습니다."); 
          document.location.href="/auth/login";</script>`);
        }
      };
  } else {
    response.send(`<script type="text/javascript">alert("아이디와 비밀번호를 입력하세요!"); 
    document.location.href="/auth/login";</script>`);
  }
});

//   const query = "select * from user where user_id='" + req.body.id + "';";
//   console.log(query);

//   try {
//     const result = await userservice.checkUser(req.body);
//     console.log(result);
//     if (result === 0) {
//       console.log("존재하지 않는 계정입니다.");
//       res.redirect("/login");
//     } else {
//       console.log("로그인 성공하셨습니다.");
//       res.render("main/store");
//     }
//   } catch (error) {
//     console.log("비밀번호 틀림");
//     res.redirect("/login");
//   }
// });

//로그아웃
router.get("/logout", function (req, res) {
  res.redirect("/store");
});

module.exports = router;
