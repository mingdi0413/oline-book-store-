var express = require("express");

var router = express.Router();

const pool = require("../../config/dbConfig");
module.exports = {
  insertBook: async (orderInfo) => {
    try {
      const { order_date, order_total } = orderInfo;
      const conn = await pool.getConnection();
      const query = `INSERT INTO order
            (
                order_date,
                order_total,
                User_user_num
              ) VALUES (
                    ?,
                    ?,
                    ?
                );`;
      const [{ affectRows: result }] = await conn.query(query, [
        new Date(),
        order_total,
      ]);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
