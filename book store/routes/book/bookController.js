var express = require("express");
const pool = require("../../config/dbConfig");
var router = express.Router();
const bookservice = require("./bookService");

//책 등록
router.post("/addBook", async function (req, res) {
  try {
    if (req.body) {
      const result = await userservice.insertBook(req.body);
      res.send(`<script type="text/javascript">alert("등록이 완료되었습니다!");
              document.location.href="/";</script>`);
    }
  } catch (error) {
    res.redirect("main/addBook");
  }
});
