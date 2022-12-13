var express = require("express");
const pool = require("../../config/dbConfig");
var router = express.Router();
const couponservice = require("./couponservice");

//쿠폰 지급
router.get("/addCoupon", async function (req, res) {
  res.render("coupon/addCoupon");
});
//쿠폰 등록 POST
router.post("/addCoupon", async function (req, res) {
  try {
    if (req.body) {
      const result = await couponservice.insertCoupon(req.body);
      res.send(`<script type="text/javascript">alert("등록이 완료되었습니다!");
                document.location.href="/";</script>`);
    }
  } catch (error) {
    res.redirect("coupon/addCoupon");
  }
});

module.exports = router;
