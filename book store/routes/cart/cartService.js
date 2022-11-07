var express = require("express");
var router = express.Router();

const pool = require("../../config/dbConfig");
module.exports = {

  checkCart: async (userNum) => {
    try{
      // 0 카트 존재, 1 카트 결제한 상태
      const conn = await pool.getConnection();
      const query = `
            SELECT * FROM CART
            WHERE cart_pay = 0
            and User_user_num = ?
      `
      const [{affectRows: result}] = await conn.query(query, [
          userNum
      ])
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  selectCartNum: async (userNum) => {
    try{
      // 0 카트 존재, 1 카트 결제한 상태
      const conn = await pool.getConnection();
      const query = `
        SELECT cart_num FROM CART
        and User_user_num = ?
        order by cart_date desc
        limit 1;
      `
      const [{affectRows: result}] = await conn.query(query, [
        userNum
      ])
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  addCart: async(userNum) => {
    try{
      const conn = await pool.getConnection();
      const query = `
          INSERT INTO Cart
            (
              cart_date,
              User_user_num,
              cart_pay,  
            )
            values
            (
                now(),
                ?,
                0
            )
      `
      const [{affectRows: result}] = await conn.query(query, [
        userNum
      ])
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  getCartBook: async (cartNum) => {
    try{
      const conn = await pool.getConnection();
      const query = `
          SELECT * FROM Book_cart bc
            join book b on bc.Book_book_num = b.book_num 
          WHERE Book_cart_num = ?
            
      `
      const [{affectRows: result}] = await conn.query(query, [
        cartNum
      ])
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  addCartBook: async (bookNum, cartNum) => {
    try{
      const conn = await pool.getConnection();
      const query = `
          INSERT INTO Book_cart
            (
              Cart_cart_num,
              User_user_num,
            )
            values
            (
                ?,
                ?,
            )
      `
      const [{affectRows: result}] = await conn.query(query, [
        bookNum,
        cartNum
      ])
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  deleteCartBook: async (bookNum, cartNum) => {
    try {
      const conn = await pool.getConnection();
      const query = `
         DELETE FROM book_cart 
                WHERE cart_num = ?
                and book_num = ?
      `
      const [{affectRows: result}] = await conn.query(query, [
        bookNum,
        cartNum
      ])
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

};
