var express = require("express");

var router = express.Router();

const pool = require("../../config/dbConfig");
module.exports = {
  insertUser: async (userInfo) => {
    try {
      const { user_name, user_id, user_password, user_phone } = userInfo;
      const conn = await pool.getConnection();
      const query = `INSERT INTO User
            (
              user_name,
              user_id,
              user_password,
              user_phone,
              user_point
              ) VALUES (
                    ?,
                    ?,
                    ?,
                    ?,
                    0
                );`;
      const [{ affectRows: result }] = await conn.query(query, [
        user_name,
        user_id,
        user_password,
        user_phone,
      ]);

      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  getUserList: async () => {
    try {
      const conn = await pool.getConnection();
      const query = "SELECT * FROM User;";
      const [result] = await conn.query(query);
      conn.release();
      return result;
    } catch (error) {
      throw error;
    }
  },
  updateUser: (userInfo) => {},
  deleteUser: (userInfo) => {},

  checkUser: async (userInfo) => {
    try {
      console.log(userInfo);
      const { id, pw } = userInfo;
      const conn = await pool.getConnection();
      const query = "select * from User where user_id = ?;";

      const [result] = await conn.query(query, [id]);
      conn.release();
      const { user_password } = result[0];

      if (user_password === pw) {
        return result[0];
      } else {
        return 0;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  //결제후 포인트 추가
  plusPoint: async (price, userNum) => {
    try {
      const conn = await pool.getConnection();
      const query = `
            update User set user_point = user_point+? where user_num = ?
          `;
      await conn.query(query, [price, userNum]);
      conn.release();
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  // UserPoint 받아오기
  getUserPoint: async (userNum) => {
    try {
      const conn = await pool.getConnection();
      const query = `
          SELECT user_point from user
          WHERE user_num = ?
        `;
      const [result] = await conn.query(query, [userNum]);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  //리뷰 작성
  insertReview: async ({
    book_num,
    book_order_num,
    review_content,
    star_rating,
    userNum,
  }) => {
    try {
      const conn = await pool.getConnection();
      const query = `INSERT INTO review
            (
                content,
                createDate,
                star_rating,
                user_user_num,
                book_book_num,
                book_order_num

              ) VALUES (
                    ?,
                    NOW(),
                    ?,
                    ?,
                    ?,
                    ?   
                );`;
      const [{ affectRows: result }] = await conn.query(query, [
        review_content,
        star_rating,
        userNum,
        book_num,
        book_order_num,
      ]);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
