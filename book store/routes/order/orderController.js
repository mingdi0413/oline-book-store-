var express = require("express");
const pool = require("../../config/dbConfig");
const orderService = require("./orderService");
const cartService = require("../cart/cartService");
const userService = require("../user/userService");
const couponservice = require("../coupon/couponservice");
var router = express.Router();

const dateFormat = (day) => {
  const str = new Date(day);
  return [str.getFullYear(), str.getMonth(), str.getDate()].join("-");
};

//주문 정보 입력 페이지로이동
router.post("/addorder", async function (req, res) {
  const userNum = req.session.user_num;
  const result = await couponservice.getCanUseCoupon(userNum);
  const card = await orderService.getCard(userNum);
  const address = await orderService.getAddress(userNum);
  return res.render("order/addorder", {
    address: address,
    card: card,
    result: result,
  });
});

//주문 하기
router.post("/order", async function (req, res) {
  const userNum = req.session.user_num;
  const orderInfo = req.body;
  const couponNum = req.body.own_coupon_num;
  console.log(orderInfo);
  const addressInfo = await orderService.getAddressDetail(
    orderInfo.order_zip_code,
    userNum
  );
  const cardInfo = await orderService.getCardPick(userNum, orderInfo.card_id);
  try {
    if (userNum) {
      const cartBooks = await cartService.getCartBook(req.session.user_num); //책 리스트 전달

      //쿠폰 있을경우
      if (couponNum != 0) {
        const order_num = await orderService.insertOrder2(
          orderInfo,
          userNum,
          addressInfo,
          cardInfo
        );
        let order_total = 0;
        for (let index = 0; index < cartBooks.length; index++) {
          order_total += cartBooks[index].book_price;
          await orderService.insertBookOrder(order_num, cartBooks[index]);
        }
        const [couponId] = await couponservice.getCouponId(couponNum);
        await orderService.useCoupon(userNum, couponId.id);
        let [minus_total_coupon] = await couponservice.getCouponDiscount(
          couponId.id
        );
        order_total -= minus_total_coupon.discount;
        await orderService.plusOrder(order_total, order_num);
      }
      //쿠폰없을 경우
      else {
        const order_num = await orderService.insertOrder(
          orderInfo,
          userNum,
          addressInfo,
          cardInfo
        );
        let order_total = 0;
        for (let index = 0; index < cartBooks.length; index++) {
          order_total += cartBooks[index].book_price;
          await orderService.insertBookOrder(order_num, cartBooks[index]);
        }

        await orderService.plusOrder(order_total, order_num);
      }
      await cartService.deleteUserBook(req.session.user_num);

      res.send(`<script type="text/javascript">alert("주문이 완료되었습니다!");
      document.location.href="/";</script>`);
    }
  } catch (error) {
    console.log(error);
    res.redirect("/cart/cart_list");
  }
});

// 주문 상세정보 불러오기
router.get("/order_detail", async function (req, res) {
  const order_num = req.query.order_num;
  const is_logined = req.session.user_num === undefined ? false : true;
  const result = await orderService.getOrderDetail(order_num);

  return res.render("order/order_detail", {
    is_logined,
    result: result.map((item) => {
      return { ...item, order_date: dateFormat(item.order_date) };
    }),
  });
});

// 주문 정보 불러오기 장바구니에서 구매
router.get("/order_list", async function (req, res) {
  const is_logined = req.session.user_num === undefined ? false : true;
  const usernum = req.session.user_num;
  const orderNums = await orderService.getorderNum(usernum);

  let result = [];
  for (let i = 0; i < orderNums.length; i++) {
    result.push(await orderService.getOrder(orderNums[i].order_num));
  }
  return res.render("order/order_list", {
    is_logined,
    result: result.map((item) => {
      return { ...item, order_date: dateFormat(item.order_date) };
    }),
  });
});

//주문정보 불러오기 책에서 바로구매
router.get("/order_list/:bookNum", async function (req, res) {
  const usernum = req.session.user_num;
  const book = req.params.bookNum; // 카트에서 오는지 북에서 들고오는지 확인
  const result = await orderService.getBookOrder(bookNum);
});

//주문 정보 수정 페이지로이동
router.get("/order_refund", async function (req, res) {
  const userNum = req.session.user_num;

  const orderNum = await orderService.getorderNum(userNum);
  let ordersnum = orderNum[0].order_num;
  const result = await orderService.getOrder(ordersnum);
  return res.render("order/order_refund", {
    result: result,
  });
});

// 주문목록에서 삭제
router.get("/order/order_delete", async function (req, res) {
  try {
    if (req.query) {
      const result = await orderService.deleteOrder(req.query.book_book_num);
      res.send(`<script type="text/javascript">alert("주문에서 책 삭제가 완료되었습니다!");
              document.location.href="/order/order_list";</script>`);
    }
  } catch (error) {
    res.redirect("/order/order_refund");
  }
});

// // 카드 정보 불러오기 (Modal 추천)
// router.get("/order/card", async function (req, res) {
//   const userNum = req.session.user_num;

//   const result = await orderService.getCard(userNum);
// });

// // 주소 정보 불러오기 (Modal 추천)
// router.get("/order/card", async function (req, res) {
//   const userNum = req.session.user_num;

//     const result = await orderService.getAddress(
//       userNum
//     );
// });

// // 카드 정보 가져오기
// router.get("/order/card/pick", async function (req, res) {
//   const userNum = req.session.user_num;

//     const result = await orderService.getCardPick(
//       req.body.cardNum
//     );
// });

// 주소 정보 가져오기
router.get("/order/card/pick", async function (req, res) {
  const userNum = req.session.user_num;

  const result = await orderService.getAddressPick(req.body.addressNum);
});
module.exports = router;
