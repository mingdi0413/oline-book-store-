// var express = require("express");
// const pool = require("../../config/dbConfig");
// const orderService = require("./orderService");
// var router = express.Router();

// // 이때 json을 order, order book 나누는게 좋음 ex)
// /**
//  *
//  * {
//  *  order{
//  *    order_num : 1,
//  *    order_name : "name"
//  *  }
//  *  orderBook[
//  *    {
//  *      bookNum : 1
//  *      bookName : "name"
//  *    },
//  *    {
//  *      bookNum : 2
//  *      bookName : "name2"
//  *    }
//  *  ]
//  * }
//  */
// //주문하기
// router.post("/order", async function (req, res) {
//   const userNum = req.session.user_num;
//   // const orderInfo = req.body.order;
//   // const orderBookInfo = req.body.orderBook;
// //   try{
// //     if(req.body){
// //       const result = await orderService.insertOrder(

// //       );
// //     }
// //   }

// //   // const result = await orderService.insertOrder(
// //   //   orderInfo,
// //   //   userNum
// //   // );

// //   // orderBookInfo.forEach(e => {
// //   //   await orderService.insertBookOrder(e);
// //   // })

// // // }
// // );

// // 주문 정보 불러오기
// router.get("/orderlist", async function (req, res) {
//   const usernum = req.session.user_num;
//   const bookNum = req.params.book; // 카트에서 오는지 북에서 들고오는지 확인

//   if(book != null){
//     const result = await orderService.getBookOrder(
//       bookNum
//     );
//   }else{
//     const result = await orderService.getCartOrder(
//       userNum
//     )
//   }
// });

// // 카드 정보 불러오기 (Modal 추천)
// router.get("/order/card", async function (req, res) {
//   const userNum = req.session.user_num;

//     const result = await orderService.getCard(
//       userNum
//     );
// });;

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
// module.exports = router;
