const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const port = 3036;
const session = require("express-session");
const FileStore = require("session-file-store")(session);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//로그인 세션 설정
app.use(
  session({
    secret: "Dn",
    resave: false,
    saveUninitialized: true,
    store: new FileStore(),
  })
);
app.use("/cart", require("./routes/cart"));
app.use("/order", require("./routes/order"));
app.use("/", require("./routes/main"));
app.use("/user", require("./routes/user"));
app.use("/book", require("./routes/book"));

//404 error
app.use((req, res, next) => {
  res.status(404).send("일치하는 주소가 없습니다.");
});

//500 상태 표시 후 에러 메시지 전송
app.use((req, res, next) => {
  res.status(500).send("서버에러입니다.!");
});

//port 접속 성공 로그
app.listen(port, function () {
  console.log("서버가 정상가동 됩니다! http://localhost:" + port);
});
