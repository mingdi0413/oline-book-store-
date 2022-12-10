var express = require("express");
const pool = require("../../config/dbConfig");
const orderService = require("./orderService");
const cartService = require("../cart/cartService");
const userService = require("../user/userService");
const couponservice = require("../coupon/couponservice");
var router = express.Router();

// 이때 json을 order, order book 나누는게 좋음 ex)
/**
 *
 * {
 *  order{
 *    order_num : 1,
 *    order_name : "name"
 *  }
 *  orderBook[
 *    {
 *      bookNum : 1
 *      bookName : "name"
 *    },
 *    {
 *      bookNum : 2
 *      bookName : "name2"
 *    }
 *  ]
 * }
 */

//주문 정보 입력 페이지로이동
router.post("/addorder", async function (req, res) {
  const userNum = req.session.user_num;
  const result = await couponservice.getCanUseCoupon(userNum);
  return res.render("order/addorder", {
    result: result,
  });
});

//주문 하기
router.post("/order", async function (req, res) {
  const userNum = req.session.user_num;
  const orderInfo = req.body;
  const couponNum = req.body.own_coupon_num;
  try {
    if (userNum) {
      const cartBooks = await cartService.getCartBook(req.session.user_num); //책 리스트 전달
      const order_num = await orderService.insertOrder(orderInfo, userNum);
      let order_total = 0;
      for (let index = 0; index < cartBooks.length; index++) {
        order_total += cartBooks[index].book_price;
        await orderService.insertBookOrder(order_num, cartBooks[index]);
      }
      //쿠폰 있을경우
      if (couponNum != 0) {
        const couponId = await couponservice.getCouponId(couponNum);
        console.log(couponId);
        await orderService.useCoupon(userNum, couponId);
      }
      //쿠폰없을 경우
      else {
        await orderService.plusOrder(order_total, order_num);
      }
      await cartService.deleteUserBook(req.session.user_num);

      res.send(`<script type="text/javascript">alert("주문이 완료되었습니다!");
      document.location.href="/book/book-main";</script>`);
    }
  } catch (error) {
    console.log(error);
    res.redirect("/cart/cart_list");
  }
});

// 주문 상세정보 불러오기
router.get("/order_detail", async function (req, res) {
  const order_num = req.query.order_num;
  const result = await orderService.getOrderDetail(order_num);

  return res.render("order/order_detail", {
    result: result,
  });
});

// 주문 정보 불러오기 장바구니에서 구매
router.get("/order_list", async function (req, res) {
  const usernum = req.session.user_num;
  console.log(req.query);
  const orderNums = await orderService.getorderNum(usernum);

  let result = [];
  for (let i = 0; i < orderNums.length; i++) {
    result.push(await orderService.getOrder(orderNums[i].order_num));
  }
  return res.render("order/order_list", {
    result: result,
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

// // 주소 정보 가져오기
// router.get("/order/card/pick", async function (req, res) {
//   const userNum = req.session.user_num;

//     const result = await orderService.getAddressPick(
//       req.body.addressNum
//     );
// });
module.exports = router;
