var express = require("express");
var router = express.Router();

const pool = require("../../config/dbConfig");
module.exports = {
  insertBook: async (cartInfo) => {
    try {
      const { cart_date, cart_total } = cartInfo;
      const conn = await pool.getConnection();
      const query = `INSERT INTO book
            (
              cart_date,
              cart_total
              ) VALUES (
                    ?,
                    ?
                );`;
      const [{ affectRows: result }] = await conn.query(query, [
        cart_date,
        cart_total,
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
      const query = "SELECT * FROM cart;";
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
