var express = require("express");
const pool = require("../../config/dbConfig");
const userService = require("./userService");
var router = express.Router();
const userservice = require("./userService");
const orderService = require("../order/orderService");
const couponservice = require("../coupon/couponservice");

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
              document.location.href="/user/login";</script>`);
    }
  } catch (error) {
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
      req.session.user_num = result[0].user_num;
      req.session.user_id = result[0].user_id;
      // 세션 스토어에 적용하는 작업
      req.session.save(() => {
        if (req.session.user_num === 0) {
          res.render("admin/admin");
        } else res.redirect("/");
      });
    }
  } else {
    res.send(`<script type="text/javascript">alert("아이디와 비밀번호를 입력하세요!"); 
    document.location.href="/";</script>`);
  }
});
//쿠폰목록 가져오기
router.get("/myPage", async function (req, res) {
  userNum = req.session.user_num;
  const result = await couponservice.getOwnCoupon(userNum);
  return res.render("main/myPage", {
    result: result,
  });
});
//커뮤니티 GET
router.get("/community", async function (req, res) {
  const board = await userService.getAllBoard();
  const result = await userService.getAllPost();
  return res.render("post/community", {
    board: board,
    result: result,
  });
});
//게시글 상세정보
router.get("/post/:postTitle", async function (req, res) {
  const postTitle = req.params.postTitle;
  console.log(postTitle);
  const [result] = await userService.getPostDetail(postTitle);
  console.log(result);
  return res.render("post/detail", {
    result: result,
  });
});
//게시글 상세정보
router.post("/post/:postTitle", async function (req, res) {
  const postTitle = req.params.postTitle;
  const [result] = await userService.getPostDetail(postTitle);

  await userService.addPostRecommend(result.num);
  return res.render("post/detail", {
    result: result,
  });
});
//게시판 분류
router.get("/detail/:category", async function (req, res) {
  const board = await userService.getAllBoard();
  const category = req.params.category;
  const [{ num: boardNum }] = await userService.getBoardNum(category);
  let result = await userService.getBoardCategory(boardNum);
  let result2 = [];

  if (boardNum == 4 && req.query.isIngEvent === "true") {
    for (let i = 0; i < result.length; i++) {
      let temp = await userService.getIngPost(result[i].num);

      if (temp[0] != undefined) {
        result2.push(temp[0]);
      }
    }
    return res.render("post/boardDetail", {
      board: board,
      result: result2,
    });
  } else {
    return res.render("post/boardDetail", {
      board: board,
      result: result,
    });
  }
});

//글작성 GET
router.get("/add-post", async function (req, res) {
  if (req.query.isEvent === "true") {
    const result = await userService.getIngEvent();
    res.render("post/addPost", {
      isEvent: req.query.isEvent,
      result: result,
    });
  } else {
    res.render("post/addPost", {
      isEvent: req.query.isEvent,
    });
  }
});

// 글작성 post
router.post("/add-post", async function (req, res) {
  const userNum = req.session.user_num;
  const postInfo = { ...req.body, userNum };
  try {
    if (req.body) {
      try {
        if (req.body) {
          const result = await userService.insertPost(postInfo);
          res.send(`<script type="text/javascript">alert("등록이 완료되었습니다!");
                  document.location.href="/";</script>`);
        }
      } catch (error) {
        res.redirect("/book/book-main");
      }
    }
  } catch (error) {
    res.redirect("/book/book-main");
  }
});
// 리뷰등록
router.post("/add-review", async function (req, res) {
  const userNum = req.session.user_num;
  const reviewInfo = { ...req.body, userNum };
  console.log(reviewInfo);
  try {
    if (req.body) {
      try {
        if (req.body) {
          const result = await userService.insertReview(reviewInfo);
          res.send(`<script type="text/javascript">alert("등록이 완료되었습니다!");
                  document.location.href="/";</script>`);
        }
      } catch (error) {
        res.redirect("/book/book-main");
      }
    }
  } catch (error) {
    res.redirect("/book/book-main");
  }
});

//로그아웃
router.get("/logout", function (req, res) {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
