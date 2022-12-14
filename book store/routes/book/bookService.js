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
  //도서 전체 조회
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
  //도서번호로 도서 조회
  getBookForNum: async (bookNum) => {
    try {
      const conn = await pool.getConnection();
      const query = "SELECT * FROM book where book_num = ?;";
      const [[result]] = await conn.query(query, [bookNum]);
      conn.release();
      return result;
    } catch (error) {
      throw error;
    }
  },
  //도서 리뷰 조회
  getBookReview: async (bookNum) => {
    try {
      const conn = await pool.getConnection();
      const query =
        "SELECT content ,star_rating, user_name name FROM review left join user on review.user_user_num = user.user_num where review.book_book_num = ?;";
      const [result] = await conn.query(query, [bookNum]);
      conn.release();
      return result;
    } catch (error) {
      throw error;
    }
  },
  //도서 정보,별점 조회
  getBookRating: async (bookNum) => {
    try {
      const conn = await pool.getConnection();
      const query =
        "SELECT img_link,book_num,description,book_name,book_price,book_author,rating.average FROM book left join (select book_book_num, avg(star_rating) average from review)rating on book.book_num = rating.book_book_num where book.book_num = ?;";
      const [[result]] = await conn.query(query, [bookNum]);
      conn.release();
      return result;
    } catch (error) {
      throw error;
    }
  },

  //판매량 높은순 도서 조회
  getBestSeller: async () => {
    try {
      const conn = await pool.getConnection();
      const query = "SELECT * FROM book ORDER BY sell_count desc limit 12;";
      const [result] = await conn.query(query);
      conn.release();
      return result;
    } catch (error) {
      throw error;
    }
  },
  //이벤트 당첨자들의 주문번호 가져오기
  getEliteOrderNum: async (couponNum) => {
    try {
      const conn = await pool.getConnection();
      const query = "SELECT order_num FROM orders where own_coupon_num = ?;";
      const [[result]] = await conn.query(query, [couponNum]);
      conn.release();
      return result;
    } catch (error) {
      throw error;
    }
  },
  //이벤트 당첨자들의 주문목록
  getEliteSeller: async (orderNum) => {
    try {
      const conn = await pool.getConnection();
      const query =
        "SELECT book_book_num FROM book_order where order_order_num = ?;";
      const [result] = await conn.query(query, [orderNum]);
      conn.release();
      return result;
    } catch (error) {
      throw error;
    }
  },
  //이벤트 당첨자들의 쿠폰 사용 주문목록
  getEliteCouponSeller: async () => {
    try {
      const conn = await pool.getConnection();
      const query =
        "select * from book_order where order_order_num in (select order_num from orders where own_coupon_num in(select num from own_coupon where coupon_num=3));";
      const [result] = await conn.query(query);
      conn.release();
      return result;
    } catch (error) {
      throw error;
    }
  },
};
