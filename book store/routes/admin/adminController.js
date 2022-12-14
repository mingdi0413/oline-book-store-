var express = require("express");

var router = express.Router();
const adminservice = require("./adminService");
const bookservice = require("../book/bookService");

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
              document.location.href="/user/login";</script>`);
    }
  } catch (error) {
    res.redirect("book/addBook");
  }
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
                  document.location.href="/admin";</script>`);
    }
  } catch (error) {
    res.redirect("coupon/addCoupon");
  }
});

// 이벤트 등록 GET
router.get("/addEvent", async function (req, res) {
  res.render("admin/addEvent");
});

//이벤트 등록 POST
router.post("/addEvent", async function (req, res) {
  try {
    if (req.body) {
      const result = await adminservice.insertEvent(req.body);
      res.send(`<script type="text/javascript">alert("등록이 완료되었습니다!");
              document.location.href="/admin/admin";</script>`);
    }
  } catch (error) {
    res.redirect("admin/admin");
  }
});
module.exports = router;
