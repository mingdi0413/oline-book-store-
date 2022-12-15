var express = require("express");

var router = express.Router();

const pool = require("../../config/dbConfig");
module.exports = {
  // 카트에서 주문 바로 했을 때
  getCartOrder: async (userNum) => {
    try {
      const conn = await pool.getConnection();
      const query = `
        SELECT  
           *
        FROM cart c
        join book b on b.book_num = c.book_book_num 
        where c.user_user_num = ?
      `;
      const [result] = await conn.query(query, [userNum]);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  // 책 바로 구매 진행할 경우
  getBookOrder: async (bookNum) => {
    try {
      const conn = await pool.getConnection();
      const query = `
        SELECT * FROM BOOK
        WHERE book_num = ?
      `;
      const [{ affectRows: result }] = await conn.query(query, [bookNum]);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  // 유저 카드 데이터 조회
  getCard: async (userNum) => {
    try {
      const conn = await pool.getConnection();
      const query = `
            SELECT * FROM card
            WHERE user_user_num = ?
          `;
      const [result] = await conn.query(query, [userNum]);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  // 유저 주소 데이터 조회
  getAddress: async (userNum) => {
    try {
      const conn = await pool.getConnection();
      const query = `
            SELECT * FROM address
            WHERE user_user_num = ?
          `;
      const [result] = await conn.query(query, [userNum]);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  //회원 카드 번호로 카드 정보 가져오기
  getCardPick: async (userNum, cardId) => {
    try {
      const conn = await pool.getConnection();
      const query = `
      SELECT card_id, card_valid_date, card_type FROM card c where c.User_user_num = ? and c. card_id = ?;
            `;
      const [[result]] = await conn.query(query, [userNum, cardId]);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  //우편번호로 주소 정보 가져오기
  getAddressDetail: async (zip_code, userNum) => {
    try {
      const conn = await pool.getConnection();
      const query = `
            SELECT zip_code,default_address,detail_address FROM address a
            WHERE a.user_user_num = ? and a.zip_code = ?
          `;
      const [[result]] = await conn.query(query, [userNum, zip_code]);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  // 책 판매량 증가
  plusBookSellCount: async (stock, book_num) => {
    try {
      const conn = await pool.getConnection();
      const query = `
                update book set sell_count = sell_count + ? where book_num = ?
              `;
      await conn.query(query, [stock, book_num]);
      conn.release();
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  // 총액계산
  plusOrder: async (price, order_num) => {
    try {
      const conn = await pool.getConnection();
      const query = `
            update orders set order_total = ? where order_num = ?
          `;
      await conn.query(query, [price, order_num]);
      conn.release();
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  // 쿠폰 사용처리
  useCoupon: async (userNum, couponId) => {
    try {
      const conn = await pool.getConnection();
      const query = `
            update own_coupon set useYN = 1 where user_user_num = ? and id = ? 
          `;
      await conn.query(query, [userNum, couponId]);
      conn.release();
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  // 총액 포인트 차감
  minusPoint: async (price, order_num) => {
    try {
      const conn = await pool.getConnection();
      const query = `
                update orders set minusPoint = ? where order_num = ?
              `;
      await conn.query(query, [price, order_num]);
      conn.release();
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  // 주문하기(쿠폰없을경우)
  insertOrder: async (orderInfo, userNum, addressInfo, cardInfo) => {
    try {
      const {} = orderInfo;
      const conn = await pool.getConnection();
      const query = `
              insert into orders(
                order_date,
                order_zip_code,
                order_default_address,
                order_detail_address,
                order_card_valid_date,
                order_card_num,
                order_card_type,
                order_total,
                user_user_num,
                minusPoint         
              ) values(
                NOW(),
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                0,
                ?,
                ?    
            )
            `;
      const [{ insertId: result }] = await conn.query(query, [
        addressInfo.zip_code,
        addressInfo.default_address,
        addressInfo.detail_address,
        cardInfo.card_valid_date,
        cardInfo.card_id,
        cardInfo.card_type,
        userNum,
        orderInfo.minusPoint,
      ]);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  // 주문하기(쿠폰존재)
  insertOrder2: async (orderInfo, userNum, addressInfo, cardInfo) => {
    try {
      const {} = orderInfo;
      const conn = await pool.getConnection();
      const query = `
              insert into orders(
                order_date,
                order_zip_code,
                order_default_address,
                order_detail_address,
                order_card_valid_date,
                order_card_num,
                order_card_type,
                order_total,
                user_user_num,
                minusPoint,  
                own_coupon_num
              ) values(
                NOW(),
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                0,
                ?,
                ?,    
                ?
            )
            `;
      const [{ insertId: result }] = await conn.query(query, [
        addressInfo.zip_code,
        addressInfo.default_address,
        addressInfo.detail_address,
        cardInfo.card_valid_date,
        cardInfo.card_id,
        cardInfo.card_type,
        userNum,
        orderInfo.minusPoint,
        orderInfo.own_coupon_num,
      ]);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  // 책 주문 저장하기
  insertBookOrder: async (order_num, orderBookInfo) => {
    try {
      const conn = await pool.getConnection();
      const query = `
              insert into book_order(
                Order_order_num,
                Book_book_num,
                book_order_price
              ) values(
                ?,
                ?,
                ?
            )
            `;
      const [{ affectRows: result }] = await conn.query(query, [
        order_num,
        orderBookInfo.book_book_num,
        orderBookInfo.book_price,
      ]);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  //  주문목록 불러오기
  getOrder: async (orderNum) => {
    try {
      const conn = await pool.getConnection();
      const query = `
      SELECT  
      * FROM orders where order_num = ?;
      `;
      const [[result]] = await conn.query(query, [orderNum]);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  //  주문상세 정보 불러오기
  getOrderDetail: async (orderNum) => {
    try {
      const conn = await pool.getConnection();
      const query = `
      SELECT  
      * FROM book_order bo join book b on b.book_num = bo.book_book_num where bo.Order_order_num = ?
      `;
      const [result] = await conn.query(query, [orderNum]);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  // orderNUm 받아오기
  getorderNum: async (userNum) => {
    try {
      const conn = await pool.getConnection();
      const query = `
          SELECT order_num from orders
          WHERE user_user_num = ?
        `;
      const [result] = await conn.query(query, [userNum]);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
