var express = require("express");
var router = express.Router();

const pool = require("../../config/dbConfig");
module.exports = {
  // 장바구니 책 추가하기
  addCart: async (userNum, bookNum) => {
    try {
      const conn = await pool.getConnection();
      const query = `
          INSERT INTO Cart
            (
              cart_date,
              User_user_num,
              cart_total,
              cart_pay_yn,  
              Book_book_num
            )
            values
            (
                now(),
                ?,
                0,
                0,
                ?
            )
      `;
      const [{ affectRows: result }] = await conn.query(query, [
        userNum,
        bookNum,
      ]);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  // 유저 장바구니 조회하기
  getCartBook: async (userNum) => {
    try {
      const conn = await pool.getConnection();
      const query = `
        select * from cart c 
        join book b on b.book_num = c.book_book_num
        where c.User_user_num = ?
            
      `;
      const [result] = await conn.query(query, [userNum]);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  // 장바구니에서 책 빼기
  deleteCartBook: async (cartNum) => {
    try {
      const conn = await pool.getConnection();
      const query = `
         DELETE FROM cart WHERE cart_num = ?
      `;
      const [{ affectRows: result }] = await conn.query(query, [cartNum]);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  // 결제 다했을 시 해당 쿼리문 발송
  deleteUserBook: async (userNum) => {
    try {
      const conn = await pool.getConnection();
      const query = `
         DELETE FROM cart 
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
};
