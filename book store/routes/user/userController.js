var express = require("express");
var router = express.Router();
const pool = require("../../config/dbConfig");
const userService = require("./userService");
const userservice = require("./userService");
const orderService = require("../order/orderService");
const couponservice = require("../coupon/couponservice");
const multer = require("multer");
const { application } = require("express");
const bookService = require("../book/bookService");
const upload = multer({ dest: "./img" });
router.use("/image", express.static("./img"));
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

//카드 등록 페이지
router.get("/add-card", async function (req, res) {
  res.render("main/addCard");
});

//카드 등록 post
router.post("/add-card", async function (req, res) {
  const userNum = req.session.user_num;
  try {
    if (req.body) {
      const result = await userservice.insertCard(req.body, userNum);

      res.send(`<script type="text/javascript">alert("카드 등록이 완료되었습니다!");
              document.location.href="/user/mypage";</script>`);
    }
  } catch (error) {
    res.redirect("/user/myPage");
  }
});

//주소 등록 페이지
router.get("/add-address", async function (req, res) {
  res.render("main/addAddress");
});

//카드 등록 post
router.post("/add-address", async function (req, res) {
  const userNum = req.session.user_num;
  try {
    if (req.body) {
      const result = await userservice.insertAddress(req.body, userNum);

      res.send(`<script type="text/javascript">alert("주소 등록이 완료되었습니다!");
              document.location.href="/user/mypage";</script>`);
    }
  } catch (error) {
    res.redirect("/user/myPage");
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
//마이페이지 가져오기
router.get("/myPage", async function (req, res) {
  userNum = req.session.user_num;
  const result = await couponservice.getOwnCoupon(userNum);
  return res.render("main/myPage", {
    result: result,
  });
});

const dateFormat = (day) => {
  const str = new Date(day);
  return [str.getFullYear(), str.getMonth(), str.getDate()].join("-");
};

//커뮤니티 GET
router.get("/community", async function (req, res) {
  const is_logined = req.session.user_num === undefined ? false : true;
  var moment = require("moment");
  const board = await userService.getAllBoard();
  const result = await userService.getAllPost();
  const rank = await userService.getEventPostRank();
  return res.render("post/community", {
    momment: moment,
    is_logined,
    board: board,
    rank: rank,
    result: result.map((item) => {
      return { ...item, createdAt: dateFormat(item.createdAt) };
    }),
  });
});
//게시글 상세정보
router.get("/post/:postTitle", async function (req, res) {
  const is_logined = req.session.user_num === undefined ? false : true;
  const postTitle = req.params.postTitle;
  const [result] = await userService.getPostDetail(postTitle);
  return res.render("post/detail", {
    is_logined,
    result: result,
  });
});
//좋아요 기능
router.post("/post/:postTitle", async function (req, res) {
  const is_logined = req.session.user_num === undefined ? false : true;
  const postTitle = req.params.postTitle;
  const [result] = await userService.getPostDetail(postTitle);

  await userService.addPostRecommend(result.num);
  return res.render("post/detail", {
    is_logined,
    result: result,
  });
});
//게시판 분류
router.get("/detail/:category", async function (req, res) {
  const is_logined = req.session.user_num === undefined ? false : true;
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
      is_logined,
      board: board,
      result: result2.map((item) => {
        return { ...item, createdAt: dateFormat(item.createdAt) };
      }),
    });
  } else {
    return res.render("post/boardDetail", {
      is_logined,
      board: board,
      result: result.map((item) => {
        return { ...item, createdAt: dateFormat(item.createdAt) };
      }),
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
                  document.location.href="/user/community";</script>`);
        }
      } catch (error) {
        res.redirect("/book/book-main");
      }
    }
  } catch (error) {
    res.redirect("/book/book-main");
  }
});
// // 이미지 업로드
// router.post("/upload", function (req, res) {
//   var name = "";
//   var filePath = "";
//   var form = new formidable.IncomingForm();
//   form.parse(req, function (err, fields, files) {
//     name = fields.name;
//   });
//   form.on("end", function (fields, files) {
//     for (var i = 0; i < this.openedFiles.length; i++) {
//       var temp_path = this.openedFiles[i].path;
//       var file_name = this.openedFiles[i].name;
//       var index = file_name.indexOf("/");
//       var new_file_name = file_name.substring(index + 1);
//       var new_location = "/static/img/" + name + "/";
//       var db_new_location = "/static/img/" + name + "/";
//       //실제 저장하는 경로와 db에 넣어주는 경로로 나눠 주었는데 나중에 편하게 불러오기 위해 따로 나눠 주었음
//       filePath = db_new_location + file_name;
//       fs.copy(temp_path, new_location + file_name, function (err) {
//         // 이미지 파일 저장하는 부분임
//         if (err) {
//           console.error(err);
//         }
//       });
//     }
//   });
// });

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
