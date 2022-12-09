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
  //도서 리뷰 조회
  getBookReview: async (bookNum) => {
    try {
      const conn = await pool.getConnection();
      const query =
        "SELECT content, createdDate, star_rating FROM review where book_book_num = ?;";
      const [result] = await conn.query(query, [bookNum]);
      conn.release();
      return result;
    } catch (error) {
      throw error;
    }
  },
  //판매량 높은순 도서 조회
  getBestBook: async () => {
    try {
      const conn = await pool.getConnection();
      const query = "SELECT * FROM book ORDER BY sell_count desc limit 5;";
      const [result] = await conn.query(query);
      conn.release();
      return result;
    } catch (error) {
      throw error;
    }
  },
};
