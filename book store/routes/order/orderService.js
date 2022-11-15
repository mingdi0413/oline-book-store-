var express = require("express");

var router = express.Router();

const pool = require("../../config/dbConfig");
module.exports = {
  // 카트에서 주문 바로 했을 때
  getCartOrder: async (userNum) => {
    try {
      const { order_date, order_total } = orderInfo;
      const conn = await pool.getConnection();
      const query = `
        SELECT  
            cart_total,
            book_price,
            book_name,
            book_author,
            book_stock
        FROM cart c
        join book b on b.book_num = c.book_book_num 
        where c.user_user_num = ?
      `;
      const [{ affectRows: result }] = await conn.query(query, [userNum]);
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
      const [{ affectRows: result }] = await conn.query(query, [userNum]);
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
      const [{ affectRows: result }] = await conn.query(query, [userNum]);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  // 카드 데이터 뽑기 dom 접근하여 form에 추가하기
  getCardPick: async (cardNum) => {
    try {
      const conn = await pool.getConnection();
      const query = `
            SELECT * FROM card
            WHERE card_num = ?
          `;
      const [{ affectRows: result }] = await conn.query(query, [cardNum]);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  // 계좌 데이터 뽑기 dom 접근하여 form에 추가하기
  getAddressPick: async (addressNum) => {
    try {
      const conn = await pool.getConnection();
      const query = `
            SELECT * FROM address
            WHERE address_num = ?
          `;
      const [{ affectRows: result }] = await conn.query(query, [addressNum]);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  // 주문하기
  insertOrder: async (orderInfo, userNum) => {
    try {
      const conn = await pool.getConnection();
      const query = `
              insert into orders(
                order_date,
                order_zip_code,
                order_default_address,
                order_detail_adress,
                order_card_vaild_date,
                order_card_num,
                order_card_type,
                order_total,
                user_user_num
              ) values(
                ?
                ?
                ?
                ?
                ?
                ?
                ?
                ?
                ?
            )
            `;
      const [{ affectRows: result }] = await conn.query(query, [
        orderInfo.order_date,
        orderInfo.order_zip_code, // 이건 뭔지 잘모름
        orderInfo.order_default_address,
        orderInfo.order_detail_adress,
        orderInfo.order_card_vaild_date,
        orderInfo.order_card_num,
        orderInfo.order_card_type,
        orderInfo.order_total, // 총 금액 계산해서 보내세요
        userNum,
      ]);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  // 책 주문 저장하기
  insertBookOrder: async (orderBookInfo) => {
    try {
      const conn = await pool.getConnection();
      const query = `
              insert into orders(
                Order_order_num,
                Book_book_num,
                book_order_amount,
                book_order_price
              ) values(
                (select max(order_num) from orders)
                ?
                ?
                ?
            )
            `;
      const [{ affectRows: result }] = await conn.query(query, [
        orderBookInfo.book_book_num,
        orderBookInfo.book_order_amount,
        orderBookInfo.book_order_price,
      ]);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
