var express = require("express");

var router = express.Router();
const adminservice = require("./adminController");

//도서 추가
router.post("/addbook", async function (req, res) {
  try {
    const result = await userservice.insertBook(req.body);
    res.status(200).json({ status: 200, data: result, message: "Success" });
  } catch (error) {
    return res.status(500).json({ status: 500, message: "fail" });
  }
});

module.exports = router;
