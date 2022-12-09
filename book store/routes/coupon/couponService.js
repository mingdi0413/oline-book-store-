var express = require("express");

var router = express.Router();

const pool = require("../../config/dbConfig");
module.exports = {
  insertCoupon: async (couponInfo) => {
    try {
      const { name, type, discount } = couponInfo;
      const conn = await pool.getConnection();
      const query = `INSERT INTO coupon
            (
                name,
                type,
                created,
                end_Date,
                discount
              ) VALUES (
                    ?,
                    ?,
                    Now(),
                    DATE_ADD(Now(), INTERVAL 7 DAY),
                    ?
                 );`;
      const [{ affectRows: result }] = await conn.query(query, [
        name,
        type,

        discount,
      ]);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  // 보유 쿠폰 불러오기
  getOwnCoupon: async (userNum) => {
    try {
      const conn = await pool.getConnection();
      const query = `
          SELECT * from own_coupon where user_user_num = ?
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
