var express = require("express");

var router = express.Router();

const pool = require("../../config/dbConfig");
module.exports = {
  insertBook: async (bookInfo) => {
    try {
      const { book_name, book_stock, book_price, book_author } = bookInfo;
      const conn = await pool.getConnection();
      const query = `INSERT INTO book
            (
                book_name,
                book_stock,
                book_price,
                book_author
              ) VALUES (
                    ?,
                    ?,
                    ?,
                    ?
                );`;
      const [{ affectRows: result }] = await conn.query(query, [
        book_name,
        book_stock,
        book_price,
        book_author,
      ]);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  // 유저 장바구니 조회하기
  updateBookAverage: async (bookNum) => {
    try {
      const conn = await pool.getConnection();
      const query = `
        select * from cart c 
        join book b on b.book_num = c.book_book_num
        where c.User_user_num = ?
            
      `;
      const [result] = await conn.query(query, [bookNum]);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  //리뷰 작성
  insertReview: async (content, average, bookNum) => {
    try {
      const conn = await pool.getConnection();
      const query = `INSERT INTO review
            (
                content,
                date,
                average,
                Book_book_num,

              ) VALUES (
                    ?,
                    NOW(),
                    ?,
                    ?   
                );`;
      const [{ affectRows: result }] = await conn.query(query, [
        bookNum,
        content,
        average,
      ]);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  getBookList: async () => {
    try {
      const conn = await pool.getConnection();
      const query = "SELECT * FROM book;";
      const [result] = await conn.query(query);
      conn.release();
      return result;
    } catch (error) {
      throw error;
    }
  },
  //   updateUser: (bookInfo) => {},
  //   deleteUser: (bookInfo) => {},

  //   checkUser: async (bookInfo) => {
  //     try {
  //       console.log(bookInfo);
  //       const { id, pw } = userInfo;
  //       const conn = await pool.getConnection();
  //       const query = "select * from User where user_id = ?;";

  //       const [result] = await conn.query(query, [id]);
  //       conn.release();
  //       const { user_password } = result[0];

  //       if (user_password === pw) {
  //         return result[0];
  //       } else {
  //         return 0;
  //       }
  //     } catch (error) {
  //       console.log(error);
  //       throw error;
  //     }
  //   },
};
